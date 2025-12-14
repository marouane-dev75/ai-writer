//! Real OpenAI provider implementation with streaming support.

use super::AIProvider;
use crate::ai::types::StreamEvent;
use anyhow::{Context, Result};
use async_trait::async_trait;
use eventsource_stream::Eventsource;
use futures::StreamExt;
use serde::{Deserialize, Serialize};
use tauri::Emitter;
use tokio::sync::mpsc;
use tokio::time::{timeout, Duration};

const OPENAI_API_URL: &str = "https://api.openai.com/v1/chat/completions";
const REQUEST_TIMEOUT: Duration = Duration::from_secs(60);
const STREAM_CHUNK_TIMEOUT: Duration = Duration::from_secs(30);

#[derive(Debug, Serialize)]
struct ChatCompletionRequest {
    model: String,
    messages: Vec<Message>,
    stream: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    temperature: Option<f32>,
    /// For older models (GPT-3.5, GPT-4, etc.)
    #[serde(skip_serializing_if = "Option::is_none")]
    max_tokens: Option<u32>,
    /// For newer models (GPT-4o, GPT-5, o1, etc.)
    #[serde(skip_serializing_if = "Option::is_none")]
    max_completion_tokens: Option<u32>,
}

#[derive(Debug, Serialize)]
struct Message {
    role: String,
    content: String,
}

#[derive(Debug, Deserialize)]
struct ChatCompletionChunk {
    choices: Vec<Choice>,
}

#[derive(Debug, Deserialize)]
struct Choice {
    delta: Delta,
    #[serde(default)]
    finish_reason: Option<String>,
}

#[derive(Debug, Deserialize)]
struct Delta {
    #[serde(default)]
    content: Option<String>,
}

#[derive(Debug, Deserialize)]
struct ErrorResponse {
    error: ErrorDetail,
}

#[derive(Debug, Deserialize)]
struct ErrorDetail {
    message: String,
    #[serde(rename = "type")]
    error_type: String,
    #[serde(default)]
    code: Option<String>,
}

pub struct OpenAI {
    api_key: String,
    model: String,
    temperature: Option<f32>,
    max_tokens: Option<u32>,
    client: reqwest::Client,
}

impl OpenAI {
    pub fn new(api_key: String, model: String, temperature: f32, max_tokens: u32) -> Result<Self> {
        if api_key.is_empty() {
            anyhow::bail!("OpenAI API key cannot be empty");
        }

        log::info!("Initializing OpenAI provider with model: {}", model);

        let client = reqwest::Client::builder()
            .timeout(REQUEST_TIMEOUT)
            .build()
            .context("Failed to create HTTP client")?;

        Ok(Self {
            api_key,
            model,
            temperature: Some(temperature),
            max_tokens: Some(max_tokens),
            client,
        })
    }

    async fn emit_event(app_handle: &tauri::AppHandle, event: StreamEvent) -> Result<()> {
        app_handle
            .emit("ai_stream_event", &event)
            .context("Failed to emit stream event")?;
        Ok(())
    }

    fn parse_error_response(&self, status: u16, body: &str) -> String {
        if let Ok(error_resp) = serde_json::from_str::<ErrorResponse>(body) {
            format!(
                "{} (type: {}, code: {:?})",
                error_resp.error.message,
                error_resp.error.error_type,
                error_resp.error.code
            )
        } else {
            format!("HTTP {} - {}", status, body)
        }
    }

    /// Determines if the model uses the new max_completion_tokens parameter
    /// instead of the legacy max_tokens parameter.
    fn uses_max_completion_tokens(&self) -> bool {
        let model_lower = self.model.to_lowercase();
        
        // Newer models that require max_completion_tokens
        model_lower.starts_with("gpt-4o")
            || model_lower.starts_with("gpt-5")
            || model_lower.starts_with("o1")
            || model_lower.starts_with("o3")
            || model_lower.contains("chatgpt-4o")
    }
}

#[async_trait]
impl AIProvider for OpenAI {
    async fn generate_stream(
        &self,
        system_prompt: String,
        user_prompt: String,
        mut cancel_rx: mpsc::Receiver<()>,
        app_handle: tauri::AppHandle,
        request_id: u64,
    ) -> Result<()> {
        log::info!(
            "Starting OpenAI stream: request_id={}, model={}",
            request_id,
            self.model
        );

        // Emit start event
        Self::emit_event(
            &app_handle,
            StreamEvent::Started {
                request_id,
                provider: "OpenAI".to_string(),
                model: self.model.clone(),
            },
        )
        .await
        .context("Failed to emit start event")?;

        // Build request with appropriate token limit parameter based on model
        let use_new_param = self.uses_max_completion_tokens();
        let request_body = ChatCompletionRequest {
            model: self.model.clone(),
            messages: vec![
                Message {
                    role: "system".to_string(),
                    content: system_prompt,
                },
                Message {
                    role: "user".to_string(),
                    content: user_prompt,
                },
            ],
            stream: true,
            temperature: self.temperature,
            max_tokens: if use_new_param { None } else { self.max_tokens },
            max_completion_tokens: if use_new_param { self.max_tokens } else { None },
        };

        log::debug!(
            "Sending request to OpenAI API (using {})",
            if use_new_param { "max_completion_tokens" } else { "max_tokens" }
        );

        // Make HTTP request
        let response = match timeout(
            REQUEST_TIMEOUT,
            self.client
                .post(OPENAI_API_URL)
                .header("Authorization", format!("Bearer {}", self.api_key))
                .header("Content-Type", "application/json")
                .json(&request_body)
                .send(),
        )
        .await
        {
            Ok(Ok(resp)) => resp,
            Ok(Err(e)) => {
                log::error!("Network error: {:#}", e);
                let error_msg = if e.is_timeout() {
                    "Request timeout - OpenAI API did not respond in time".to_string()
                } else if e.is_connect() {
                    "Connection failed - Unable to reach OpenAI API".to_string()
                } else {
                    format!("Network error: {}", e)
                };
                Self::emit_event(
                    &app_handle,
                    StreamEvent::Error {
                        request_id,
                        error: crate::ai::types::AIError::ProviderError(error_msg),
                    },
                )
                .await?;
                return Ok(());
            }
            Err(_) => {
                log::error!("Request timeout after {:?}", REQUEST_TIMEOUT);
                Self::emit_event(
                    &app_handle,
                    StreamEvent::Error {
                        request_id,
                        error: crate::ai::types::AIError::ProviderError(
                            "Request timeout".to_string(),
                        ),
                    },
                )
                .await?;
                return Ok(());
            }
        };

        // Check response status
        let status = response.status();
        if !status.is_success() {
            let status_code = status.as_u16();
            let error_body = response.text().await.unwrap_or_default();
            
            log::error!("API error: status={}, body={}", status_code, error_body);

            let error_msg = match status_code {
                401 => "Invalid API key - Please check your OpenAI API key".to_string(),
                429 => "Rate limit exceeded - Too many requests to OpenAI API".to_string(),
                400 => {
                    let parsed = self.parse_error_response(status_code, &error_body);
                    if parsed.contains("context_length_exceeded") || parsed.contains("maximum context length") {
                        format!("Context length exceeded - {}", parsed)
                    } else {
                        format!("Bad request - {}", parsed)
                    }
                }
                _ => self.parse_error_response(status_code, &error_body),
            };

            Self::emit_event(
                &app_handle,
                StreamEvent::Error {
                    request_id,
                    error: crate::ai::types::AIError::ProviderError(error_msg),
                },
            )
            .await?;
            return Ok(());
        }

        log::debug!("Received successful response, starting stream processing");

        // Process SSE stream
        let mut stream = response.bytes_stream().eventsource();
        let mut total_chunks = 0;

        loop {
            tokio::select! {
                // Check for cancellation
                _ = cancel_rx.recv() => {
                    log::info!("Stream cancelled: request_id={}", request_id);
                    Self::emit_event(
                        &app_handle,
                        StreamEvent::Cancelled { request_id },
                    )
                    .await?;
                    return Ok(());
                }
                // Process stream events with timeout
                event_result = timeout(STREAM_CHUNK_TIMEOUT, stream.next()) => {
                    match event_result {
                        Ok(Some(Ok(event))) => {
                            let data = event.data;
                            
                            // Check for stream completion
                            if data == "[DONE]" {
                                log::info!(
                                    "Stream completed: request_id={}, total_chunks={}",
                                    request_id,
                                    total_chunks
                                );
                                Self::emit_event(
                                    &app_handle,
                                    StreamEvent::Completed { request_id },
                                )
                                .await?;
                                return Ok(());
                            }

                            // Parse chunk
                            match serde_json::from_str::<ChatCompletionChunk>(&data) {
                                Ok(chunk) => {
                                    if let Some(choice) = chunk.choices.first() {
                                        if let Some(content) = &choice.delta.content {
                                            if !content.is_empty() {
                                                total_chunks += 1;
                                                log::debug!(
                                                    "Streaming chunk: request_id={}, chars={}",
                                                    request_id,
                                                    content.len()
                                                );

                                                Self::emit_event(
                                                    &app_handle,
                                                    StreamEvent::Chunk {
                                                        request_id,
                                                        content: content.clone(),
                                                    },
                                                )
                                                .await
                                                .context("Failed to emit chunk event")?;
                                            }
                                        }

                                        // Check for finish reason
                                        if choice.finish_reason.is_some() {
                                            log::info!(
                                                "Stream finished: request_id={}, reason={:?}, total_chunks={}",
                                                request_id,
                                                choice.finish_reason,
                                                total_chunks
                                            );
                                            Self::emit_event(
                                                &app_handle,
                                                StreamEvent::Completed { request_id },
                                            )
                                            .await?;
                                            return Ok(());
                                        }
                                    }
                                }
                                Err(e) => {
                                    log::warn!(
                                        "Failed to parse chunk (skipping): request_id={}, error={}, data={}",
                                        request_id,
                                        e,
                                        data
                                    );
                                    // Continue processing other chunks
                                }
                            }
                        }
                        Ok(Some(Err(e))) => {
                            log::error!("Stream error: request_id={}, error={:#}", request_id, e);
                            Self::emit_event(
                                &app_handle,
                                StreamEvent::Error {
                                    request_id,
                                    error: crate::ai::types::AIError::ProviderError(
                                        format!("Stream error: {}", e),
                                    ),
                                },
                            )
                            .await?;
                            return Ok(());
                        }
                        Ok(None) => {
                            // Stream ended without [DONE] marker
                            log::warn!("Stream ended unexpectedly: request_id={}", request_id);
                            Self::emit_event(
                                &app_handle,
                                StreamEvent::Completed { request_id },
                            )
                            .await?;
                            return Ok(());
                        }
                        Err(_) => {
                            log::error!("Stream chunk timeout: request_id={}", request_id);
                            Self::emit_event(
                                &app_handle,
                                StreamEvent::Error {
                                    request_id,
                                    error: crate::ai::types::AIError::ProviderError(
                                        "Stream timeout - No data received".to_string(),
                                    ),
                                },
                            )
                            .await?;
                            return Ok(());
                        }
                    }
                }
            }
        }
    }

    fn provider_name(&self) -> &str {
        "OpenAI"
    }
}

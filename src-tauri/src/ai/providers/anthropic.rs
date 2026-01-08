//! Real Anthropic provider implementation with streaming support.

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

const ANTHROPIC_API_URL: &str = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION: &str = "2023-06-01";
const REQUEST_TIMEOUT: Duration = Duration::from_secs(60);
const STREAM_CHUNK_TIMEOUT: Duration = Duration::from_secs(30);

#[derive(Debug, Serialize)]
struct MessagesRequest {
    model: String,
    messages: Vec<Message>,
    max_tokens: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    system: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    temperature: Option<f32>,
    stream: bool,
}

#[derive(Debug, Serialize)]
struct Message {
    role: String,
    content: String,
}

#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
enum StreamEventType {
    #[serde(rename = "message_start")]
    MessageStart {
        #[allow(dead_code)]
        message: MessageInfo,
    },
    #[serde(rename = "content_block_start")]
    ContentBlockStart {
        #[allow(dead_code)]
        index: u32,
        #[allow(dead_code)]
        content_block: ContentBlock,
    },
    #[serde(rename = "content_block_delta")]
    ContentBlockDelta {
        #[allow(dead_code)]
        index: u32,
        delta: Delta,
    },
    #[serde(rename = "content_block_stop")]
    ContentBlockStop {
        #[allow(dead_code)]
        index: u32,
    },
    #[serde(rename = "message_delta")]
    MessageDelta { delta: MessageDeltaInfo },
    #[serde(rename = "message_stop")]
    MessageStop,
    #[serde(rename = "ping")]
    Ping,
    #[serde(rename = "error")]
    Error { error: ErrorDetail },
}

#[derive(Debug, Deserialize)]
struct MessageInfo {
    #[allow(dead_code)]
    id: String,
    #[serde(rename = "type")]
    #[allow(dead_code)]
    message_type: String,
    #[allow(dead_code)]
    role: String,
    #[allow(dead_code)]
    model: String,
}

#[derive(Debug, Deserialize)]
struct ContentBlock {
    #[serde(rename = "type")]
    #[allow(dead_code)]
    block_type: String,
    #[allow(dead_code)]
    text: Option<String>,
}

#[derive(Debug, Deserialize)]
struct Delta {
    #[serde(rename = "type")]
    #[allow(dead_code)]
    delta_type: String,
    text: Option<String>,
}

#[derive(Debug, Deserialize)]
struct MessageDeltaInfo {
    stop_reason: Option<String>,
    #[allow(dead_code)]
    stop_sequence: Option<String>,
}

#[derive(Debug, Deserialize)]
struct ErrorResponse {
    #[serde(rename = "type")]
    #[allow(dead_code)]
    error_type: String,
    error: ErrorDetail,
}

#[derive(Debug, Deserialize)]
struct ErrorDetail {
    #[serde(rename = "type")]
    error_type: String,
    message: String,
}

pub struct Anthropic {
    api_key: String,
    model: String,
    temperature: Option<f32>,
    max_tokens: u32,
    client: reqwest::Client,
}

impl Anthropic {
    pub fn new(api_key: String, model: String, temperature: f32, max_tokens: u32) -> Result<Self> {
        if api_key.is_empty() {
            anyhow::bail!("Anthropic API key cannot be empty");
        }

        log::info!("Initializing Anthropic provider with model: {}", model);

        let client = reqwest::Client::builder()
            .timeout(REQUEST_TIMEOUT)
            .build()
            .context("Failed to create HTTP client")?;

        Ok(Self {
            api_key,
            model,
            temperature: Some(temperature),
            max_tokens,
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
                "{} (type: {})",
                error_resp.error.message,
                error_resp.error.error_type
            )
        } else {
            format!("HTTP {} - {}", status, body)
        }
    }
}

#[async_trait]
impl AIProvider for Anthropic {
    async fn generate_stream(
        &self,
        system_prompt: String,
        user_prompt: String,
        mut cancel_rx: mpsc::Receiver<()>,
        app_handle: tauri::AppHandle,
        request_id: u64,
    ) -> Result<()> {
        log::info!(
            "Starting Anthropic stream: request_id={}, model={}",
            request_id,
            self.model
        );

        // Emit start event
        Self::emit_event(
            &app_handle,
            StreamEvent::Started {
                request_id,
                provider: "Anthropic".to_string(),
                model: self.model.clone(),
            },
        )
        .await
        .context("Failed to emit start event")?;

        // Build request
        let request_body = MessagesRequest {
            model: self.model.clone(),
            messages: vec![Message {
                role: "user".to_string(),
                content: user_prompt,
            }],
            max_tokens: self.max_tokens,
            system: if system_prompt.is_empty() {
                None
            } else {
                Some(system_prompt)
            },
            temperature: self.temperature,
            stream: true,
        };

        log::debug!("Sending request to Anthropic API");

        // Make HTTP request
        let response = match timeout(
            REQUEST_TIMEOUT,
            self.client
                .post(ANTHROPIC_API_URL)
                .header("x-api-key", &self.api_key)
                .header("anthropic-version", ANTHROPIC_VERSION)
                .header("content-type", "application/json")
                .json(&request_body)
                .send(),
        )
        .await
        {
            Ok(Ok(resp)) => resp,
            Ok(Err(e)) => {
                log::error!("Network error: {:#}", e);
                let error_msg = if e.is_timeout() {
                    "Request timeout - Anthropic API did not respond in time".to_string()
                } else if e.is_connect() {
                    "Connection failed - Unable to reach Anthropic API".to_string()
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
                401 => "Invalid API key - Please check your Anthropic API key".to_string(),
                429 => "Rate limit exceeded - Too many requests to Anthropic API".to_string(),
                400 => {
                    let parsed = self.parse_error_response(status_code, &error_body);
                    if parsed.contains("prompt is too long") || parsed.contains("max_tokens") {
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

                            // Parse event
                            match serde_json::from_str::<StreamEventType>(&data) {
                                Ok(stream_event) => {
                                    match stream_event {
                                        StreamEventType::MessageStart { .. } => {
                                            log::debug!("Message started: request_id={}", request_id);
                                        }
                                        StreamEventType::ContentBlockStart { .. } => {
                                            log::debug!("Content block started: request_id={}", request_id);
                                        }
                                        StreamEventType::ContentBlockDelta { delta, .. } => {
                                            if let Some(text) = delta.text {
                                                if !text.is_empty() {
                                                    total_chunks += 1;

                                                    Self::emit_event(
                                                        &app_handle,
                                                        StreamEvent::Chunk {
                                                            request_id,
                                                            content: text,
                                                        },
                                                    )
                                                    .await
                                                    .context("Failed to emit chunk event")?;
                                                }
                                            }
                                        }
                                        StreamEventType::ContentBlockStop { .. } => {
                                            log::debug!("Content block stopped: request_id={}", request_id);
                                        }
                                        StreamEventType::MessageDelta { delta } => {
                                            log::debug!(
                                                "Message delta: request_id={}, stop_reason={:?}",
                                                request_id,
                                                delta.stop_reason
                                            );
                                        }
                                        StreamEventType::MessageStop => {
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
                                        StreamEventType::Ping => {
                                            log::debug!("Received ping: request_id={}", request_id);
                                        }
                                        StreamEventType::Error { error } => {
                                            log::error!(
                                                "Stream error event: request_id={}, error={:?}",
                                                request_id,
                                                error
                                            );
                                            Self::emit_event(
                                                &app_handle,
                                                StreamEvent::Error {
                                                    request_id,
                                                    error: crate::ai::types::AIError::ProviderError(
                                                        error.message,
                                                    ),
                                                },
                                            )
                                            .await?;
                                            return Ok(());
                                        }
                                    }
                                }
                                Err(e) => {
                                    log::warn!(
                                        "Failed to parse event (skipping): request_id={}, error={}, data={}",
                                        request_id,
                                        e,
                                        data
                                    );
                                    // Continue processing other events
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
                            // Stream ended without MessageStop
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
        "Anthropic"
    }
}

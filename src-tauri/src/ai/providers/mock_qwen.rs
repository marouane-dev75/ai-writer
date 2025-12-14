//! Mock Local Qwen provider implementation.

use super::AIProvider;
use crate::ai::types::StreamEvent;
use anyhow::{Context, Result};
use async_trait::async_trait;
use tauri::Emitter;
use tokio::sync::mpsc;
use tokio::time::{sleep, Duration};

const CHUNK_SIZE: usize = 5;
const CHUNK_DELAY_MS: u64 = 75;

pub struct MockLocalQwen {
    _model_path: String,
}

impl MockLocalQwen {
    pub fn new(_model_path: String) -> Self {
        log::info!("Initializing MockLocalQwen with model path: {}", _model_path);
        Self { _model_path }
    }

    async fn emit_event(
        app_handle: &tauri::AppHandle,
        event: StreamEvent,
    ) -> Result<()> {
        app_handle
            .emit("ai_stream_event", &event)
            .context("Failed to emit stream event")?;
        Ok(())
    }

    fn get_model_name(&self) -> String {
        "Qwen-Local".to_string()
    }
}

#[async_trait]
impl AIProvider for MockLocalQwen {
    async fn generate_stream(
        &self,
        system_prompt: String,
        user_prompt: String,
        mut cancel_rx: mpsc::Receiver<()>,
        app_handle: tauri::AppHandle,
        request_id: u64,
    ) -> Result<()> {
        let model_name = self.get_model_name();
        log::info!(
            "Starting LocalQwen stream: request_id={}, model={}",
            request_id,
            model_name
        );

        // Emit start event
        Self::emit_event(
            &app_handle,
            StreamEvent::Started {
                request_id,
                provider: "LocalQwen".to_string(),
                model: model_name.clone(),
            },
        )
        .await
        .context("Failed to emit start event")?;

        // Construct the full response text
        let full_text = format!(
            "[{}]\n{}",
            system_prompt,
            user_prompt
        );

        // Stream in chunks
        let chars: Vec<char> = full_text.chars().collect();
        for chunk_start in (0..chars.len()).step_by(CHUNK_SIZE) {
            // Check for cancellation
            if cancel_rx.try_recv().is_ok() {
                log::info!("Stream cancelled: request_id={}", request_id);
                Self::emit_event(
                    &app_handle,
                    StreamEvent::Cancelled { request_id },
                )
                .await?;
                return Ok(());
            }

            let chunk_end = (chunk_start + CHUNK_SIZE).min(chars.len());
            let chunk: String = chars[chunk_start..chunk_end].iter().collect();

            log::debug!(
                "Streaming chunk: request_id={}, chars={}",
                request_id,
                chunk
            );

            Self::emit_event(
                &app_handle,
                StreamEvent::Chunk {
                    request_id,
                    content: chunk,
                },
            )
            .await
            .context("Failed to emit chunk event")?;

            sleep(Duration::from_millis(CHUNK_DELAY_MS)).await;
        }

        // Emit completion event
        log::info!(
            "Stream completed: request_id={}, total_chars={}",
            request_id,
            full_text.len()
        );
        Self::emit_event(
            &app_handle,
            StreamEvent::Completed { request_id },
        )
        .await
        .context("Failed to emit completion event")?;

        Ok(())
    }

    fn provider_name(&self) -> &str {
        "LocalQwen"
    }
}

//! Stream execution logic for AI operations.

use crate::ai::providers::AIProvider;
use crate::ai::state::StateManager;
use crate::ai::types::{AIError, StreamEvent};
use anyhow::Result;
use std::sync::Arc;
use tauri::Emitter;
use tokio::sync::mpsc;

/// Executes AI streaming operations
pub struct Executor {
    state_manager: Arc<StateManager>,
}

impl Executor {
    /// Create a new executor
    pub fn new(state_manager: Arc<StateManager>) -> Self {
        log::info!("Initializing Executor");
        Self { state_manager }
    }

    /// Execute a streaming operation
    ///
    /// # Arguments
    /// * `provider` - The AI provider to use
    /// * `system_prompt` - System prompt for the model
    /// * `user_prompt` - User prompt for the model
    /// * `app_handle` - Tauri app handle for event emission
    ///
    /// # Returns
    /// The request ID for the operation
    pub async fn execute_stream(
        &self,
        provider: Arc<dyn AIProvider>,
        system_prompt: String,
        user_prompt: String,
        app_handle: tauri::AppHandle,
    ) -> Result<u64, AIError> {
        // Generate request ID
        let request_id = self.state_manager.next_request_id();

        // Create cancellation channel
        let (cancel_tx, cancel_rx) = mpsc::channel::<()>(1);

        // Register operation
        self.state_manager
            .start_operation(request_id, cancel_tx)
            .await?;

        log::info!(
            "Executing stream: request_id={}, provider={}",
            request_id,
            provider.provider_name()
        );

        // Clone for async task
        let state_manager = Arc::clone(&self.state_manager);

        // Spawn async task for streaming
        tokio::spawn(async move {
            let result = provider
                .generate_stream(
                    system_prompt,
                    user_prompt,
                    cancel_rx,
                    app_handle.clone(),
                    request_id,
                )
                .await;

            // Handle result
            match result {
                Ok(_) => {
                    log::info!("Stream execution completed successfully: request_id={}", request_id);
                }
                Err(e) => {
                    log::error!("Stream execution failed: request_id={}, error={:#}", request_id, e);
                    
                    // Emit error event
                    let error_event = StreamEvent::Error {
                        request_id,
                        error: AIError::ProviderError(e.to_string()),
                    };
                    
                    if let Err(emit_err) = app_handle.emit("ai_stream_event", &error_event) {
                        log::error!("Failed to emit error event: {:#}", emit_err);
                    }
                }
            }

            // Complete operation
            if let Err(e) = state_manager.complete_operation(request_id).await {
                log::error!("Failed to complete operation: {:#}", e);
            }
        });

        Ok(request_id)
    }

    /// Cancel the current streaming operation
    pub async fn cancel_stream(&self) -> Result<(), AIError> {
        log::info!("Cancelling current stream");
        self.state_manager.cancel_operation().await
    }
}

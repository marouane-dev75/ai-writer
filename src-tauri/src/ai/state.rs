//! Operation state management for AI streaming.

use crate::ai::types::{AIError, OperationState};
use anyhow::{Result};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use tokio::sync::RwLock;

/// Manages the state of AI operations
pub struct StateManager {
    operation_state: Arc<RwLock<OperationState>>,
    request_counter: Arc<AtomicU64>,
}

impl StateManager {
    /// Create a new state manager
    pub fn new() -> Self {
        log::info!("Initializing StateManager");
        Self {
            operation_state: Arc::new(RwLock::new(OperationState::default())),
            request_counter: Arc::new(AtomicU64::new(0)),
        }
    }

    /// Generate a new unique request ID
    pub fn next_request_id(&self) -> u64 {
        let id = self.request_counter.fetch_add(1, Ordering::SeqCst);
        log::debug!("Generated request_id: {}", id);
        id
    }

    /// Start a new operation
    ///
    /// Returns an error if an operation is already running
    pub async fn start_operation(
        &self,
        request_id: u64,
        cancel_tx: tokio::sync::mpsc::Sender<()>,
    ) -> Result<(), AIError> {
        let mut state = self.operation_state.write().await;
        
        if state.is_running {
            log::warn!(
                "Attempted to start operation {} while operation {} is running",
                request_id,
                state.current_request_id.unwrap_or(0)
            );
            return Err(AIError::OperationInProgress);
        }

        log::info!("Starting operation: request_id={}", request_id);
        state.is_running = true;
        state.current_request_id = Some(request_id);
        state.cancel_tx = Some(cancel_tx);

        Ok(())
    }

    /// Complete the current operation
    pub async fn complete_operation(&self, request_id: u64) -> Result<()> {
        let mut state = self.operation_state.write().await;
        
        if state.current_request_id == Some(request_id) {
            log::info!("Completing operation: request_id={}", request_id);
            state.is_running = false;
            state.current_request_id = None;
            state.cancel_tx = None;
        } else {
            log::warn!(
                "Attempted to complete operation {} but current is {:?}",
                request_id,
                state.current_request_id
            );
        }

        Ok(())
    }

    /// Cancel the current operation
    pub async fn cancel_operation(&self) -> Result<(), AIError> {
        let mut state = self.operation_state.write().await;
        
        if !state.is_running {
            log::warn!("Attempted to cancel but no operation is running");
            return Ok(());
        }

        let request_id = state.current_request_id.unwrap_or(0);
        log::info!("Cancelling operation: request_id={}", request_id);

        if let Some(cancel_tx) = state.cancel_tx.take() {
            if let Err(e) = cancel_tx.send(()).await {
                log::error!("Failed to send cancellation signal: {}", e);
            }
        }

        state.is_running = false;
        state.current_request_id = None;

        Ok(())
    }
}

impl Default for StateManager {
    fn default() -> Self {
        Self::new()
    }
}

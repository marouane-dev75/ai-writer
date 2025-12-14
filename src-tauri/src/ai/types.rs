//! Type definitions for AI module.

use serde::{Deserialize, Serialize};
use tokio::sync::mpsc;

/// Custom error types for AI operations
#[derive(Debug, Serialize, Clone)]
#[serde(tag = "type", content = "message")]
pub enum AIError {
    OperationInProgress,
    NoActiveProvider,
    ProviderError(String)
}

impl std::fmt::Display for AIError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AIError::OperationInProgress => write!(f, "An operation is already in progress"),
            AIError::NoActiveProvider => write!(f, "No active provider configured"),
            AIError::ProviderError(msg) => write!(f, "Provider error: {}", msg)
        }
    }
}

impl std::error::Error for AIError {}

/// Model loading and operational status
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "status")]
pub enum ModelStatus {
    Unloaded,
    Loading { provider: String },
    Loaded { provider: String, model: String },
    Error { provider: String, error: String },
}

/// Stream events emitted during generation
#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type")]
pub enum StreamEvent {
    Started {
        request_id: u64,
        provider: String,
        model: String,
    },
    Chunk {
        request_id: u64,
        content: String,
    },
    Completed {
        request_id: u64,
    },
    Error {
        request_id: u64,
        error: AIError,
    },
    Cancelled {
        request_id: u64,
    },
}

/// Operation state tracking
#[derive(Debug, Clone)]
pub struct OperationState {
    pub is_running: bool,
    pub current_request_id: Option<u64>,
    pub cancel_tx: Option<mpsc::Sender<()>>,
}

impl Default for OperationState {
    fn default() -> Self {
        Self {
            is_running: false,
            current_request_id: None,
            cancel_tx: None,
        }
    }
}

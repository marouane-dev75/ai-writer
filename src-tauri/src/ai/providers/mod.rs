//! AI provider trait and implementations.

mod mock_anthropic;
mod mock_qwen;
mod openai;

pub use mock_anthropic::MockAnthropic;
pub use mock_qwen::MockLocalQwen;
pub use openai::OpenAI;

use anyhow::Result;
use async_trait::async_trait;
use tokio::sync::mpsc;

/// Trait for AI providers that can generate streaming responses
#[async_trait]
pub trait AIProvider: Send + Sync {
    /// Generate a streaming response
    ///
    /// # Arguments
    /// * `system_prompt` - System prompt for the model
    /// * `user_prompt` - User prompt for the model
    /// * `cancel_rx` - Receiver for cancellation signals
    /// * `app_handle` - Tauri app handle for event emission
    /// * `request_id` - Unique request identifier
    async fn generate_stream(
        &self,
        system_prompt: String,
        user_prompt: String,
        mut cancel_rx: mpsc::Receiver<()>,
        app_handle: tauri::AppHandle,
        request_id: u64,
    ) -> Result<()>;

    /// Get the provider name
    fn provider_name(&self) -> &str;
}

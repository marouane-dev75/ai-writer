//! Tauri commands for AI operations.

use crate::ai::{AIError, AIManager, ModelStatus};
use tauri::State;

/// Get the current model status
#[tauri::command]
pub async fn get_model_status(
    ai_manager: State<'_, AIManager>,
) -> Result<ModelStatus, String> {
    log::debug!("Command: get_model_status");
    
    let status = ai_manager.get_status().await;
    
    log::debug!("Model status: {:?}", status);
    Ok(status)
}

/// Generate a streaming AI response
///
/// # Arguments
/// * `system_prompt` - System prompt for the model
/// * `user_prompt` - User prompt for the model
///
/// # Returns
/// The request ID for tracking the stream
#[tauri::command]
pub async fn generate_stream(
    system_prompt: String,
    user_prompt: String,
    ai_manager: State<'_, AIManager>,
    app_handle: tauri::AppHandle,
) -> Result<u64, String> {
    log::info!(
        "Command: generate_stream (system_len={}, user_len={})",
        system_prompt.len(),
        user_prompt.len()
    );

    ai_manager
        .generate_stream(system_prompt, user_prompt, app_handle)
        .await
        .map_err(|e| {
            log::error!("Failed to generate stream: {:#}", e);
            match e {
                AIError::OperationInProgress => {
                    "An operation is already in progress. Please cancel it first.".to_string()
                }
                AIError::NoActiveProvider => {
                    "No active AI provider configured.".to_string()
                }
                AIError::ProviderError(msg) => format!("Provider error: {}", msg)
            }
        })
}

/// Cancel the current streaming operation
#[tauri::command]
pub async fn cancel_stream(
    ai_manager: State<'_, AIManager>,
) -> Result<(), String> {
    log::info!("Command: cancel_stream");

    ai_manager
        .cancel_stream()
        .await
        .map_err(|e| {
            log::error!("Failed to cancel stream: {:#}", e);
            e.to_string()
        })
}

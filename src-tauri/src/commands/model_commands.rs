use crate::ai::model_manager::qwen::{
    download_qwen_model as download_qwen_model_impl, get_qwen_models, scan_qwen_models,
    QwenModelInfo, QwenScanResult,
};
use tauri::AppHandle;

/// Scans the base path for downloaded Qwen models
#[tauri::command]
pub async fn scan_qwen_models_cmd(base_path: String) -> Result<QwenScanResult, String> {
    log::info!("Command: scan_qwen_models - base_path: {}", base_path);

    scan_qwen_models(&base_path)
        .await
        .map_err(|e| {
            log::error!("Failed to scan Qwen models: {}", e);
            e.to_string()
        })
}

/// Returns the catalog of available Qwen models
#[tauri::command]
pub async fn get_qwen_models_cmd() -> Result<Vec<QwenModelInfo>, String> {
    log::info!("Command: get_qwen_models");

    Ok(get_qwen_models())
}

/// Downloads a Qwen model and its tokenizer
#[tauri::command]
pub async fn download_qwen_model_cmd(
    base_path: String,
    model_id: String,
    app: AppHandle,
) -> Result<(), String> {
    log::info!(
        "Command: download_qwen_model - base_path: {}, model_id: {}",
        base_path,
        model_id
    );

    download_qwen_model_impl(&base_path, &model_id, &app)
        .await
        .map_err(|e| {
            log::error!("Failed to download Qwen model: {}", e);
            e.to_string()
        })
}

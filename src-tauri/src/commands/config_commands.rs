use crate::config::{AppConfig, ConfigManager, FileConfigStorage};
use tauri::State;

/// Tauri command to load configuration
#[tauri::command]
pub async fn load_config(
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<AppConfig, String> {
    manager
        .load_config()
        .map_err(|e| format!("Failed to load config: {}", e))
}

/// Tauri command to save configuration
#[tauri::command]
pub async fn save_config(
    config: AppConfig,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    manager
        .save_config(&config)
        .map_err(|e| format!("Failed to save config: {}", e))
}

use crate::config::{AppConfig, ConfigManager, FileConfigStorage};
use tauri::State;

/// Tauri command to load configuration
#[tauri::command]
pub async fn load_config(
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<AppConfig, String> {
    log::debug!("load_config command invoked");
    
    manager.load_config()
        .map(|config| {
            log::info!("load_config command completed successfully");
            config
        })
        .map_err(|e| {
            let error_msg = format!("Failed to load config: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to save configuration
#[tauri::command]
pub async fn save_config(
    config: AppConfig,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    log::debug!("save_config command invoked");
    
    manager.save_config(&config)
        .map(|_| {
            log::info!("save_config command completed successfully");
        })
        .map_err(|e| {
            let error_msg = format!("Failed to save config: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

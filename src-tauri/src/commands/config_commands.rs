use crate::config::{AppConfig, ConfigManager, FileConfigStorage};
use tauri::State;

/// Tauri command to load configuration
#[tauri::command]
pub async fn load_config(
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<AppConfig, String> {
    log::debug!("load_config command invoked");
    
    match manager.load_config() {
        Ok(config) => {
            log::info!("load_config command completed successfully");
            Ok(config)
        }
        Err(e) => {
            let error_msg = format!("Failed to load config: {}", e);
            log::error!("{}", error_msg);
            Err(error_msg)
        }
    }
}

/// Tauri command to save configuration
#[tauri::command]
pub async fn save_config(
    config: AppConfig,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    log::debug!("save_config command invoked");
    
    match manager.save_config(&config) {
        Ok(_) => {
            log::info!("save_config command completed successfully");
            Ok(())
        }
        Err(e) => {
            let error_msg = format!("Failed to save config: {}", e);
            log::error!("{}", error_msg);
            Err(error_msg)
        }
    }
}

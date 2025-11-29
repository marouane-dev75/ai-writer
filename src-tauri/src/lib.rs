mod config;
mod commands;
mod logging;

use config::{ConfigManager, FileConfigStorage};
use commands::{load_config, save_config, get_logs, get_all_logs, clear_logs};
use logging::{init_logger, LogManager};
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// TODO clean up
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Get app data directory
            let app_data_dir = app.path().app_data_dir()
                .expect("Failed to get app data directory");
            
            // Initialize logger
            let log_path = app_data_dir.join("logs.txt");
            let logger = init_logger(log_path.clone(), log::Level::Trace)
                .expect("Failed to initialize logger");
            
            log::info!("Application started");
            log::info!("App data directory: {:?}", app_data_dir);
            
            // Create config manager
            let config_path = app_data_dir.join("config.json");
            let storage = FileConfigStorage::new(config_path)
                .expect("Failed to create config storage");
            
            let config_manager = ConfigManager::new(storage);
            
            // Create log manager
            let log_manager = LogManager::new(logger);
            
            // Manage state
            app.manage(config_manager);
            app.manage(log_manager);
            
            log::info!("Application setup completed");
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, load_config, save_config, get_logs, get_all_logs, clear_logs])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

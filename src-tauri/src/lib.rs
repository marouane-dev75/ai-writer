mod config;
mod commands;

use config::{ConfigManager, FileConfigStorage};
use commands::{load_config, save_config};
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Get app data directory and create config manager
            let app_data_dir = app.path().app_data_dir()
                .expect("Failed to get app data directory");
            
            let config_path = app_data_dir.join("config.json");
            let storage = FileConfigStorage::new(config_path)
                .expect("Failed to create config storage");
            
            let config_manager = ConfigManager::new(storage);
            
            // Manage state
            app.manage(config_manager);
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, load_config, save_config])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

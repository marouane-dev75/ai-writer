//! Application entry point and initialization.
//!
//! This module handles the Tauri application setup, including:
//! - Logger initialization
//! - Configuration management
//! - State management

mod commands;
mod config;
mod logging;

use anyhow::{Context, Result};
use config::*;
use logging::*;
use std::path::Path;
use tauri::Manager;

/// Initialize the logging system.
fn initialize_logging(app_data_dir: &Path) -> Result<LogManager> {
    let log_path = app_data_dir.join("logs.txt");
    let logger = init_logger(log_path, log::Level::Trace)
        .context("Failed to initialize logger")?;
    
    log::info!("Logger initialized at {:?}", app_data_dir.join("logs.txt"));
    
    Ok(LogManager::new(logger))
}

/// Initialize the configuration manager.
fn initialize_config(app_data_dir: &Path) -> Result<ConfigManager<FileConfigStorage>> {
    let config_path = app_data_dir.join("config.json");
    let storage = FileConfigStorage::new(config_path.clone())
        .context("Failed to create config storage")?;
    
    log::info!("Config storage initialized at {:?}", config_path);
    
    Ok(ConfigManager::new(storage))
}

/// Setup the Tauri application with required managers and state.
fn setup_app(app: &mut tauri::App) -> Result<()> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .context("Failed to get app data directory")?;
    
    log::info!("Application started");
    log::info!("App data directory: {:?}", app_data_dir);
    
    // Initialize managers
    let log_manager = initialize_logging(&app_data_dir)?;
    let config_manager = initialize_config(&app_data_dir)?;
    
    // Register state
    app.manage(log_manager);
    app.manage(config_manager);
    
    log::info!("Application setup completed");
    
    Ok(())
}

/// Run the Tauri application.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            setup_app(app).map_err(|e| {
                let error_msg = format!("Application setup failed: {:#}", e);
                eprintln!("{}", error_msg);
                e.into()
            })
        })
        .invoke_handler(tauri::generate_handler![
            commands::load_ai_providers_config,
            commands::save_ai_providers_config,
            commands::load_locale_config,
            commands::save_locale_config,
            commands::load_theme_config,
            commands::save_theme_config,
            commands::get_logs,
            commands::get_all_logs,
            commands::clear_logs
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

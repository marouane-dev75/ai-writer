//! Application entry point and initialization.
//!
//! This module handles the Tauri application setup, including:
//! - Logger initialization
//! - Configuration management
//! - AI provider management
//! - State management

mod ai;
mod commands;
mod config;
mod logging;

use ai::AIManager;
use anyhow::{Context, Result};
use config::types::AppConfig;
use config::*;
use logging::*;
use std::path::Path;
use tauri::Manager;

/// Initialize the logging system.
fn initialize_logging(app_data_dir: &Path) -> Result<LogManager> {
    let log_path = app_data_dir.join("logs.txt");
    let logger = init_logger(log_path, log::Level::Debug)
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

/// Initialize the AI manager with configuration.
/// Returns an AI manager even if initialization fails - errors are tracked internally.
async fn initialize_ai(config_manager: &ConfigManager<FileConfigStorage>) -> AIManager {
    let ai_manager = AIManager::new();
    
    // Load full config and extract AI providers config
    let app_config = match config_manager.load_config() {
        Ok(config) => config,
        Err(e) => {
            log::error!("Failed to load app config: {:#}", e);
            log::info!("Using default configuration");
            AppConfig::default()
        }
    };
    
    // Initialize AI manager with config - errors are handled internally
    if let Err(e) = ai_manager.initialize(&app_config.ai_providers).await {
        log::error!("Failed to initialize AI manager: {:#}", e);
        log::info!("AI manager will remain in error state until reconfigured");
    } else {
        log::info!("AI manager initialized successfully");
    }
    
    ai_manager
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
    
    // Initialize AI manager (async) - always succeeds, errors tracked internally
    let ai_manager = tauri::async_runtime::block_on(async {
        initialize_ai(&config_manager).await
    });
    
    // Register state
    app.manage(log_manager);
    app.manage(config_manager);
    app.manage(ai_manager);
    
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
            commands::get_model_status,
            commands::generate_stream,
            commands::cancel_stream,
            commands::load_ai_providers_config,
            commands::save_ai_providers_config,
            commands::load_locale_config,
            commands::save_locale_config,
            commands::load_theme_config,
            commands::save_theme_config,
            commands::load_transform_presets_config,
            commands::save_transform_presets_config,
            commands::add_transform_preset,
            commands::update_transform_preset,
            commands::delete_transform_preset,
            commands::get_selected_preset,
            commands::set_selected_preset,
            commands::get_logs,
            commands::get_all_logs,
            commands::clear_logs,
            commands::scan_qwen_models_cmd,
            commands::get_qwen_models_cmd,
            commands::download_qwen_model_cmd,
            commands::save_markdown_file,
            commands::open_markdown_file,
            commands::get_system_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

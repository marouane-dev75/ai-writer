use crate::config::{ConfigManager, FileConfigStorage, AIProvidersConfig, LocaleConfig, ThemeConfig};
use tauri::State;

/// Tauri command to load AI providers configuration
#[tauri::command]
pub async fn load_ai_providers_config(
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<AIProvidersConfig, String> {
    log::debug!("load_ai_providers_config command invoked");
    
    manager.load_config()
        .map(|config| {
            log::info!("load_ai_providers_config command completed successfully");
            config.ai_providers
        })
        .map_err(|e| {
            let error_msg = format!("Failed to load AI providers config: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to save AI providers configuration
#[tauri::command]
pub async fn save_ai_providers_config(
    ai_providers_config: AIProvidersConfig,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    log::debug!("save_ai_providers_config command invoked");
    
    // Load current full config
    let mut config = manager.load_config()
        .map_err(|e| {
            let error_msg = format!("Failed to load config for AI providers update: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })?;
    
    // Update only AI providers section
    config.ai_providers = ai_providers_config;
    
    // Save back the full config
    manager.save_config(&config)
        .map(|_| {
            log::info!("save_ai_providers_config command completed successfully");
        })
        .map_err(|e| {
            let error_msg = format!("Failed to save AI providers config: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to load locale configuration
#[tauri::command]
pub async fn load_locale_config(
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<LocaleConfig, String> {
    log::debug!("load_locale_config command invoked");
    
    manager.load_config()
        .map(|config| {
            log::info!("load_locale_config command completed successfully");
            config.locale
        })
        .map_err(|e| {
            let error_msg = format!("Failed to load locale config: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to save locale configuration
#[tauri::command]
pub async fn save_locale_config(
    locale_config: LocaleConfig,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    log::debug!("save_locale_config command invoked");
    
    // Load current full config
    let mut config = manager.load_config()
        .map_err(|e| {
            let error_msg = format!("Failed to load config for locale update: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })?;
    
    // Update only locale section
    config.locale = locale_config;
    
    // Save back the full config
    manager.save_config(&config)
        .map(|_| {
            log::info!("save_locale_config command completed successfully");
        })
        .map_err(|e| {
            let error_msg = format!("Failed to save locale config: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to load theme configuration
#[tauri::command]
pub async fn load_theme_config(
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<ThemeConfig, String> {
    log::debug!("load_theme_config command invoked");
    
    manager.load_config()
        .map(|config| {
            log::info!("load_theme_config command completed successfully");
            config.theme
        })
        .map_err(|e| {
            let error_msg = format!("Failed to load theme config: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to save theme configuration
#[tauri::command]
pub async fn save_theme_config(
    theme_config: ThemeConfig,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    log::debug!("save_theme_config command invoked");
    
    // Load current full config
    let mut config = manager.load_config()
        .map_err(|e| {
            let error_msg = format!("Failed to load config for theme update: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })?;
    
    // Update only theme section
    config.theme = theme_config;
    
    // Save back the full config
    manager.save_config(&config)
        .map(|_| {
            log::info!("save_theme_config command completed successfully");
        })
        .map_err(|e| {
            let error_msg = format!("Failed to save theme config: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

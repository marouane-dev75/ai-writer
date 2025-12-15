use crate::config::{ConfigManager, FileConfigStorage, AIProvidersConfig, AIPresetsConfig, AIPreset, LocaleConfig, ThemeConfig};
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

/// Tauri command to load AI presets configuration
#[tauri::command]
pub async fn load_ai_presets_config(
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<AIPresetsConfig, String> {
    log::debug!("load_ai_presets_config command invoked");
    
    manager.load_config()
        .map(|config| {
            log::info!("load_ai_presets_config command completed successfully");
            config.ai_presets
        })
        .map_err(|e| {
            let error_msg = format!("Failed to load AI presets config: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to add a new AI preset
#[tauri::command]
pub async fn add_ai_preset(
    preset: AIPreset,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    log::debug!("add_ai_preset command invoked for preset: {}", preset.name);
    
    // Load current full config
    let mut config = manager.load_config()
        .map_err(|e| {
            let error_msg = format!("Failed to load config for adding AI preset: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })?;
    
    // Add the new preset
    config.ai_presets.presets.push(preset);
    
    // Save back the full config
    manager.save_config(&config)
        .map(|_| {
            log::info!("add_ai_preset command completed successfully");
        })
        .map_err(|e| {
            let error_msg = format!("Failed to add AI preset: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to update an existing AI preset
#[tauri::command]
pub async fn update_ai_preset(
    id: String,
    preset: AIPreset,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    log::debug!("update_ai_preset command invoked for preset id: {}", id);
    
    // Load current full config
    let mut config = manager.load_config()
        .map_err(|e| {
            let error_msg = format!("Failed to load config for updating AI preset: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })?;
    
    // Find and update the preset
    let preset_index = config.ai_presets.presets
        .iter()
        .position(|p| p.id == id)
        .ok_or_else(|| {
            let error_msg = format!("AI preset with id '{}' not found", id);
            log::error!("{}", error_msg);
            error_msg
        })?;
    
    config.ai_presets.presets[preset_index] = preset;
    
    // Save back the full config
    manager.save_config(&config)
        .map(|_| {
            log::info!("update_ai_preset command completed successfully");
        })
        .map_err(|e| {
            let error_msg = format!("Failed to update AI preset: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to delete an AI preset
#[tauri::command]
pub async fn delete_ai_preset(
    id: String,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    log::debug!("delete_ai_preset command invoked for preset id: {}", id);
    
    // Load current full config
    let mut config = manager.load_config()
        .map_err(|e| {
            let error_msg = format!("Failed to load config for deleting AI preset: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })?;
    
    // Find and remove the preset
    let preset_index = config.ai_presets.presets
        .iter()
        .position(|p| p.id == id)
        .ok_or_else(|| {
            let error_msg = format!("AI preset with id '{}' not found", id);
            log::error!("{}", error_msg);
            error_msg
        })?;
    
    config.ai_presets.presets.remove(preset_index);
    
    // Save back the full config
    manager.save_config(&config)
        .map(|_| {
            log::info!("delete_ai_preset command completed successfully");
        })
        .map_err(|e| {
            let error_msg = format!("Failed to delete AI preset: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

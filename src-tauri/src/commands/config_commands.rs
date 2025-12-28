use crate::config::{ConfigManager, FileConfigStorage, AIProvidersConfig, LocaleConfig, ThemeConfig, TransformPresetsConfig, TransformPreset};
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

/// Tauri command to load transform presets configuration
#[tauri::command]
pub async fn load_transform_presets_config(
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<TransformPresetsConfig, String> {
    log::debug!("load_transform_presets_config command invoked");
    
    manager.load_config()
        .map(|config| {
            log::info!("load_transform_presets_config command completed successfully");
            config.transform_presets
        })
        .map_err(|e| {
            let error_msg = format!("Failed to load transform presets config: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to save transform presets configuration
#[tauri::command]
pub async fn save_transform_presets_config(
    transform_presets_config: TransformPresetsConfig,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    log::debug!("save_transform_presets_config command invoked");
    
    // Load current full config
    let mut config = manager.load_config()
        .map_err(|e| {
            let error_msg = format!("Failed to load config for transform presets update: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })?;
    
    // Update only transform presets section
    config.transform_presets = transform_presets_config;
    
    // Save back the full config
    manager.save_config(&config)
        .map(|_| {
            log::info!("save_transform_presets_config command completed successfully");
        })
        .map_err(|e| {
            let error_msg = format!("Failed to save transform presets config: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to add a transform preset
#[tauri::command]
pub async fn add_transform_preset(
    preset: TransformPreset,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    log::debug!("add_transform_preset command invoked for preset: {}", preset.title);
    
    // Load current full config
    let mut config = manager.load_config()
        .map_err(|e| {
            let error_msg = format!("Failed to load config for adding preset: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })?;
    
    // Add preset to the list
    config.transform_presets.presets.push(preset);
    
    // Save back the full config
    manager.save_config(&config)
        .map(|_| {
            log::info!("add_transform_preset command completed successfully");
        })
        .map_err(|e| {
            let error_msg = format!("Failed to add transform preset: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to update a transform preset
#[tauri::command]
pub async fn update_transform_preset(
    preset: TransformPreset,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    log::debug!("update_transform_preset command invoked for preset ID: {}", preset.id);
    
    // Load current full config
    let mut config = manager.load_config()
        .map_err(|e| {
            let error_msg = format!("Failed to load config for updating preset: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })?;
    
    // Find and update the preset
    if let Some(existing_preset) = config.transform_presets.presets.iter_mut().find(|p| p.id == preset.id) {
        *existing_preset = preset;
    } else {
        let error_msg = format!("Preset with ID {} not found", preset.id);
        log::error!("{}", error_msg);
        return Err(error_msg);
    }
    
    // Save back the full config
    manager.save_config(&config)
        .map(|_| {
            log::info!("update_transform_preset command completed successfully");
        })
        .map_err(|e| {
            let error_msg = format!("Failed to update transform preset: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to delete a transform preset
#[tauri::command]
pub async fn delete_transform_preset(
    id: String,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    log::debug!("delete_transform_preset command invoked for preset ID: {}", id);
    
    // Load current full config
    let mut config = manager.load_config()
        .map_err(|e| {
            let error_msg = format!("Failed to load config for deleting preset: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })?;
    
    // Remove the preset
    let initial_len = config.transform_presets.presets.len();
    config.transform_presets.presets.retain(|p| p.id != id);
    
    if config.transform_presets.presets.len() == initial_len {
        let error_msg = format!("Preset with ID {} not found", id);
        log::error!("{}", error_msg);
        return Err(error_msg);
    }
    
    // Save back the full config
    manager.save_config(&config)
        .map(|_| {
            log::info!("delete_transform_preset command completed successfully");
        })
        .map_err(|e| {
            let error_msg = format!("Failed to delete transform preset: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

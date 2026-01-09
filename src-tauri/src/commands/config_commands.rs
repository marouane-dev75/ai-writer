use crate::config::{ConfigManager, FileConfigStorage, AIProvidersConfig, LocaleConfig, ThemeConfig, TransformPresetsConfig, TransformPreset, EditorLayoutConfig, AiGeneratorConfig};
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
    
    // Clear selected preset if it was the deleted one
    if let Some(selected_id) = &config.transform_presets.selected_preset_id {
        if selected_id == &id {
            config.transform_presets.selected_preset_id = None;
            log::debug!("Cleared selected preset as it was deleted");
        }
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

/// Tauri command to get the selected preset ID
#[tauri::command]
pub async fn get_selected_preset(
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<Option<String>, String> {
    log::debug!("get_selected_preset command invoked");
    
    manager.load_config()
        .map(|config| {
            log::info!("get_selected_preset command completed successfully");
            config.transform_presets.selected_preset_id
        })
        .map_err(|e| {
            let error_msg = format!("Failed to get selected preset: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to set the selected preset ID
#[tauri::command]
pub async fn set_selected_preset(
    preset_id: Option<String>,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    log::debug!("set_selected_preset command invoked with preset_id: {:?}", preset_id);
    
    // Load current full config
    let mut config = manager.load_config()
        .map_err(|e| {
            let error_msg = format!("Failed to load config for setting selected preset: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })?;
    
    // Validate that the preset exists if an ID is provided
    if let Some(ref id) = preset_id {
        if !config.transform_presets.presets.iter().any(|p| &p.id == id) {
            let error_msg = format!("Preset with ID {} not found", id);
            log::error!("{}", error_msg);
            return Err(error_msg);
        }
    }
    
    // Update selected preset ID
    config.transform_presets.selected_preset_id = preset_id;
    
    // Save back the full config
    manager.save_config(&config)
        .map(|_| {
            log::info!("set_selected_preset command completed successfully");
        })
        .map_err(|e| {
            let error_msg = format!("Failed to set selected preset: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to load editor layout configuration
#[tauri::command]
pub async fn load_editor_layout_config(
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<EditorLayoutConfig, String> {
    log::debug!("load_editor_layout_config command invoked");
    
    manager.load_config()
        .map(|config| {
            log::info!("load_editor_layout_config command completed successfully");
            config.editor_layout
        })
        .map_err(|e| {
            let error_msg = format!("Failed to load editor layout config: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to save editor layout configuration
#[tauri::command]
pub async fn save_editor_layout_config(
    editor_layout_config: EditorLayoutConfig,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    log::debug!("save_editor_layout_config command invoked");
    
    // Load current full config
    let mut config = manager.load_config()
        .map_err(|e| {
            let error_msg = format!("Failed to load config for editor layout update: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })?;
    
    // Update only editor layout section
    config.editor_layout = editor_layout_config;
    
    // Save back the full config
    manager.save_config(&config)
        .map(|_| {
            log::info!("save_editor_layout_config command completed successfully");
        })
        .map_err(|e| {
            let error_msg = format!("Failed to save editor layout config: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to load AI generator configuration
#[tauri::command]
pub async fn load_ai_generator_config(
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<AiGeneratorConfig, String> {
    log::debug!("load_ai_generator_config command invoked");
    
    manager.load_config()
        .map(|config| {
            log::info!("load_ai_generator_config command completed successfully");
            config.ai_generator
        })
        .map_err(|e| {
            let error_msg = format!("Failed to load AI generator config: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to save AI generator configuration
#[tauri::command]
pub async fn save_ai_generator_config(
    ai_generator_config: AiGeneratorConfig,
    manager: State<'_, ConfigManager<FileConfigStorage>>,
) -> Result<(), String> {
    log::debug!("save_ai_generator_config command invoked");
    
    // Load current full config
    let mut config = manager.load_config()
        .map_err(|e| {
            let error_msg = format!("Failed to load config for AI generator update: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })?;
    
    // Update only AI generator section
    config.ai_generator = ai_generator_config;
    
    // Save back the full config
    manager.save_config(&config)
        .map(|_| {
            log::info!("save_ai_generator_config command completed successfully");
        })
        .map_err(|e| {
            let error_msg = format!("Failed to save AI generator config: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

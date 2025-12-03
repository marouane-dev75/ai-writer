use super::storage::ConfigStorage;
use super::types::AppConfig;
use anyhow::Result;
use std::sync::Arc;

/// Configuration manager that handles business logic
/// Uses dependency injection to depend on ConfigStorage abstraction (DIP)
pub struct ConfigManager<S: ConfigStorage> {
    storage: Arc<S>,
}

impl<S: ConfigStorage> ConfigManager<S> {
    pub fn new(storage: S) -> Self {
        log::debug!("Creating new ConfigManager instance");
        Self {
            storage: Arc::new(storage),
        }
    }

    /// Load configuration from storage
    pub fn load_config(&self) -> Result<AppConfig> {
        log::debug!("Loading configuration");
        match self.storage.load() {
            Ok(config) => {
                log::info!("Configuration loaded successfully");
                log::trace!("Loaded config: {:?}", config);
                Ok(config)
            }
            Err(e) => {
                log::error!("Failed to load configuration: {}", e);
                Err(e)
            }
        }
    }

    /// Save configuration to storage
    pub fn save_config(&self, config: &AppConfig) -> Result<()> {
        log::debug!("Saving configuration");
        log::trace!("Config to save: {:?}", config);
        match self.storage.save(config) {
            Ok(_) => {
                log::info!("Configuration saved successfully");
                Ok(())
            }
            Err(e) => {
                log::error!("Failed to save configuration: {}", e);
                Err(e)
            }
        }
    }
}

impl<S: ConfigStorage> Clone for ConfigManager<S> {
    fn clone(&self) -> Self {
        Self {
            storage: Arc::clone(&self.storage),
        }
    }
}

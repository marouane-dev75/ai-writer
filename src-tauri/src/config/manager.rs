use super::error::ConfigError;
use super::storage::ConfigStorage;
use super::types::AppConfig;
use std::sync::Arc;

/// Configuration manager that handles business logic
/// Uses dependency injection to depend on ConfigStorage abstraction (DIP)
pub struct ConfigManager<S: ConfigStorage> {
    storage: Arc<S>,
}

impl<S: ConfigStorage> ConfigManager<S> {
    pub fn new(storage: S) -> Self {
        Self {
            storage: Arc::new(storage),
        }
    }

    /// Load configuration from storage
    pub fn load_config(&self) -> Result<AppConfig, ConfigError> {
        self.storage.load()
    }

    /// Save configuration to storage
    pub fn save_config(&self, config: &AppConfig) -> Result<(), ConfigError> {
        self.storage.save(config)
    }

    /// Update a specific part of the configuration
    pub fn update_config<F>(&self, updater: F) -> Result<AppConfig, ConfigError>
    where
        F: FnOnce(&mut AppConfig),
    {
        let mut config = self.load_config()?;
        updater(&mut config);
        self.save_config(&config)?;
        Ok(config)
    }
}

impl<S: ConfigStorage> Clone for ConfigManager<S> {
    fn clone(&self) -> Self {
        Self {
            storage: Arc::clone(&self.storage),
        }
    }
}

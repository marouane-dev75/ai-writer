use super::error::ConfigError;
use super::types::AppConfig;
use std::fs;
use std::path::PathBuf;

/// Trait defining the abstraction for configuration storage (DIP)
pub trait ConfigStorage: Send + Sync {
    fn load(&self) -> Result<AppConfig, ConfigError>;
    fn save(&self, config: &AppConfig) -> Result<(), ConfigError>;
}

/// Concrete implementation using filesystem storage
pub struct FileConfigStorage {
    file_path: PathBuf,
}

impl FileConfigStorage {
    pub fn new(file_path: PathBuf) -> Result<Self, ConfigError> {
        // Ensure parent directory exists
        if let Some(parent) = file_path.parent() {
            fs::create_dir_all(parent).map_err(|e| {
                ConfigError::IoError(format!("Failed to create config directory: {}", e))
            })?;
        }

        Ok(Self { file_path })
    }
}

impl ConfigStorage for FileConfigStorage {
    fn load(&self) -> Result<AppConfig, ConfigError> {
        // If file doesn't exist, return default config
        if !self.file_path.exists() {
            return Ok(AppConfig::default());
        }

        let contents = fs::read_to_string(&self.file_path)?;
        let config: AppConfig = serde_json::from_str(&contents)?;
        Ok(config)
    }

    fn save(&self, config: &AppConfig) -> Result<(), ConfigError> {
        let json = serde_json::to_string_pretty(config)
            .map_err(|e| ConfigError::SerializationError(e.to_string()))?;

        fs::write(&self.file_path, json)?;
        Ok(())
    }
}

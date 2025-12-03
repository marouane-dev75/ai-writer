use super::types::AppConfig;
use anyhow::{Context, Result};
use std::fs;
use std::path::PathBuf;

/// Trait defining the abstraction for configuration storage (DIP)
pub trait ConfigStorage: Send + Sync {
    fn load(&self) -> Result<AppConfig>;
    fn save(&self, config: &AppConfig) -> Result<()>;
}

/// Concrete implementation using filesystem storage
pub struct FileConfigStorage {
    file_path: PathBuf,
}

impl FileConfigStorage {
    pub fn new(file_path: PathBuf) -> Result<Self> {
        log::debug!("Initializing FileConfigStorage at path: {:?}", file_path);
        
        // Ensure parent directory exists
        if let Some(parent) = file_path.parent() {
            log::debug!("Creating config directory: {:?}", parent);
            fs::create_dir_all(parent)
                .context("Failed to create config directory")?;
        }

        log::info!("FileConfigStorage initialized successfully");
        Ok(Self { file_path })
    }
}

impl ConfigStorage for FileConfigStorage {
    fn load(&self) -> Result<AppConfig> {
        log::debug!("Loading config from file: {:?}", self.file_path);
        
        // If file doesn't exist, return default config
        if !self.file_path.exists() {
            log::info!("Config file does not exist, using default configuration");
            return Ok(AppConfig::default());
        }

        log::trace!("Reading config file contents");
        let contents = fs::read_to_string(&self.file_path)
            .context("Failed to read config file")?;
        
        log::trace!("Deserializing config from JSON");
        let config: AppConfig = serde_json::from_str(&contents)
            .context("Failed to deserialize config")?;
        
        log::debug!("Config loaded from file successfully");
        Ok(config)
    }

    fn save(&self, config: &AppConfig) -> Result<()> {
        log::debug!("Saving config to file: {:?}", self.file_path);
        
        log::trace!("Serializing config to JSON");
        let json = serde_json::to_string_pretty(config)
            .context("Failed to serialize config")?;

        log::trace!("Writing config to file");
        fs::write(&self.file_path, json)
            .context("Failed to write config file")?;
        
        log::debug!("Config saved to file successfully");
        Ok(())
    }
}

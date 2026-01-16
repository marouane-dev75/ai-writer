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
        // Ensure parent directory exists
        if let Some(parent) = file_path.parent() {
            fs::create_dir_all(parent)
                .context("Failed to create config directory")?;
        }

        Ok(Self { file_path })
    }
}

impl ConfigStorage for FileConfigStorage {
    fn load(&self) -> Result<AppConfig> {
        // If file doesn't exist, return default config
        if !self.file_path.exists() {
            return Ok(AppConfig::default());
        }

        let contents = fs::read_to_string(&self.file_path)
            .context("Failed to read config file")?;

        let config: AppConfig = serde_json::from_str(&contents)
            .context("Failed to deserialize config")?;

        Ok(config)
    }

    fn save(&self, config: &AppConfig) -> Result<()> {
        let json = serde_json::to_string_pretty(config)
            .context("Failed to serialize config")?;

        fs::write(&self.file_path, json)
            .context("Failed to write config file")?;

        Ok(())
    }
}

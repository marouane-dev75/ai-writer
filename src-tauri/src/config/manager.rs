use super::storage::ConfigStorage;
use super::types::AppConfig;
use anyhow::Result;
use std::sync::{Arc, RwLock};

/// Configuration manager that handles business logic
/// Uses dependency injection to depend on ConfigStorage abstraction (DIP)
/// Implements in-memory caching to avoid redundant disk I/O
pub struct ConfigManager<S: ConfigStorage> {
    storage: Arc<S>,
    cache: Arc<RwLock<Option<AppConfig>>>,
}

impl<S: ConfigStorage> ConfigManager<S> {
    pub fn new(storage: S) -> Self {
        log::debug!("Creating new ConfigManager instance with cache");
        Self {
            storage: Arc::new(storage),
            cache: Arc::new(RwLock::new(None)),
        }
    }

    /// Load configuration from storage with caching
    /// First checks the in-memory cache, only reads from disk if cache is empty
    pub fn load_config(&self) -> Result<AppConfig> {
        log::debug!("Loading configuration");
        
        // Try to read from cache first
        {
            let cache_read = self.cache.read().map_err(|e| {
                anyhow::anyhow!("Failed to acquire cache read lock: {}", e)
            })?;
            
            if let Some(cached_config) = cache_read.as_ref() {
                log::debug!("Configuration loaded from cache (cache hit)");
                return Ok(cached_config.clone());
            }
        }
        
        // Cache miss - load from storage
        log::debug!("Cache miss - loading configuration from disk");
        match self.storage.load() {
            Ok(config) => {
                log::info!("Configuration loaded successfully from disk");
                log::trace!("Loaded config: {:?}", config);
                
                // Update cache
                let mut cache_write = self.cache.write().map_err(|e| {
                    anyhow::anyhow!("Failed to acquire cache write lock: {}", e)
                })?;
                *cache_write = Some(config.clone());
                log::debug!("Configuration cached in memory");
                
                Ok(config)
            }
            Err(e) => {
                log::error!("Failed to load configuration: {}", e);
                Err(e)
            }
        }
    }

    /// Save configuration to storage and update cache
    pub fn save_config(&self, config: &AppConfig) -> Result<()> {
        log::debug!("Saving configuration");
        log::trace!("Config to save: {:?}", config);
        
        match self.storage.save(config) {
            Ok(_) => {
                log::info!("Configuration saved successfully to disk");
                
                // Update cache with new config
                let mut cache_write = self.cache.write().map_err(|e| {
                    anyhow::anyhow!("Failed to acquire cache write lock: {}", e)
                })?;
                *cache_write = Some(config.clone());
                log::debug!("Cache updated with new configuration");
                
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
            cache: Arc::clone(&self.cache),
        }
    }
}

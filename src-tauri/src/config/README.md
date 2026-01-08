# Configuration Module

Application configuration management system following DDD and SOLID principles.

## Architecture

- **Dependency Inversion Principle (DIP):** Uses trait-based abstraction (`ConfigStorage`) to decouple business logic from storage implementation
- **Single Responsibility:** Each module has a focused purpose

## Files

- **`types.rs`** - Configuration data structures (AppConfig, ThemeConfig, LocaleConfig, AIProvidersConfig) with serde serialization
- **`storage.rs`** - Storage abstraction trait and filesystem implementation (FileConfigStorage) for JSON persistence
- **`manager.rs`** - Business logic layer (ConfigManager) that orchestrates config loading/saving through the storage abstraction
- **`mod.rs`** - Public API exports

## Key Features

- JSON-based configuration persistence
- Default values for all config sections
- Comprehensive logging at debug/info/error levels
- Thread-safe with Arc-based cloning

## Usage

```rust
use crate::config::{ConfigManager, FileConfigStorage};

// Initialize storage
let storage = FileConfigStorage::new(config_path)?;

// Create manager
let manager = ConfigManager::new(storage);

// Load configuration
let config = manager.load_config()?;

// Save configuration
manager.save_config(&config)?;
```

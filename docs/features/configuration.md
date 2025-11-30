# Configuration Management System

## Overview

Persistent storage for application settings using a Rust backend with JSON file storage. Supports theme and locale configurations with a clean separation between frontend and backend layers.

## Architecture

### Backend (Rust)

**Configuration Types** ([`src-tauri/src/config/types.rs`](../../src-tauri/src/config/types.rs))
```rust
pub struct AppConfig {
    pub theme: ThemeConfig,
    pub locale: LocaleConfig,
}

pub struct ThemeConfig {
    pub dark_mode: bool,
}

pub struct LocaleConfig {
    pub language: String,
}
```

**Storage Trait** ([`src-tauri/src/config/storage.rs`](../../src-tauri/src/config/storage.rs))
- `ConfigStorage` trait defines persistence interface
- `FileConfigStorage` implements JSON file storage
- Location: `{APP_DATA_DIR}/config.json`
- Thread-safe (Send + Sync)

**Configuration Manager** ([`src-tauri/src/config/manager.rs`](../../src-tauri/src/config/manager.rs))
- `load_config()` - Load from storage
- `save_config()` - Save to storage
- `update_config()` - Atomic update with closure
- Generic over storage implementation (DIP)

**Error Handling** ([`src-tauri/src/config/error.rs`](../../src-tauri/src/config/error.rs))
```rust
pub enum ConfigError {
    IoError(String),
    SerializationError(String),
    DeserializationError(String),
    InvalidPath(String),
}
```

**Tauri Commands** ([`src-tauri/src/commands/config_commands.rs`](../../src-tauri/src/commands/config_commands.rs))
```rust
#[tauri::command]
pub async fn load_config(manager: State<'_, ConfigManager<FileConfigStorage>>) 
    -> Result<AppConfig, String>

#[tauri::command]
pub async fn save_config(config: AppConfig, manager: State<'_, ConfigManager<FileConfigStorage>>) 
    -> Result<(), String>
```

### Frontend (TypeScript)

**Configuration Service** ([`src/features/configuration/services/config.service.ts`](../../src/features/configuration/services/config.service.ts))
```typescript
export interface ConfigService {
  loadConfig(): Promise<AppConfig>;
  saveConfig(config: AppConfig): Promise<void>;
}

// Singleton instance
export const configService: ConfigService = new TauriConfigService();
```

**Configuration Types** ([`src/features/configuration/types.ts`](../../src/features/configuration/types.ts))
```typescript
export interface AppConfig {
  theme: ThemeConfig;
  locale: LocaleConfig;
}
```

**Storage Bridges**
- [`ConfigThemeStorage`](../../src/features/theme/service/ConfigThemeStorage.ts) - Bridges theme system with config service
- [`ConfigLocaleStorage`](../../src/features/i18n/ConfigLocaleStorage.ts) - Bridges i18n system with config service

## Data Flow

### Loading Configuration
1. Feature provider (Theme/I18n) mounts
2. Storage bridge calls `configService.loadConfig()`
3. Service invokes Tauri `load_config` command
4. ConfigManager loads from FileStorage
5. Configuration returned to frontend
6. Feature applies settings

### Saving Configuration
1. User changes setting (theme/language)
2. Storage bridge loads current config
3. Updates relevant section (theme/locale)
4. Calls `configService.saveConfig(config)`
5. Service invokes Tauri `save_config` command
6. ConfigManager persists to FileStorage

## Usage

### Adding New Configuration Fields

**1. Update Rust types:**
```rust
// src-tauri/src/config/types.rs
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub theme: ThemeConfig,
    pub locale: LocaleConfig,
    pub editor: EditorConfig,  // New field
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EditorConfig {
    pub auto_save: bool,
    pub font_size: u32,
}

impl Default for EditorConfig {
    fn default() -> Self {
        Self {
            auto_save: true,
            font_size: 14,
        }
    }
}
```

**2. Update TypeScript types:**
```typescript
// src/features/configuration/types.ts
export interface AppConfig {
  theme: ThemeConfig;
  locale: LocaleConfig;
  editor: EditorConfig;
}

export interface EditorConfig {
  auto_save: boolean;
  font_size: number;
}
```

**3. Create storage bridge (if needed):**
```typescript
// src/features/editor/services/ConfigEditorStorage.ts
export class ConfigEditorStorage implements EditorStorage {
  async loadEditor(): Promise<EditorConfig> {
    const config = await configService.loadConfig();
    return config.editor;
  }

  async saveEditor(editor: EditorConfig): Promise<void> {
    const config = await configService.loadConfig();
    config.editor = editor;
    await configService.saveConfig(config);
  }
}
```

### Best Practices

- Use `configService` singleton for all config operations
- Create storage bridges to isolate feature-specific config access
- Follow DIP: features depend on storage interfaces, not concrete implementations
- Generate TypeScript types from Rust using `cargo tauri dev` for type safety
- Handle errors appropriately in both frontend and backend layers

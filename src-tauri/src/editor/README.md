# Editor Module

Editor state persistence system for saving and loading editor content.

## Architecture

Simple module providing functions to persist editor state as JSON in the application's data directory.

## Files

- **`mod.rs`** - Module declarations and public exports
- **`storage.rs`** - Core storage functions for editor state persistence

## Key Features

- JSON-based editor state persistence
- Automatic app data directory management
- Graceful handling of missing state files
- Comprehensive error handling with anyhow
- Debug logging for operations

## Usage

```rust
use crate::editor::{save_editor_state, load_editor_state, clear_editor_state};
use tauri::AppHandle;

// Save editor state
save_editor_state(&app_handle, r#"{"content": "editor text"}"#)?;

// Load editor state
let state = load_editor_state(&app_handle)?;
if state.is_empty() {
    // No saved state
}

// Clear saved state
clear_editor_state(&app_handle)?;
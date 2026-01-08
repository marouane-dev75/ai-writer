use anyhow::{Context, Result};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

const EDITOR_STATE_FILE: &str = "editor_state.json";

/// Get the path to the editor state file in the app data directory
fn get_editor_state_path(app: &AppHandle) -> Result<PathBuf> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .context("Failed to get app data directory")?;

    // Ensure the directory exists
    fs::create_dir_all(&app_data_dir)
        .context("Failed to create app data directory")?;

    Ok(app_data_dir.join(EDITOR_STATE_FILE))
}

/// Save editor state to disk
pub fn save_editor_state(app: &AppHandle, state: &str) -> Result<()> {
    let path = get_editor_state_path(app)?;
    
    fs::write(&path, state)
        .context("Failed to write editor state file")?;
    
    log::debug!("Saved editor state to: {:?}", path);
    Ok(())
}

/// Load editor state from disk
pub fn load_editor_state(app: &AppHandle) -> Result<String> {
    let path = get_editor_state_path(app)?;
    
    if !path.exists() {
        log::debug!("No saved editor state found");
        return Ok(String::new());
    }
    
    let content = fs::read_to_string(&path)
        .context("Failed to read editor state file")?;
    
    log::debug!("Loaded editor state from: {:?}", path);
    Ok(content)
}

/// Clear saved editor state
pub fn clear_editor_state(app: &AppHandle) -> Result<()> {
    let path = get_editor_state_path(app)?;
    
    if path.exists() {
        fs::remove_file(&path)
            .context("Failed to remove editor state file")?;
        log::debug!("Cleared editor state from: {:?}", path);
    }
    
    Ok(())
}

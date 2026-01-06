use anyhow::Result;
use tauri::AppHandle;

#[tauri::command]
pub async fn save_editor_state(app: AppHandle, state: String) -> Result<(), String> {
    save_editor_state_impl(&app, &state)
        .map_err(|e| e.to_string())
}

fn save_editor_state_impl(app: &AppHandle, state: &str) -> Result<()> {
    crate::editor::save_editor_state(app, state)
}

#[tauri::command]
pub async fn load_editor_state(app: AppHandle) -> Result<String, String> {
    load_editor_state_impl(&app)
        .map_err(|e| e.to_string())
}

fn load_editor_state_impl(app: &AppHandle) -> Result<String> {
    crate::editor::load_editor_state(app)
}

#[tauri::command]
pub async fn clear_editor_state(app: AppHandle) -> Result<(), String> {
    clear_editor_state_impl(&app)
        .map_err(|e| e.to_string())
}

fn clear_editor_state_impl(app: &AppHandle) -> Result<()> {
    crate::editor::clear_editor_state(app)
}

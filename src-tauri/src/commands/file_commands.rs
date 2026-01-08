use anyhow::{Context, Result};
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;

#[tauri::command]
pub async fn save_markdown_file(app: AppHandle, content: String) -> Result<(), String> {
    save_markdown_file_impl(app, content)
        .await
        .map_err(|e| e.to_string())
}

async fn save_markdown_file_impl(app: AppHandle, content: String) -> Result<()> {
    // Open save dialog
    let file_path = app
        .dialog()
        .file()
        .add_filter("Markdown", &["md"])
        .set_file_name("document.md")
        .blocking_save_file();

    if let Some(path) = file_path {
        let path_str = path.to_string();
        std::fs::write(&path_str, content)
            .context("Failed to write markdown file")?;
        log::info!("Saved markdown file to: {}", path_str);
    }

    Ok(())
}

#[tauri::command]
pub async fn open_markdown_file(app: AppHandle) -> Result<String, String> {
    open_markdown_file_impl(app)
        .await
        .map_err(|e| e.to_string())
}

async fn open_markdown_file_impl(app: AppHandle) -> Result<String> {
    // Open file dialog
    let file_path = app
        .dialog()
        .file()
        .add_filter("Markdown", &["md"])
        .blocking_pick_file();

    if let Some(path) = file_path {
        let path_str = path.to_string();
        let content = std::fs::read_to_string(&path_str)
            .context("Failed to read markdown file")?;
        log::info!("Opened markdown file from: {}", path_str);
        Ok(content)
    } else {
        Ok(String::new())
    }
}

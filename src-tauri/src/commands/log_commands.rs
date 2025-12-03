use crate::logging::{LogManager, LogResponse};
use tauri::State;

/// Tauri command to get logs from a specific cursor position
#[tauri::command]
pub async fn get_logs(
    cursor: u64,
    manager: State<'_, LogManager>,
) -> Result<LogResponse, String> {    
    manager.get_logs(cursor)
        .map(|response| {
            response
        })
        .map_err(|e| {
            let error_msg = format!("Failed to get logs: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to get all logs
#[tauri::command]
pub async fn get_all_logs(
    manager: State<'_, LogManager>,
) -> Result<LogResponse, String> {
    log::debug!("get_all_logs command invoked");
    
    manager.get_all_logs()
        .map(|response| {
            log::info!("get_all_logs command completed successfully, returned {} entries", response.entries.len());
            response
        })
        .map_err(|e| {
            let error_msg = format!("Failed to get all logs: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

/// Tauri command to clear all logs
#[tauri::command]
pub async fn clear_logs(
    manager: State<'_, LogManager>,
) -> Result<(), String> {
    log::debug!("clear_logs command invoked");
    
    manager.clear_logs()
        .map(|_| {
            log::info!("clear_logs command completed successfully");
        })
        .map_err(|e| {
            let error_msg = format!("Failed to clear logs: {}", e);
            log::error!("{}", error_msg);
            error_msg
        })
}

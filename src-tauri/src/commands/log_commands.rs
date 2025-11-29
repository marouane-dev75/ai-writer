use crate::logging::{LogManager, LogResponse};
use tauri::State;

#[tauri::command]
pub async fn get_logs(cursor: u64, log_manager: State<'_, LogManager>) -> Result<LogResponse, String> {
    match log_manager.get_logs(cursor) {
        Ok(response) => Ok(response),
        Err(e) => {
            log::error!("get_logs command failed: {}", e);
            Err(e)
        }
    }
}

#[tauri::command]
pub async fn get_all_logs(log_manager: State<'_, LogManager>) -> Result<LogResponse, String> {
    log::debug!("get_all_logs command invoked");
    
    match log_manager.get_all_logs() {
        Ok(response) => {
            log::info!("get_all_logs command completed successfully, returned {} entries", response.entries.len());
            Ok(response)
        }
        Err(e) => {
            log::error!("get_all_logs command failed: {}", e);
            Err(e)
        }
    }
}

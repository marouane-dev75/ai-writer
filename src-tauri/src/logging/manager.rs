use super::logger::FileLogger;
use super::types::LogResponse;
use std::sync::Arc;

pub struct LogManager {
    logger: Arc<FileLogger>,
}

impl LogManager {
    pub fn new(logger: Arc<FileLogger>) -> Self {
        Self { logger }
    }

    pub fn get_logs(&self, cursor: u64) -> Result<LogResponse, String> {
        self.logger.get_logs(cursor)
    }

    pub fn get_all_logs(&self) -> Result<LogResponse, String> {
        self.logger.get_all_logs()
    }

    pub fn clear_logs(&self) -> Result<(), String> {
        self.logger.clear()
            .map_err(|e| format!("Failed to clear logs: {}", e))
    }
}

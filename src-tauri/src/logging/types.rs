use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogEntry {
    pub timestamp: String,
    pub level: String,
    pub target: String,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LogResponse {
    pub entries: Vec<LogEntry>,
    pub cursor: u64,
}

impl LogEntry {
    pub fn new(timestamp: String, level: String, target: String, message: String) -> Self {
        Self {
            timestamp,
            level,
            target,
            message,
        }
    }
}

use super::types::{LogEntry, LogResponse};
use std::fs::File;
use std::io::{BufRead, BufReader, Seek, SeekFrom};
use std::path::PathBuf;

pub struct LogManager {
    log_path: PathBuf,
}

impl LogManager {
    pub fn new(log_path: PathBuf) -> Self {
        Self { log_path }
    }

    pub fn get_logs(&self, cursor: u64) -> Result<LogResponse, String> {
        let file = File::open(&self.log_path)
            .map_err(|e| format!("Failed to open log file: {}", e))?;

        let mut reader = BufReader::new(file);

        // Seek to cursor position
        reader
            .seek(SeekFrom::Start(cursor))
            .map_err(|e| format!("Failed to seek to cursor position: {}", e))?;

        let mut entries = Vec::new();
        let mut current_position = cursor;

        for line in reader.lines() {
            match line {
                Ok(line_content) => {
                    // Update position (line length + newline character)
                    current_position += line_content.len() as u64 + 1;

                    if let Some(entry) = self.parse_log_line(&line_content) {
                        entries.push(entry);
                    }
                }
                Err(e) => {
                    log::warn!("Failed to read log line: {}", e);
                    break;
                }
            }
        }

        Ok(LogResponse {
            entries,
            cursor: current_position,
        })
    }

    pub fn get_all_logs(&self) -> Result<LogResponse, String> {
        self.get_logs(0)
    }

    fn parse_log_line(&self, line: &str) -> Option<LogEntry> {
        // Expected format: [TIMESTAMP] [LEVEL] [TARGET] MESSAGE
        let parts: Vec<&str> = line.splitn(4, ']').collect();

        if parts.len() < 4 {
            return None;
        }

        let timestamp = parts[0].trim_start_matches('[').trim().to_string();
        let level = parts[1].trim_start_matches('[').trim().to_string();
        let target = parts[2].trim_start_matches('[').trim().to_string();
        let message = parts[3].trim().to_string();

        Some(LogEntry::new(timestamp, level, target, message))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_log_line() {
        let manager = LogManager::new(PathBuf::from("test.log"));
        let line = "[2025-11-29T14:55:00.123Z] [INFO] [ai_editor::config] Configuration loaded";

        let entry = manager.parse_log_line(line).unwrap();

        assert_eq!(entry.timestamp, "2025-11-29T14:55:00.123Z");
        assert_eq!(entry.level, "INFO");
        assert_eq!(entry.target, "ai_editor::config");
        assert_eq!(entry.message, "Configuration loaded");
    }
}

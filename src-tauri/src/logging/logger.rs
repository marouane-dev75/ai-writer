use chrono::Local;
use log::{Level, Log, Metadata, Record};
use std::fs::{File, OpenOptions};
use std::io::{BufRead, BufReader, Seek, SeekFrom, Write};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use super::types::{LogEntry, LogResponse};

pub struct FileLogger {
    file: Mutex<File>,
    log_path: PathBuf,
}

impl FileLogger {
    pub fn new(log_path: PathBuf) -> Result<Self, std::io::Error> {
        // Create parent directory if it doesn't exist
        if let Some(parent) = log_path.parent() {
            std::fs::create_dir_all(parent)?;
        }

        // Open file in write mode (truncate if exists)
        let file = OpenOptions::new()
            .create(true)
            .write(true)
            .truncate(true)
            .open(&log_path)?;

        Ok(Self {
            file: Mutex::new(file),
            log_path,
        })
    }

    pub fn clear(&self) -> Result<(), std::io::Error> {
        if let Ok(mut file) = self.file.lock() {
            file.set_len(0)?;
            file.seek(SeekFrom::Start(0))?;
            file.flush()?;
        }
        Ok(())
    }

    pub fn get_logs(&self, cursor: u64) -> Result<LogResponse, String> {
        // Open a separate read handle since self.file is locked for writing
        // This allows concurrent reads while the logger continues writing
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

impl Log for FileLogger {
    fn enabled(&self, _metadata: &Metadata) -> bool {
        true
    }

    fn log(&self, record: &Record) {
        if self.enabled(record.metadata()) {
            let timestamp = Local::now().to_rfc3339();
            let level = record.level();
            let target = record.target();
            let message = record.args();

            let log_line = format!("[{}] [{}] [{}] {}\n", timestamp, level, target, message);

            if let Ok(mut file) = self.file.lock() {
                let _ = file.write_all(log_line.as_bytes());
                let _ = file.flush();
            }
        }
    }

    fn flush(&self) {
        if let Ok(mut file) = self.file.lock() {
            let _ = file.flush();
        }
    }
}

pub fn init_logger(log_path: PathBuf, level: Level) -> Result<Arc<FileLogger>, Box<dyn std::error::Error>> {
    let logger = Arc::new(FileLogger::new(log_path)?);
    log::set_boxed_logger(Box::new(logger.clone()))?;
    log::set_max_level(level.to_level_filter());
    Ok(logger)
}

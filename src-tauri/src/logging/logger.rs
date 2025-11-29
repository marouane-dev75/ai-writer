use chrono::Local;
use log::{Level, Log, Metadata, Record};
use std::fs::{File, OpenOptions};
use std::io::Write;
use std::path::PathBuf;
use std::sync::Mutex;

pub struct FileLogger {
    file: Mutex<File>,
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
            .open(log_path)?;

        Ok(Self {
            file: Mutex::new(file),
        })
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

pub fn init_logger(log_path: PathBuf, level: Level) -> Result<(), Box<dyn std::error::Error>> {
    let logger = FileLogger::new(log_path)?;
    log::set_boxed_logger(Box::new(logger))?;
    log::set_max_level(level.to_level_filter());
    Ok(())
}

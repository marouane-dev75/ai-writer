# Logging Module

File-based logging system with cursor-based log streaming and retrieval.

## Architecture

- Custom logger implementing Rust's `log::Log` trait
- Concurrent read/write support for real-time log streaming
- Structured log format: `[TIMESTAMP] [LEVEL] [TARGET] MESSAGE`

## Files

- **`types.rs`** - Data structures (LogEntry, LogResponse) for log representation
- **`logger.rs`** - Core FileLogger implementation with write/read/clear operations and cursor-based streaming
- **`manager.rs`** - High-level API (LogManager) for log operations
- **`mod.rs`** - Public API exports

## Key Features

- Cursor-based incremental log reading (for streaming/tailing)
- Thread-safe concurrent reads while writing
- Log parsing and structured output
- Comprehensive unit tests
- Automatic log directory creation

## Usage

```rust
use crate::logging::{init_logger, LogManager};
use log::Level;

// Initialize logger
let logger = init_logger(log_path, Level::Debug)?;

// Create manager
let manager = LogManager::new(logger);

// Get all logs
let response = manager.get_all_logs()?;

// Get logs from cursor (for streaming)
let response = manager.get_logs(cursor)?;

// Clear logs
manager.clear_logs()?;

// Use standard logging macros
log::info!("Application started");
log::debug!("Debug information");
log::error!("Error occurred: {}", error);
```

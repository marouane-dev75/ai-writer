# Logging System

## Overview

Real-time application logging with file persistence, cursor-based streaming, and web-based viewer with filtering capabilities.

## Architecture

### Backend (Rust)

- **FileLogger** (`src-tauri/src/logging/logger.rs`) - Thread-safe file writer implementing `log::Log` trait
- **LogManager** (`src-tauri/src/logging/manager.rs`) - Manages log operations (get, clear)
- **Commands** (`src-tauri/src/commands/log_commands.rs`) - Tauri IPC endpoints for frontend communication

### Frontend (TypeScript)

- **logService** (`src/features/logging/services/log.service.ts`) - API client for log operations
- **useLogStream** (`src/features/logging/hooks/useLogStream.ts`) - React hook with polling, filtering, and auto-scroll
- **LogViewer** (`src/features/logging/components/LogViewer.tsx`) - UI component with level filtering, search, and export

## Core Features

### Backend
- **Format:** `[TIMESTAMP] [LEVEL] [TARGET] MESSAGE`
- **Cursor-based reading:** Only new logs transmitted to frontend
- **Thread-safe:** Mutex-protected concurrent writes
- **File location:** `{APP_DATA_DIR}/logs.txt`
- **Persistence:** Truncated on app restart

### Frontend
- **Real-time polling:** Default 1s interval (configurable)
- **Level filtering:** ALL, TRACE, DEBUG, INFO, WARN, ERROR
- **Text search:** Across messages and targets
- **Auto-scroll:** Toggle for following new logs
- **Export:** Copy to clipboard or download as text file

## Usage

### Backend: Adding Logs

```rust
use log::{trace, debug, info, warn, error};

// Different log levels
trace!("Detailed trace information");
debug!("Debug information: {:?}", some_value);
info!("Operation completed successfully");
warn!("Warning: potential issue detected");
error!("Error occurred: {}", error_message);

// In commands
#[tauri::command]
pub async fn my_command() -> Result<String, String> {
    log::debug!("my_command invoked");
    
    match perform_operation() {
        Ok(result) => {
            log::info!("Operation successful");
            Ok(result)
        }
        Err(e) => {
            log::error!("Operation failed: {}", e);
            Err(e.to_string())
        }
    }
}
```

### Frontend: Using the Log Viewer

```typescript
// In a page component
import { LogViewer } from '../features/logging';

export const LogsPage = () => {
  return <LogViewer />;
};
```

### Custom Hook Usage

```typescript
import { useLogStream } from '../features/logging';

const MyComponent = () => {
  const { filteredLogs, setFilterLevel, clearLogs } = useLogStream({
    pollInterval: 2000,  // Poll every 2 seconds
    autoScroll: true,
  });

  return (
    <div>
      <button onClick={() => setFilterLevel('ERROR')}>
        Show Errors Only
      </button>
      <button onClick={clearLogs}>Clear</button>
      {filteredLogs.map((log, i) => (
        <div key={i}>{log.message}</div>
      ))}
    </div>
  );
};
```

## API Reference

### Tauri Commands

```rust
// Get logs from cursor position
#[tauri::command]
pub async fn get_logs(cursor: u64, log_manager: State<'_, LogManager>) 
    -> Result<LogResponse, String>

// Get all logs (cursor = 0)
#[tauri::command]
pub async fn get_all_logs(log_manager: State<'_, LogManager>) 
    -> Result<LogResponse, String>

// Clear log file
#[tauri::command]
pub async fn clear_logs(log_manager: State<'_, LogManager>) 
    -> Result<(), String>
```

### Hook Interface

```typescript
useLogStream(options?: {
  pollInterval?: number;      // Default: 1000ms
  autoScroll?: boolean;       // Default: true
  filterLevel?: LogLevel;     // Default: 'ALL'
}): {
  logs: LogEntry[];           // All logs
  filteredLogs: LogEntry[];   // Filtered logs
  isLoading: boolean;         // Loading state
  error: string | null;       // Error message
  clearLogs: () => void;      // Clear function
  setFilterLevel: (level: LogLevel) => void;
  setSearchTerm: (term: string) => void;
  autoScroll: boolean;
  toggleAutoScroll: () => void;
}
```

### Types

```typescript
interface LogEntry {
  timestamp: string;
  level: string;
  target: string;
  message: string;
}

interface LogResponse {
  entries: LogEntry[];
  cursor: number;
}

type LogLevel = 'ALL' | 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
```

## Initialization

The logging system is initialized in `src-tauri/src/lib.rs`:

```rust
use logging::{init_logger, LogManager};

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir()
                .expect("Failed to get app data directory");
            
            // Initialize logger
            let log_path = app_data_dir.join("logs.txt");
            let logger = init_logger(log_path, log::Level::Trace)
                .expect("Failed to initialize logger");
            
            // Create log manager
            let log_manager = LogManager::new(logger);
            app.manage(log_manager);
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_logs, 
            get_all_logs, 
            clear_logs
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Best Practices

1. **Use appropriate log levels:**
   - `TRACE` - Very detailed information
   - `DEBUG` - Debugging information
   - `INFO` - General information
   - `WARN` - Warning messages
   - `ERROR` - Error messages

2. **Include context in log messages:**
   ```rust
   log::info!("User {} logged in successfully", user_id);
   log::error!("Failed to save file {}: {}", path, error);
   ```

3. **Log before throwing errors:**
   ```rust
   if let Err(e) = operation() {
       log::error!("Operation failed: {}", e);
       return Err(e);
   }
   ```

4. **Use structured logging for complex data:**
   ```rust
   log::debug!("Config loaded: {:?}", config);
   ```

5. **Clear logs periodically** - Logs accumulate in frontend memory during long-running sessions

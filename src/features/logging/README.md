# Logging Feature

The Logging feature provides a comprehensive interface for viewing, filtering, and managing application logs in real-time. It integrates with the Tauri backend to stream logs from the Rust application and presents them in a user-friendly React component.

## Overview

This feature enables developers and users to monitor application behavior through structured log entries. It supports real-time log streaming, filtering by log level and search terms, and various export options for log analysis.

## Features

- **Real-time Log Streaming**: Automatically polls for new log entries from the backend
- **Log Level Filtering**: Filter logs by severity levels (ALL, TRACE, DEBUG, INFO, WARN, ERROR)
- **Search Functionality**: Search through log messages and targets
- **Auto-scroll**: Automatically scroll to new logs as they arrive
- **Log Management**: Clear all logs or export them for analysis
- **Export Options**: Copy logs to clipboard or download as text file
- **Responsive Design**: Works across different screen sizes with proper theming

## Architecture

The feature follows a modular architecture organized into the following directories:

- `components/` - React components for the log viewer UI
- `hooks/` - Custom React hooks for log streaming and management
- `services/` - Business logic for log retrieval and management operations
- `types.ts` - TypeScript type definitions for log data structures

## Components

### LogViewer

The main React component that renders the log interface.

**Props**: None (uses internal state management)

**Features**:
- Displays logs in a monospace font with color-coded log levels
- Provides filter controls for log level and search
- Includes action buttons for log management
- Supports auto-scroll functionality
- Shows loading states and error messages

**Usage**:
```tsx
import { LogViewer } from '@/features/logging';

function LogsPage() {
  return <LogViewer />;
}
```

## Hooks

### useLogStream

A custom React hook that manages log streaming and state.

**Parameters**:
- `pollInterval` (optional): Polling interval in milliseconds (default: 1000)
- `autoScroll` (optional): Initial auto-scroll state (default: true)
- `filterLevel` (optional): Initial log level filter (default: 'ALL')

**Returns**:
- `logs`: Array of all log entries
- `filteredLogs`: Array of logs after applying filters
- `isLoading`: Loading state
- `error`: Error message if any
- `clearLogs`: Function to clear all logs
- `setFilterLevel`: Function to set log level filter
- `setSearchTerm`: Function to set search term
- `autoScroll`: Current auto-scroll state
- `toggleAutoScroll`: Function to toggle auto-scroll

**Usage**:
```tsx
import { useLogStream } from '@/features/logging';

function CustomLogViewer() {
  const {
    filteredLogs,
    isLoading,
    error,
    clearLogs,
    setFilterLevel,
    setSearchTerm,
  } = useLogStream({ pollInterval: 2000 });

  // Use the returned values...
}
```

## Services

### log.service

A service layer that handles communication with the Tauri backend.

**Methods**:

#### `getLogs(cursor: number): Promise<LogResponse>`
Fetches logs from a specific cursor position for incremental loading.

#### `getAllLogs(): Promise<LogResponse>`
Fetches all available logs (used for initial load).

#### `clearLogs(): Promise<void>`
Clears all logs from the backend storage.

## Types

### LogEntry
Represents a single log entry.

```typescript
interface LogEntry {
  timestamp: string;  // ISO timestamp string
  level: string;      // Log level (TRACE, DEBUG, INFO, WARN, ERROR)
  target: string;     // Log target/source identifier
  message: string;    // Log message content
}
```

### LogResponse
Response structure for log fetching operations.

```typescript
interface LogResponse {
  entries: LogEntry[];  // Array of log entries
  cursor: number;       // Cursor position for pagination
}
```

### LogLevel
Union type for log level filtering.

```typescript
type LogLevel = 'ALL' | 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
```

### LogFilterOptions
Options for filtering logs.

```typescript
interface LogFilterOptions {
  level: LogLevel;      // Log level filter
  searchTerm: string;   // Search term for filtering
}
```

## Usage Examples

### Basic Usage
```tsx
import { LogViewer } from '@/features/logging';

export default function LogsPage() {
  return (
    <div className="logs-page">
      <LogViewer />
    </div>
  );
}
```

### Custom Hook Usage
```tsx
import { useLogStream } from '@/features/logging';

export default function CustomLogs() {
  const { filteredLogs, isLoading, error } = useLogStream({
    pollInterval: 500,
    autoScroll: false,
  });

  if (isLoading) return <div>Loading logs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {filteredLogs.map((log, index) => (
        <div key={index}>
          [{log.timestamp}] [{log.level}] {log.message}
        </div>
      ))}
    </div>
  );
}
```

## Backend Integration

This feature requires corresponding Tauri commands in the Rust backend:

- `get_logs`: Fetch logs from cursor position
- `get_all_logs`: Fetch all logs
- `clear_logs`: Clear log storage

The backend should implement proper log storage and retrieval mechanisms, typically using a logging framework like `tracing` or `log` with appropriate appenders.

## Styling

The component uses Tailwind CSS classes and supports both light and dark themes. Log entries are displayed in a monospace font for better readability, with color coding for different log levels:

- ERROR: Red (#ef4444)
- WARN: Orange (#f59e0b)
- INFO: Blue (#3b82f6)
- DEBUG: Purple (#8b5cf6)
- TRACE: Gray (#6b7280)

## Performance Considerations

- Logs are polled at regular intervals (default 1 second)
- Filtering is performed client-side for responsive UI
- Auto-scroll only triggers when new logs arrive and auto-scroll is enabled
- Large log volumes may impact memory usage; consider log rotation in the backend

## Error Handling

The feature includes comprehensive error handling:
- Network errors during log fetching
- Backend command failures
- Invalid log data structures
- Clipboard API failures for copy operations

Errors are displayed in the UI and logged to the console for debugging.
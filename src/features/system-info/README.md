# System Info Feature

The System Info feature provides a comprehensive interface for displaying system hardware and operating system information. It integrates with the Tauri backend to retrieve detailed system specifications and presents them in a user-friendly React component with proper theming support.

## Overview

This feature enables users to view essential system information including CPU details, memory usage, operating system specifications, disk space, and GPU information. The information is fetched from the system hardware through the Tauri backend and displayed in an organized, visually appealing format.

## Features

- **CPU Information**: Displays CPU name and core count
- **Memory Details**: Shows total and available RAM in GB
- **Operating System**: Displays OS name, version, and architecture
- **Disk Space**: Shows total and available disk space in GB
- **GPU Information**: Lists available GPU devices
- **Responsive Design**: Adapts to different screen sizes with grid layout
- **Dark Mode Support**: Fully supports light and dark themes
- **Internationalization**: Uses i18n for all text labels
- **Error Handling**: Graceful error states with user-friendly messages
- **Loading States**: Shows loading indicators during data fetching

## Architecture

The feature follows a modular architecture organized into the following directories:

- `components/` - React components for the system info UI
- `hooks/` - Custom React hooks for data fetching and state management
- `services/` - Business logic for system information retrieval
- `types.ts` - TypeScript type definitions for system data structures

## Components

### SystemInfo

The main React component that renders the system information interface.

**Props**:
- `service`: SystemInfoService - The service instance to use for data retrieval

**Features**:
- Displays system information in organized cards with icons
- Uses responsive grid layout for different screen sizes
- Supports both light and dark themes
- Shows loading and error states appropriately
- Formats memory and disk values with proper units

**Usage**:
```tsx
import { SystemInfo, systemInfoService } from '@/features/system-info';

function SystemPage() {
  return <SystemInfo service={systemInfoService} />;
}
```

## Hooks

### useSystemInfo

A custom React hook that manages system information fetching and state.

**Parameters**:
- `service`: SystemInfoService - The system info service to use

**Returns**:
- `systemInfo`: SystemInfo | null - The fetched system information
- `isLoading`: boolean - Loading state during data fetch
- `error`: string | null - Error message if fetch fails

**Usage**:
```tsx
import { useSystemInfo, systemInfoService } from '@/features/system-info';

function CustomSystemInfo() {
  const { systemInfo, isLoading, error } = useSystemInfo(systemInfoService);

  if (isLoading) return <div>Loading system info...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>CPU: {systemInfo?.cpuName}</p>
      <p>Cores: {systemInfo?.cpuCores}</p>
      {/* ... other fields */}
    </div>
  );
}
```

## Services

### systemInfoService

A service layer that handles communication with the Tauri backend.

**Interface**:
```typescript
interface SystemInfoService {
  getSystemInfo(): Promise<SystemInfo>;
}
```

**Implementation**:
- Uses Tauri's `invoke` API to call the `get_system_info` backend command
- Handles errors and provides meaningful error messages
- Returns typed system information data

## Types

### SystemInfo

Represents the complete system information structure.

```typescript
interface SystemInfo {
  cpuCores: number;           // Number of CPU cores
  cpuName: string;            // CPU model name
  totalMemoryGb: number;      // Total RAM in GB
  availableMemoryGb: number;  // Available RAM in GB
  osName: string;             // Operating system name
  osVersion: string;          // Operating system version
  architecture: string;       // System architecture (x64, arm64, etc.)
  totalDiskGb: number;        // Total disk space in GB
  availableDiskGb: number;    // Available disk space in GB
  gpuInfo: string[];          // Array of GPU device names
}
```

## Usage Examples

### Basic Usage
```tsx
import { SystemInfo, systemInfoService } from '@/features/system-info';

export default function SystemPage() {
  return (
    <div className="system-page">
      <SystemInfo service={systemInfoService} />
    </div>
  );
}
```

### Custom Hook Usage
```tsx
import { useSystemInfo, systemInfoService } from '@/features/system-info';

export default function CustomSystemDisplay() {
  const { systemInfo, isLoading, error } = useSystemInfo(systemInfoService);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading system info</div>;

  return (
    <div className="custom-system-info">
      <h2>System Specifications</h2>
      <div>CPU: {systemInfo?.cpuName} ({systemInfo?.cpuCores} cores)</div>
      <div>Memory: {systemInfo?.availableMemoryGb}GB / {systemInfo?.totalMemoryGb}GB</div>
      <div>OS: {systemInfo?.osName} {systemInfo?.osVersion}</div>
      <div>Architecture: {systemInfo?.architecture}</div>
      <div>Disk: {systemInfo?.availableDiskGb}GB / {systemInfo?.totalDiskGb}GB</div>
      <div>
        GPUs:
        <ul>
          {systemInfo?.gpuInfo.map((gpu, index) => (
            <li key={index}>{gpu}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

## Backend Integration

This feature requires a corresponding Tauri command in the Rust backend:

- `get_system_info`: Returns system hardware information

The backend should implement system information gathering using appropriate Rust crates like `sysinfo` or platform-specific APIs. The command should return data matching the `SystemInfo` TypeScript interface.

Example backend implementation:
```rust
#[tauri::command]
async fn get_system_info() -> Result<SystemInfo, String> {
    // Implementation using sysinfo crate or similar
    // Return system information
}
```

## Styling

The component uses Tailwind CSS classes and supports both light and dark themes. The design includes:

- Card-based layout with rounded corners and shadows
- Color-coded icons for different information types:
  - CPU: Blue (#3b82f6)
  - Memory: Green (#10b981)
  - GPU: Purple (#8b5cf6)
  - Disk: Orange (#f59e0b)
  - OS: Gray (varies)
- Responsive grid layout (1 column on mobile, 2 columns on desktop)
- Proper spacing and typography for readability

## Performance Considerations

- System information is fetched once on component mount
- No polling or real-time updates to minimize system overhead
- Data is cached in component state until unmount
- Lightweight rendering with minimal re-renders

## Error Handling

The feature includes comprehensive error handling:

- Network errors during backend communication
- Backend command failures
- Invalid or missing system information
- Loading states to prevent UI flickering

Errors are displayed in the UI with user-friendly messages and logged to the console for debugging.
# AI Runtime Feature

The AI Runtime feature provides comprehensive runtime management for AI models in the application. It handles model status monitoring, streaming AI responses, and provides a unified interface for interacting with various AI providers.

## Overview

This feature enables:
- Real-time monitoring of AI model loading status
- Streaming AI response generation with event-driven updates
- Cancellation and error handling for AI operations
- Visual status indicators for user feedback

## Architecture

The feature follows a modular architecture with clear separation of concerns:

```
src/features/ai-runtime/
├── components/          # UI components for status display
├── hooks/              # React hooks for state management
├── services/           # Tauri command wrappers
├── types.ts            # TypeScript type definitions
└── index.ts            # Public API exports
```

## Usage

### Basic Usage

```tsx
import { useAIRuntime, useAiStatus, ModelStatusIndicator } from '@/features/ai-runtime';

function MyComponent() {
  const { status } = useAiStatus();
  const { isStreaming, currentStream, startStream, cancelStream } = useAIRuntime();

  const handleGenerate = async () => {
    await startStream("You are a helpful assistant.", "Hello, world!");
  };

  return (
    <div>
      <ModelStatusIndicator status={status} />
      <button onClick={handleGenerate} disabled={isStreaming}>
        Generate Response
      </button>
      {isStreaming && <button onClick={cancelStream}>Cancel</button>}
      <div>{currentStream}</div>
    </div>
  );
}
```

### Model Status Monitoring

```tsx
import { useAiStatus } from '@/features/ai-runtime';

function StatusDisplay() {
  const { status } = useAiStatus();

  if (!status) return <div>Loading...</div>;

  return (
    <div>
      Status: {status.status}
      {status.status === 'Loaded' && (
        <div>Provider: {status.provider}, Model: {status.model}</div>
      )}
    </div>
  );
}
```

## API Reference

### Hooks

#### `useAIRuntime()`

Manages AI streaming operations.

**Returns:**
- `isStreaming: boolean` - Whether a stream is currently active
- `currentStream: string` - Accumulated stream content
- `error: string | null` - Current error message
- `startStream(systemPrompt: string, userPrompt: string): Promise<void>` - Start a new stream
- `cancelStream(): Promise<void>` - Cancel the current stream
- `clearStream(): void` - Clear the current stream content

#### `useAiStatus()`

Monitors AI model status with automatic polling.

**Returns:**
- `status: ModelStatus | null` - Current model status

### Components

#### `ModelStatusIndicator`

Displays the current AI model status with visual indicators.

**Props:**
- `status: ModelStatus | null` - The status to display

### Services

#### `aiRuntimeService`

Tauri command wrappers for AI operations.

**Methods:**
- `getModelStatus(): Promise<ModelStatus>` - Get current model status
- `generateStream(systemPrompt: string, userPrompt: string): Promise<number>` - Start streaming generation
- `cancelStream(): Promise<void>` - Cancel current stream

## Types

### Model Status Types

```typescript
type ModelStatusType = 'Unloaded' | 'Loading' | 'Loaded' | 'Error';

interface ModelStatusUnloaded {
  status: 'Unloaded';
}

interface ModelStatusLoading {
  status: 'Loading';
  provider: string;
}

interface ModelStatusLoaded {
  status: 'Loaded';
  provider: string;
  model: string;
}

interface ModelStatusError {
  status: 'Error';
  provider: string;
  error: string;
}

type ModelStatus = ModelStatusUnloaded | ModelStatusLoading | ModelStatusLoaded | ModelStatusError;
```

### Stream Event Types

```typescript
type StreamEventType = 'Started' | 'Chunk' | 'Completed' | 'Error' | 'Cancelled';

interface StreamEventStarted {
  type: 'Started';
  request_id: number;
  provider: string;
  model: string;
}

interface StreamEventChunk {
  type: 'Chunk';
  request_id: number;
  content: string;
}

interface StreamEventCompleted {
  type: 'Completed';
  request_id: number;
}

interface StreamEventError {
  type: 'Error';
  request_id: number;
  error: {
    type: string;
    message?: string;
  };
}

interface StreamEventCancelled {
  type: 'Cancelled';
  request_id: number;
}

type StreamEvent = StreamEventStarted | StreamEventChunk | StreamEventCompleted | StreamEventError | StreamEventCancelled;
```

## Error Handling

The feature provides comprehensive error handling:

- Stream errors are captured and exposed through the `error` state in `useAIRuntime`
- Model status errors are displayed through the `ModelStatusIndicator` component
- All errors are logged to the console for debugging

## Internationalization

Status messages and labels are internationalized using the shared i18n system. Translation keys are located in `src/shared/i18n/locales/*/ai-settings.json` under the `ai.modelStatus` namespace.

## Dependencies

- `@tauri-apps/api/core` - For Tauri command invocation
- `@tauri-apps/api/event` - For event listening
- React hooks for state management
- Shared UI components (`LoadingSpinner`)
- Shared i18n context for translations
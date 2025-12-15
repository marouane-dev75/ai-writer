# AI Module

This module provides a comprehensive AI integration system with support for multiple providers, streaming text generation, and local model management.

## Overview

The AI module coordinates AI operations across different providers (OpenAI, Anthropic, LocalQwen), manages streaming execution, tracks operation state, and handles model lifecycle. It provides a unified interface for the frontend to interact with various AI services seamlessly.

## Architecture

The module follows a layered architecture:

```
AIManager (Coordinator)
    ├── Executor (Stream execution)
    │   └── StateManager (Operation tracking)
    ├── Providers (AI implementations)
    └── ModelManager (Model lifecycle)
```

## Core Components

### `manager.rs` - AIManager
The main coordinator that:
- Initializes and manages active AI providers
- Routes generation requests to the appropriate provider
- Tracks model loading status (`Unloaded`, `Loading`, `Loaded`, `Error`)
- Delegates streaming execution to the Executor

### `executor.rs` - Executor
Handles streaming operation execution:
- Spawns async tasks for AI generation
- Manages request IDs for tracking
- Emits stream events to the frontend via Tauri events
- Coordinates with StateManager for operation lifecycle

### `state.rs` - StateManager
Manages operation state and concurrency:
- Generates unique request IDs
- Prevents concurrent operations (one stream at a time)
- Provides cancellation mechanism via `mpsc` channels
- Tracks current operation status

### `types.rs` - Type Definitions
Defines core types:
- `AIError` - Error variants (OperationInProgress, NoActiveProvider, ProviderError)
- `ModelStatus` - Model loading states
- `StreamEvent` - Events emitted during generation (Started, Chunk, Completed, Error, Cancelled)
- `OperationState` - Internal state tracking

### `providers/` - AI Provider Implementations
Contains implementations for different AI services. Each provider implements the `AIProvider` trait for streaming text generation.

**See [providers/README.md](providers/README.md) for detailed information.**

### `model_manager/` - Model Management
Handles model lifecycle including catalog, downloading, and local scanning.

**See [model_manager/README.md](model_manager/README.md) for detailed information.**

## Key Features

- **Multi-Provider Support** - Seamlessly switch between OpenAI, Anthropic, and local models
- **Streaming Generation** - Real-time token-by-token text generation
- **Cancellation** - Graceful cancellation of in-progress operations
- **Event-Driven** - Emits events to frontend for reactive UI updates
- **Concurrency Control** - Prevents multiple simultaneous operations
- **Error Handling** - Comprehensive error handling with `anyhow::Result`
- **Logging** - Verbose logging for debugging and monitoring

## Usage Flow

1. **Initialization**: `AIManager::initialize()` loads the configured provider
2. **Status Check**: Frontend queries `get_status()` to display model state
3. **Generation**: Frontend calls `generate_stream()` with prompts
4. **Execution**: Executor spawns async task and returns request ID
5. **Streaming**: Provider emits `StreamEvent` chunks to frontend
6. **Completion**: Operation completes or is cancelled, state is cleaned up

## Integration

The AI module is exposed to the frontend via Tauri commands in `src-tauri/src/commands/ai_commands.rs`:
- `ai_generate_stream` - Start streaming generation
- `ai_cancel_stream` - Cancel current operation
- `ai_get_status` - Get model loading status

Events are emitted on the `ai_stream_event` channel for frontend consumption.

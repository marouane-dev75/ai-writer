# AI Providers

This folder contains AI provider implementations that enable streaming text generation from various AI services and local models.

## Overview

All providers implement the `AIProvider` trait, which defines a common interface for streaming text generation with support for cancellation, error handling, and real-time event emission to the frontend.

## AIProvider Trait

The core trait that all providers must implement:

```rust
#[async_trait]
pub trait AIProvider: Send + Sync {
    async fn generate_stream(
        &self,
        system_prompt: String,
        user_prompt: String,
        cancel_rx: mpsc::Receiver<()>,
        app_handle: tauri::AppHandle,
        request_id: u64,
    ) -> Result<()>;

    fn provider_name(&self) -> &str;
}
```

## Available Providers

### Anthropic (`anthropic.rs`)
- **API**: Anthropic Claude API (https://api.anthropic.com)
- **Models**: Claude 3.5 Sonnet, Claude 3 Opus, etc.
- **Features**: 
  - Server-Sent Events (SSE) streaming
  - Configurable temperature and max tokens
  - Comprehensive error handling (rate limits, context length, API errors)
  - Request/stream timeouts (60s request, 30s chunk)

### OpenAI (`openai.rs`)
- **API**: OpenAI Chat Completions API (https://api.openai.com)
- **Models**: GPT-4, GPT-4o, GPT-3.5, o1, o3, etc.
- **Features**:
  - SSE streaming with `[DONE]` marker detection
  - Automatic parameter selection (`max_tokens` vs `max_completion_tokens`)
  - Model-specific configuration (newer models use `max_completion_tokens`)
  - Detailed error parsing and categorization

### LocalQwen (`local_qwen.rs`)
- **Runtime**: Local inference using Candle ML framework
- **Models**: Qwen3 GGUF quantized models
- **Features**:
  - GPU acceleration support (CUDA optional)
  - Token-by-token streaming with `TokenOutputStream`
  - Thinking mode support (strips `<think>` tags from output)
  - Configurable sampling (temperature, repeat penalty, seed)
  - Pre-loaded model and tokenizer for performance

## Common Features

All providers support:

- **Streaming**: Real-time token-by-token generation
- **Cancellation**: Graceful cancellation via `mpsc::Receiver<()>`
- **Event Emission**: Emits `StreamEvent` to frontend via Tauri events:
  - `Started` - Generation begins
  - `Chunk` - New content available
  - `Completed` - Generation finished
  - `Cancelled` - User cancelled
  - `Error` - Error occurred
- **Error Handling**: Uses `anyhow::Result` with contextual error messages
- **Logging**: Verbose logging at debug/info/warn/error levels

## Adding a New Provider

To add a new AI provider:

1. Create a new file (e.g., `my_provider.rs`)
2. Implement the `AIProvider` trait
3. Add comprehensive error handling and logging
4. Emit appropriate `StreamEvent` variants
5. Export in `mod.rs`:
   ```rust
   mod my_provider;
   pub use my_provider::MyProvider;
   ```
6. Register in `AIManager` (`src-tauri/src/ai/manager.rs`)

## Architecture Notes

- **Async/Await**: All providers use async Rust with `tokio` runtime
- **Thread Safety**: Providers are `Send + Sync` for concurrent access
- **Blocking Operations**: LocalQwen uses `tokio::task::spawn_blocking` for CPU-intensive inference
- **Timeouts**: Network providers implement request and chunk timeouts to prevent hangs
- **Error Conversion**: Errors are converted to strings at Tauri command boundary for serialization

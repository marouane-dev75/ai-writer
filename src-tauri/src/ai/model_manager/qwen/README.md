# Qwen Model Manager

This module manages Qwen AI models, including downloading from HuggingFace and scanning local storage.

## Components

### catalog.rs
- Maintains the registry of available Qwen models
- Provides model lookup by ID
- Currently includes Qwen3 4B Q6 model

### downloader.rs
- Downloads model files (.gguf) and tokenizers from HuggingFace
- Tracks download progress with real-time events
- Handles chunked downloads with progress reporting
- Emits `model-download-progress` events to frontend

### scanner.rs
- Scans local filesystem for downloaded models
- Verifies model completeness (model file + tokenizer)
- Returns availability status for all catalog models

### types.rs
Data structures:
- `QwenModelInfo` - Model metadata (repo, file names, paths)
- `QwenAvailableModel` - Model status (downloaded, paths)
- `QwenScanResult` - Scan results with available models
- `DownloadProgress` - Download progress tracking

## Usage Flow

1. **Catalog** - Get available models from catalog
2. **Scanner** - Check which models are already downloaded
3. **Downloader** - Download missing models with progress tracking
4. **Scanner** - Verify successful download

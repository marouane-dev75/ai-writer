# Source

This directory contains the main Rust source code for the Tauri backend application.

## Contents

### [`main.rs`](main.rs)
Application entry point that calls the library's run function.

### [`lib.rs`](lib.rs)
Main library module that handles Tauri application setup, initialization of managers (logging, config, AI), and state management.

### [`ai/`](ai/)
Directory containing AI-related modules including providers, model management, and execution.

### [`commands/`](commands/)
Directory containing Tauri command handlers for frontend-backend communication.

### [`config/`](config/)
Directory containing configuration management modules and storage.

### [`editor/`](editor/)
Directory containing editor-related functionality and persistence.

### [`logging/`](logging/)
Directory containing logging system implementation and management.
# AI Writer Documentation

This documentation provides detailed explanations of the AI Writer application's features, including both frontend and backend architectures.

## Features Documentation

- **[AI Runtime](ai-runtime/)** - Runtime management for AI models with streaming and status monitoring
- **[AI Settings](ai-settings/)** - Configuration interface for AI providers (OpenAI, Anthropic, LocalQwen)
- **[App Restart](app-restart/)** - Application restart/close functionality with mode-aware behavior
- **[Logging](logging/)** - Real-time log viewing, filtering, and management
- **[System Info](system-info/)** - Hardware and OS information display
- **[Editor](editor/)** - Rich text editing with integrated AI generation and transformation

## Architecture Overview

The application follows a modular architecture with:

- **Frontend**: React-based features with TypeScript
- **Backend**: Rust/Tauri with modular command handlers
- **Persistence**: JSON-based configuration and editor state storage
- **AI Integration**: Multi-provider support with streaming capabilities

Each feature documentation includes:
- Frontend architecture and components
- Backend implementation details
- Integration flows with Mermaid diagrams
- API references and usage examples
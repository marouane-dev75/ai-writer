# AI Writer - Intelligent Writing Assistant

A modern desktop application that combines powerful rich text editing with AI-powered content generation and transformation. Built with Tauri for native performance and security.

## Overview

AI Writer is a desktop writing assistant that helps you create and transform content using multiple AI providers. Whether you're drafting documents, transforming existing text, or generating new ideas, AI Writer provides a seamless, privacy-focused writing experience with persistent workspace management.

## Key Features

- **🤖 Multi-Provider AI Support** - Choose between OpenAI, Anthropic, or Local Qwen models
- **✍️ Rich Text Editor** - Professional editing experience powered by Lexical
- **⚡ Real-Time AI Streaming** - Watch content generate and transform in real-time
- **🎯 Transformation Presets** - Save and reuse custom text transformation prompts
- **💾 Persistent Workspace** - Automatic saving of editor content and settings
- **🌓 Dark/Light Themes** - Comfortable writing in any lighting condition
- **📊 System Monitoring** - View AI model status, application logs, and system information
- **🌍 Internationalization** - Multi-language support (English, French)
- **🔒 Privacy-First** - Desktop app with local storage and optional local AI models

## What You Can Do

### Write with AI Assistance
- Generate content from prompts using streaming AI responses
- Insert AI-generated text directly into your document
- Cancel or restart generation at any time

### Transform Existing Text
- Select text and apply AI transformations
- Create custom transformation presets (e.g., "Make it professional", "Simplify", "Expand")
- Save frequently used transformations for quick access

### Manage AI Providers
- Configure multiple AI providers (OpenAI, Anthropic, Local Qwen)
- Switch between providers based on your needs
- Adjust model parameters (temperature, max tokens, top-p)
- Use local models for complete privacy

### Monitor & Debug
- View real-time AI model loading status
- Access application logs with filtering and search
- Check system specifications (CPU, memory, disk, GPU)

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/) v8 or higher
- [Rust](https://www.rust-lang.org/) latest stable
- [Tauri Prerequisites](https://tauri.app/v2/guides/prerequisites/) for your platform

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-writer

# Install dependencies
pnpm install

# Run in development mode
pnpm tauri dev
```

### Build for Production

```bash
# Build the application
pnpm tauri build
```

The built application will be available in `src-tauri/target/release/`.

## Technology Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Lexical** - Extensible rich text editor framework
- **Vite** - Fast build tooling
- **React Router 7** - Client-side routing

### Backend
- **Rust** - High-performance systems language
- **Tauri 2** - Secure desktop application framework
- **Serde** - Serialization/deserialization
- **Tokio** - Async runtime for AI streaming

### AI Integration
- **OpenAI API** - GPT models
- **Anthropic API** - Claude models
- **Local Qwen** - Privacy-focused local models

## Project Structure

```
ai-writer3/
├── src/                          # Frontend application
│   ├── features/                 # Feature modules
│   │   ├── ai-runtime/          # AI streaming & status monitoring
│   │   ├── ai-settings/         # AI provider configuration
│   │   ├── editor/              # Rich text editor with AI
│   │   ├── logging/             # Application logging viewer
│   │   ├── system-info/         # System information display
│   │   └── app-restart/         # Application restart management
│   ├── pages/                   # Page components
│   ├── shared/                  # Shared utilities & components
│   │   ├── ui/                  # Reusable UI components
│   │   ├── i18n/                # Internationalization
│   │   ├── theme/               # Theme management
│   │   └── layouts/             # Layout components
│   └── main.tsx                 # Application entry point
│
└── src-tauri/                   # Backend application
    └── src/
        ├── ai/                  # AI provider implementations
        ├── commands/            # Tauri command handlers
        ├── config/              # Configuration management
        ├── editor/              # Editor persistence
        └── logging/             # Logging system
```

## Feature Documentation

Each feature has detailed documentation in its respective directory:

- [AI Runtime](src/features/ai-runtime/README.md) - AI streaming and model status
- [AI Settings](src/features/ai-settings/README.md) - Provider configuration
- [Editor](src/features/editor/README.md) - Rich text editing with AI
- [Logging](src/features/logging/README.md) - Application log viewer
- [System Info](src/features/system-info/README.md) - System specifications
- [App Restart](src/features/app-restart/README.md) - Restart management

## Development

### Available Commands

```bash
# Frontend development server
pnpm dev

# Tauri development (with hot-reload)
pnpm tauri dev

# Build frontend
pnpm build

# Build Tauri application
pnpm tauri build

# Preview production build
pnpm preview
```

### Code Organization

This project follows clean architecture principles:

- **Feature-based structure** - Each feature is self-contained
- **Dependency Inversion** - High-level modules depend on abstractions
- **SOLID principles** - Maintainable and extensible code
- **TypeScript strict mode** - Type safety throughout
- **Rust best practices** - Idiomatic Rust with proper error handling

See individual feature READMEs for detailed implementation guidelines.

## Configuration

### AI Provider Setup

1. Navigate to Settings page
2. Select your preferred AI provider
3. Enter API credentials (for OpenAI/Anthropic) or model path (for Local Qwen)
4. Configure model parameters
5. Click "Set as Active Provider"

### Local Qwen Setup

For privacy-focused local AI:

1. Download Qwen GGUF models from Hugging Face
2. Place models in a directory on your system
3. In Settings, select "Local Qwen" provider
4. Browse to your models directory
5. Select your preferred model
6. Configure generation parameters

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Contributing

Contributions are welcome! Please ensure:

- Code follows existing patterns and conventions
- TypeScript strict mode compliance
- Rust code passes clippy lints
- Features include appropriate documentation
- Commit messages are clear and descriptive

## Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Documentation**: Check feature READMEs for detailed information
- **Community**: Join discussions in GitHub Discussions

## Acknowledgments

Built with excellent open-source technologies:

- [Tauri](https://tauri.app/) - Desktop application framework
- [React](https://react.dev/) - UI library
- [Lexical](https://lexical.dev/) - Rich text editor
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [OpenAI](https://openai.com/) - AI API
- [Anthropic](https://anthropic.com/) - Claude AI
- [Qwen](https://github.com/QwenLM/Qwen) - Local AI models

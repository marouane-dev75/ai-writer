# AI Editor - Tauri + React + TypeScript

A modern desktop application built with Tauri, React 19, and TypeScript, featuring a rich text editor with persistent configuration and theme management.

## Features

- 🎨 **Theme System** - Dark/light mode with persistent storage
- ⚙️ **Configuration Management** - Persistent app settings using Rust backend
- ✍️ **Rich Text Editor** - Block-styled editor powered by EditorJS
- 🏗️ **Clean Architecture** - Built with SOLID principles and DIP
- 🚀 **Modern Stack** - React 19, TypeScript, Tailwind CSS 4, Rust

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher)
- [Rust](https://www.rust-lang.org/) (latest stable)
- [Tauri Prerequisites](https://tauri.app/v2/guides/prerequisites/)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd platejs-test

# Install dependencies
pnpm install

# Run in development mode
pnpm tauri dev
```

### Build

```bash
# Build for production
pnpm tauri build
```

The built application will be in `src-tauri/target/release/`.

## Project Structure

```
.
├── src/                          # Frontend source
│   ├── features/                 # Feature modules
│   │   ├── configuration/        # Config management
│   │   └── editor/               # Editor feature
│   ├── components/               # Shared components
│   ├── layouts/                  # Layout components
│   ├── pages/                    # Page components
│   ├── theme/                    # Theme system
│   └── main.tsx                  # Entry point
│
├── src-tauri/                    # Backend source
│   └── src/
│       ├── commands/             # Tauri commands
│       ├── config/               # Config module
│       └── lib.rs                # Library entry
│
└── docs/                         # Documentation
    ├── features/                 # Feature docs
    ├── architecture.md           # Architecture overview
    └── developer-guide.md        # Development guide
```

## Documentation

- [Architecture Overview](./docs/architecture.md) - System design and principles
- [Configuration Management](./docs/features/configuration.md) - Config system details
- [Theme System](./docs/features/theme.md) - Theme implementation
- [Editor Feature](./docs/features/editor.md) - Editor documentation
- [Developer Guide](./docs/developer-guide.md) - Development guidelines
- [Contributing](./docs/contributing.md) - Contribution guidelines

## Technology Stack

### Frontend
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS
- **Vite** - Fast build tool
- **React Router 7** - Client-side routing
- **EditorJS** - Block-styled editor

### Backend
- **Rust** - Systems programming language
- **Tauri 2** - Desktop app framework
- **Serde** - Serialization framework

## Key Features

### Configuration Management

Persistent storage for application settings with a clean architecture:

- Rust backend with JSON file storage
- Dependency Inversion Principle throughout
- Type-safe frontend-backend communication
- Extensible for new configuration options

[Learn more →](./docs/features/configuration.md)

### Theme System

Dark/light mode with seamless persistence:

- Automatic theme loading on startup
- Smooth theme transitions
- CSS custom properties
- Tailwind dark mode integration

[Learn more →](./docs/features/theme.md)

### Rich Text Editor

Block-styled editor with clean JSON output:

- Header blocks (H1-H6)
- Paragraph blocks
- List blocks (ordered/unordered)
- Extensible tool system

[Learn more →](./docs/features/editor.md)

## Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Start Tauri development
pnpm tauri dev

# Build for production
pnpm build

# Build Tauri app
pnpm tauri build

# Preview production build
pnpm preview
```

### Code Style

This project follows strict coding standards:

- **TypeScript**: No `any` types, strict mode enabled
- **Rust**: Clippy lints, rustfmt formatting
- **React**: Functional components, hooks pattern
- **Architecture**: SOLID principles, DIP

See [Developer Guide](./docs/developer-guide.md) for detailed guidelines.

## Architecture Highlights

### Dependency Inversion Principle

High-level modules depend on abstractions, not concrete implementations:

```typescript
// Frontend depends on interface
interface ThemeStorage {
  loadTheme(): Promise<ThemeConfig>;
  saveTheme(theme: ThemeConfig): Promise<void>;
}

// Concrete implementation
class ConfigThemeStorage implements ThemeStorage {
  // Implementation details
}
```

```rust
// Backend depends on trait
pub trait ConfigStorage: Send + Sync {
    fn load(&self) -> Result<AppConfig, ConfigError>;
    fn save(&self, config: &AppConfig) -> Result<(), ConfigError>;
}

// Concrete implementation
pub struct FileConfigStorage {
    // Implementation details
}
```

### Feature-Based Organization

Each feature is self-contained with clear boundaries:

```
features/feature-name/
├── components/     # Feature components
├── hooks/          # Feature hooks
├── services/       # Service implementations
├── types.ts        # Type definitions
└── index.ts        # Public API
```

[Learn more →](./docs/architecture.md)

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./docs/contributing.md) before submitting a PR.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit a pull request

## License

[Add your license here]

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Support

For questions and support:
- Open an issue on GitHub
- Check the [documentation](./docs/)
- Review existing issues

## Acknowledgments

- [Tauri](https://tauri.app/) - Desktop app framework
- [React](https://react.dev/) - UI library
- [EditorJS](https://editorjs.io/) - Block-styled editor
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

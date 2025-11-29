# Developer Guide

## Introduction

This guide provides detailed instructions for developers working on this project. It covers development setup, coding standards, architecture patterns, and best practices.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18+): [Download](https://nodejs.org/)
- **pnpm** (v8+): `npm install -g pnpm`
- **Rust** (latest stable): [Install](https://www.rust-lang.org/tools/install)
- **Tauri Prerequisites**: Follow [Tauri's guide](https://tauri.app/v2/guides/prerequisites/)

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd platejs-test

# Install dependencies
pnpm install

# Run development server
pnpm tauri dev
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Follow the coding standards and architecture patterns described in this guide.

### 3. Test Your Changes

```bash
# Run the application
pnpm tauri dev

# Build to verify
pnpm tauri build
```

### 4. Commit Changes

```bash
git add .
git commit -m "✨ (scope): description"
```

See [Commit Message Format](#commit-message-format) below.

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Project Structure

### Frontend Structure

```
src/
├── features/              # Feature modules (self-contained)
│   ├── configuration/     # Configuration feature
│   │   ├── services/      # Service implementations
│   │   ├── types.ts       # Type definitions
│   │   └── index.ts       # Public API
│   └── editor/            # Editor feature
│       ├── components/    # Feature components
│       ├── hooks/         # Feature hooks
│       ├── types.ts       # Type definitions
│       └── index.ts       # Public API
│
├── components/            # Shared components
│   └── ui/                # UI components
│
├── layouts/               # Layout components
├── pages/                 # Page components
├── theme/                 # Theme system
├── App.tsx                # Root component
└── main.tsx               # Entry point
```

### Backend Structure

```
src-tauri/src/
├── commands/              # Tauri commands
│   ├── mod.rs             # Command exports
│   └── config_commands.rs # Config commands
│
├── config/                # Configuration module
│   ├── mod.rs             # Module exports
│   ├── types.rs           # Data structures
│   ├── storage.rs         # Storage trait & impl
│   ├── manager.rs         # Business logic
│   └── error.rs           # Error types
│
├── lib.rs                 # Library entry
└── main.rs                # Binary entry
```

## Adding a New Feature

### Step 1: Create Feature Directory

```bash
mkdir -p src/features/my-feature/{components,hooks,services}
touch src/features/my-feature/{index.ts,types.ts}
```

### Step 2: Define Types

In `src/features/my-feature/types.ts`:

```typescript
export interface MyFeatureData {
  id: string;
  name: string;
  value: number;
}

export interface MyFeatureConfig {
  enabled: boolean;
  options: string[];
}
```

### Step 3: Create Service Interface

In `src/features/my-feature/services/my-feature.service.ts`:

```typescript
import type { MyFeatureData } from '../types';

export interface MyFeatureService {
  getData(): Promise<MyFeatureData[]>;
  saveData(data: MyFeatureData): Promise<void>;
}

class TauriMyFeatureService implements MyFeatureService {
  async getData(): Promise<MyFeatureData[]> {
    return await invoke<MyFeatureData[]>('get_my_feature_data');
  }

  async saveData(data: MyFeatureData): Promise<void> {
    await invoke('save_my_feature_data', { data });
  }
}

export const myFeatureService: MyFeatureService = new TauriMyFeatureService();
```

### Step 4: Create Components

In `src/features/my-feature/components/MyFeatureComponent.tsx`:

```typescript
import React from 'react';
import { useMyFeature } from '../hooks/useMyFeature';

export const MyFeatureComponent: React.FC = () => {
  const { data, isLoading, save } = useMyFeature();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
      {/* Component content */}
    </div>
  );
};
```

### Step 5: Create Custom Hook

In `src/features/my-feature/hooks/useMyFeature.ts`:

```typescript
import { useState, useEffect } from 'react';
import { myFeatureService } from '../services/my-feature.service';
import type { MyFeatureData } from '../types';

export const useMyFeature = () => {
  const [data, setData] = useState<MyFeatureData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await myFeatureService.getData();
      setData(result);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const save = async (item: MyFeatureData) => {
    try {
      await myFeatureService.saveData(item);
      await loadData();
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  return { data, isLoading, save };
};
```

### Step 6: Export Public API

In `src/features/my-feature/index.ts`:

```typescript
export { MyFeatureComponent } from './components/MyFeatureComponent';
export { useMyFeature } from './hooks/useMyFeature';
export { myFeatureService } from './services/my-feature.service';
export type { MyFeatureData, MyFeatureConfig } from './types';
```

### Step 7: Add Backend Commands (if needed)

In `src-tauri/src/commands/my_feature_commands.rs`:

```rust
use tauri::State;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MyFeatureData {
    pub id: String,
    pub name: String,
    pub value: i32,
}

#[tauri::command]
pub async fn get_my_feature_data() -> Result<Vec<MyFeatureData>, String> {
    // Implementation
    Ok(vec![])
}

#[tauri::command]
pub async fn save_my_feature_data(data: MyFeatureData) -> Result<(), String> {
    // Implementation
    Ok(())
}
```

Register commands in `src-tauri/src/lib.rs`:

```rust
mod commands;
use commands::{get_my_feature_data, save_my_feature_data};

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            load_config,
            save_config,
            get_my_feature_data,
            save_my_feature_data,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Coding Standards

### TypeScript Standards

#### 1. No `any` Type

```typescript
// ❌ Bad
const data: any = fetchData();

// ✅ Good
const data: MyDataType = fetchData();
```

#### 2. Explicit Return Types

```typescript
// ❌ Bad
function calculate(a: number, b: number) {
  return a + b;
}

// ✅ Good
function calculate(a: number, b: number): number {
  return a + b;
}
```

#### 3. Interface Over Type for Objects

```typescript
// ❌ Bad
type User = {
  id: string;
  name: string;
};

// ✅ Good
interface User {
  id: string;
  name: string;
}
```

#### 4. Functional Components

```typescript
// ❌ Bad
class MyComponent extends React.Component {
  render() {
    return <div>Content</div>;
  }
}

// ✅ Good
export const MyComponent: React.FC = () => {
  return <div>Content</div>;
};
```

### Rust Standards

#### 1. Use snake_case

```rust
// ❌ Bad
fn LoadConfig() -> Result<AppConfig, ConfigError> { }

// ✅ Good
fn load_config() -> Result<AppConfig, ConfigError> { }
```

#### 2. Handle Errors with Result

```rust
// ❌ Bad
fn read_file(path: &str) -> String {
    std::fs::read_to_string(path).unwrap()
}

// ✅ Good
fn read_file(path: &str) -> Result<String, std::io::Error> {
    std::fs::read_to_string(path)
}
```

#### 3. Use ? for Error Propagation

```rust
// ❌ Bad
fn process() -> Result<Data, Error> {
    match load_data() {
        Ok(data) => Ok(data),
        Err(e) => Err(e),
    }
}

// ✅ Good
fn process() -> Result<Data, Error> {
    let data = load_data()?;
    Ok(data)
}
```

#### 4. Document Public APIs

```rust
/// Loads configuration from storage
///
/// # Returns
/// Returns `AppConfig` on success, or `ConfigError` on failure
///
/// # Examples
/// ```
/// let config = manager.load_config()?;
/// ```
pub fn load_config(&self) -> Result<AppConfig, ConfigError> {
    self.storage.load()
}
```

## Architecture Patterns

### Dependency Inversion Principle (DIP)

Always depend on abstractions, not concrete implementations.

#### Frontend Example

```typescript
// Define interface
export interface DataStorage {
  load(): Promise<Data>;
  save(data: Data): Promise<void>;
}

// Component depends on interface
interface Props {
  storage: DataStorage;
}

export const Component: React.FC<Props> = ({ storage }) => {
  // Use storage
};

// Inject concrete implementation
<Component storage={concreteStorage} />
```

#### Backend Example

```rust
// Define trait
pub trait DataStorage: Send + Sync {
    fn load(&self) -> Result<Data, Error>;
    fn save(&self, data: &Data) -> Result<(), Error>;
}

// Manager depends on trait
pub struct DataManager<S: DataStorage> {
    storage: Arc<S>,
}

// Inject concrete implementation
let manager = DataManager::new(FileStorage::new(path));
```

### Single Responsibility Principle (SRP)

Each module/class should have one reason to change.

```typescript
// ❌ Bad - Multiple responsibilities
class UserManager {
  loadUser() { }
  saveUser() { }
  validateUser() { }
  sendEmail() { }
  logActivity() { }
}

// ✅ Good - Single responsibility
class UserRepository {
  loadUser() { }
  saveUser() { }
}

class UserValidator {
  validate() { }
}

class EmailService {
  send() { }
}

class ActivityLogger {
  log() { }
}
```

## Component Guidelines

### Component Structure

```typescript
import React from 'react';
import type { ComponentProps } from './types';

interface Props extends ComponentProps {
  // Additional props
}

export const MyComponent: React.FC<Props> = ({
  prop1,
  prop2,
  children,
}) => {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // Handlers
  const handleClick = () => {
    // Handle event
  };
  
  // Render
  return (
    <div className="container">
      {children}
    </div>
  );
};

MyComponent.displayName = 'MyComponent';
```

### Hook Guidelines

```typescript
export const useMyHook = (config: Config) => {
  const [state, setState] = useState<State>();
  
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, []);
  
  const action = useCallback(() => {
    // Action logic
  }, [dependencies]);
  
  return { state, action } as const;
};
```

## Styling Guidelines

### Tailwind CSS Usage

```tsx
// ✅ Good - Use Tailwind classes
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    Title
  </h1>
</div>

// ❌ Bad - Inline styles
<div style={{ backgroundColor: 'white', padding: '16px' }}>
  <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
    Title
  </h1>
</div>
```

### Dark Mode Support

Always provide dark mode variants:

```tsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-white">Content</p>
  <button className="bg-blue-500 dark:bg-blue-700">Button</button>
</div>
```

## Error Handling

### Frontend

```typescript
try {
  const result = await service.operation();
  // Handle success
} catch (error) {
  console.error('Operation failed:', error);
  // Show user feedback
  // Revert state if needed
}
```

### Backend

```rust
pub fn operation(&self) -> Result<Data, Error> {
    let data = self.load()
        .map_err(|e| Error::LoadFailed(e.to_string()))?;
    
    // Process data
    
    Ok(data)
}
```

## Commit Message Format

Use conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `✨ feat`: New feature
- `🐛 fix`: Bug fix
- `📝 docs`: Documentation changes
- `💄 style`: Code style changes (formatting)
- `♻️ refactor`: Code refactoring
- `⚡ perf`: Performance improvements
- `✅ test`: Adding tests
- `🔧 chore`: Build process or auxiliary tool changes

### Examples

```bash
git commit -m "✨ (editor): add image upload support"
git commit -m "🐛 (theme): fix theme persistence on reload"
git commit -m "📝 (docs): update architecture documentation"
git commit -m "♻️ (config): refactor storage implementation"
```

## Testing

### Frontend Testing

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
  
  it('handles user interaction', async () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Backend Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_load_config() {
        let storage = MockStorage::new();
        let manager = ConfigManager::new(storage);
        
        let result = manager.load_config();
        assert!(result.is_ok());
    }
}
```

## Common Tasks

### Adding a New Page

1. Create page component in `src/pages/`:

```typescript
export const MyPage = () => {
  return (
    <div>
      <h1>My Page</h1>
    </div>
  );
};
```

2. Add route in `src/App.tsx`:

```typescript
<Route path="/my-page" element={<MyPage />} />
```

3. Add navigation link in `src/layouts/Navbar.tsx`:

```typescript
<Link to="/my-page">My Page</Link>
```

### Adding a New Tauri Command

1. Create command in `src-tauri/src/commands/`:

```rust
#[tauri::command]
pub async fn my_command(param: String) -> Result<String, String> {
    Ok(format!("Received: {}", param))
}
```

2. Register in `src-tauri/src/lib.rs`:

```rust
.invoke_handler(tauri::generate_handler![
    my_command,
])
```

3. Use in frontend:

```typescript
import { invoke } from '@tauri-apps/api/core';

const result = await invoke<string>('my_command', { param: 'value' });
```

## Troubleshooting

### Build Errors

```bash
# Clean and rebuild
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm tauri build
```

### Rust Compilation Errors

```bash
# Update Rust
rustup update

# Clean Cargo cache
cd src-tauri
cargo clean
cargo build
```

### Type Errors

```bash
# Regenerate TypeScript types from Rust
cd src-tauri
cargo tauri dev
```

## Resources

- [Tauri Documentation](https://tauri.app/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Related Documentation

- [Architecture Overview](./architecture.md)
- [Configuration Management](./features/configuration.md)
- [Theme System](./features/theme.md)
- [Editor Feature](./features/editor.md)
- [Contributing Guidelines](./contributing.md)
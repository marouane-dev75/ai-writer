# Theme System

## Overview

The Theme System provides dark/light mode functionality with persistent storage. It uses dependency injection to decouple theme management from storage implementation, following SOLID principles.

## Architecture

```
ThemeProvider (Context)
    ↓ depends on
ThemeStorage (Interface)
    ↓ implemented by
ConfigThemeStorage
    ↓ uses
ConfigService → Tauri Backend → config.json
```

## Core Components

### 1. ThemeStorage Interface
**Location:** `src/common/theme/service/ThemeStorage.interface.ts`

Defines the storage abstraction (DIP):

```typescript
export interface ThemeConfig {
  dark_mode: boolean;
}

export interface ThemeStorage {
  loadTheme(): Promise<ThemeConfig>;
  saveTheme(theme: ThemeConfig): Promise<void>;
}
```

### 2. ConfigThemeStorage
**Location:** `src/features/configuration/services/ConfigThemeStorage.ts`

Concrete implementation using configuration service:

```typescript
export class ConfigThemeStorage implements ThemeStorage {
  async loadTheme(): Promise<ThemeConfig> {
    const config = await configService.loadConfig();
    return config.theme;
  }

  async saveTheme(theme: ThemeConfig): Promise<void> {
    const config = await configService.loadConfig();
    config.theme = theme;
    await configService.saveConfig(config);
  }
}

// Export singleton instance
export const configThemeStorage = new ConfigThemeStorage();
```

### 3. ThemeProvider & useTheme Hook
**Location:** `src/common/theme/ThemeContext.tsx`

React context provider with dependency injection:

```typescript
interface ThemeProviderProps {
  children: ReactNode;
  storage: ThemeStorage; // Injected dependency
}

export const ThemeProvider: React.FC<ThemeProviderProps>
```

**Features:**
- Loads theme on mount with loading state
- Shows `LoadingSpinner` component while loading theme
- Applies theme via CSS classes on `document.documentElement`
- Auto-reverts on save errors
- Provides `useTheme()` hook for components

**Hook API:**
```typescript
const { isDarkMode, toggleTheme } = useTheme();
```

### 4. DarkModeToggle Component
**Location:** `src/common/layouts/DarkModeToggle.tsx`

UI component for theme switching with sun/moon icons. Receives `isDarkMode` and `toggleTheme` as props.

**Props:**
```typescript
interface DarkModeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}
```

**Usage:**
```typescript
import { DarkModeToggle } from '@/shared/layouts';
import { useTheme } from '@/shared/theme';

export const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <nav>
      <DarkModeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </nav>
  );
};
```

## CSS Implementation

Theme uses CSS custom properties with class-based dark mode:

```css
/* src/common/theme/theme.css */
:root {
  --color-background: #ffffff;
  --color-text: #000000;
}

.dark {
  --color-background: #1a1a1a;
  --color-text: #ffffff;
}
```

The provider automatically toggles the `dark` class on `document.documentElement`.

## Usage

### Setup (main.tsx)

```typescript
import { ThemeProvider } from '@/shared/theme';
import { configThemeStorage } from '@/features/configuration';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider storage={configThemeStorage}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

### In Components

```typescript
import { useTheme } from '@/shared/theme';

export const MyComponent = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div className="bg-white dark:bg-gray-800">
      <p className="text-gray-900 dark:text-white">
        Current: {isDarkMode ? 'Dark' : 'Light'}
      </p>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};
```

### Tailwind Dark Mode

```tsx
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
  <p className="text-gray-600 dark:text-gray-300">Content</p>
</div>
```

### Custom Storage Implementation

```typescript
import type { ThemeStorage, ThemeConfig } from '@/shared/theme';

export class LocalStorageThemeStorage implements ThemeStorage {
  private readonly key = 'app-theme';
  
  async loadTheme(): Promise<ThemeConfig> {
    const stored = localStorage.getItem(this.key);
    return stored ? JSON.parse(stored) : { dark_mode: false };
  }
  
  async saveTheme(theme: ThemeConfig): Promise<void> {
    localStorage.setItem(this.key, JSON.stringify(theme));
  }
}

// Use in main.tsx
const storage = new LocalStorageThemeStorage();
<ThemeProvider storage={storage}>
```

## File Structure

```
src/common/theme/
├── index.ts                           # Exports
├── theme.css                          # CSS variables
├── ThemeContext.tsx                   # Provider & hook
└── service/
    └── ThemeStorage.interface.ts     # Storage abstraction

src/common/layouts/
└── DarkModeToggle.tsx                # Toggle component

src/features/configuration/services/
└── ConfigThemeStorage.ts             # Config implementation
```

## Error Handling

**Load Errors:**
- Logs error to console
- Falls back to light mode (default)
- Application continues normally

**Save Errors:**
- Logs error to console
- Reverts theme state to previous value
- User sees original theme

```typescript
// Auto-revert on save failure
try {
  await storage.saveTheme({ dark_mode: newMode });
} catch (error) {
  console.error('Failed to save theme:', error);
  setIsDarkMode(!newMode); // Revert
}
```

## Design Principles

**Dependency Inversion (DIP):**
- `ThemeProvider` depends on `ThemeStorage` interface, not concrete implementation
- Storage injected via props for easy testing and swapping

**Single Responsibility (SRP):**
- `ThemeStorage.interface`: Defines contract
- `ConfigThemeStorage`: Implements persistence
- `ThemeProvider`: Manages state and DOM
- `useTheme`: Provides component access

**Open/Closed (OCP):**
- New storage backends can be added without modifying existing code
- Extend via new implementations, not modifications

## Integration

### With Configuration System
Theme stored in application config:
```json
{
  "theme": {
    "dark_mode": true
  }
}
```

### With Tailwind CSS
Configure class-based dark mode in `tailwind.config.js`:
```javascript
module.exports = {
  darkMode: 'class',
  // ...
}
```

## Related Documentation
- [Configuration Management](./configuration.md)
- [Architecture Overview](../architecture.md)

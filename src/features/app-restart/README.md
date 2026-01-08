# App Restart Feature

## Overview

The App Restart feature provides a user-friendly interface for restarting or closing the Tauri application. It displays a prominent banner notification that allows users to perform these actions, with different behavior in development and production modes. In development mode, it offers a "close" option, while in production mode, it provides a "restart" option.

## Architecture

The feature follows a modular architecture organized into the following directories:

- `components/` - React components for the restart prompt UI
- `contexts/` - React context for managing restart prompt state
- `hooks/` - Custom React hooks for restart operations
- `services/` - Business logic for app restart/close operations
- `types.ts` - TypeScript type definitions

## Components

### RestartPrompt
[`RestartPrompt.tsx`](components/RestartPrompt.tsx)
A banner component that displays at the top of the application when the restart prompt is active. It shows a warning message with action buttons and handles different behaviors for development vs production modes.

## Contexts

### AppRestartProvider
[`AppRestartContext.tsx`](contexts/AppRestartContext.tsx)
Provides React context for managing the visibility of the restart prompt and injecting the restart service. It follows the Dependency Inversion Principle by accepting the service as a prop.

## Hooks

### useAppRestart
[`useAppRestart.ts`](hooks/useAppRestart.ts)
Manages the restart and close operations with loading states and error handling. Provides `restart()`, `close()`, `isRestarting`, and `error` properties.

### useAppRestartPrompt
[`useAppRestartPrompt.ts`](contexts/AppRestartContext.tsx)
Hook for controlling the visibility of the restart prompt. Returns `showRestartPrompt` and `setShowRestartPrompt`.

## Services

### appRestartService
[`app-restart.service.ts`](services/app-restart.service.ts)
Implements the `AppRestartService` interface using Tauri's invoke API to communicate with the backend. Provides `restart()` and `close()` methods that call the 'restart_app' and 'close_app' Tauri commands respectively.

## Types

The feature defines the following TypeScript interface:

- `AppRestartService` - Interface for app restart operations with `restart()` and `close()` methods

## Usage

### Basic Setup

First, wrap your app with the `AppRestartProvider`:

```typescript
import { AppRestartProvider, appRestartService } from './features/app-restart';

function App() {
  return (
    <AppRestartProvider service={appRestartService}>
      {/* Your app components */}
      <RestartPrompt />
    </AppRestartProvider>
  );
}
```

### Showing the Restart Prompt

Use the `useAppRestartPrompt` hook to control when the prompt appears:

```typescript
import { useAppRestartPrompt } from './features/app-restart';

function SomeComponent() {
  const { setShowRestartPrompt } = useAppRestartPrompt();

  const handleShowRestart = () => {
    setShowRestartPrompt(true);
  };

  return (
    <button onClick={handleShowRestart}>
      Show Restart Prompt
    </button>
  );
}
```

### Direct Service Usage

For programmatic restart/close operations:

```typescript
import { appRestartService } from './features/app-restart';

const handleRestart = async () => {
  try {
    await appRestartService.restart();
  } catch (error) {
    console.error('Failed to restart app:', error);
  }
};
```

## Dependencies

- React for UI components
- Tauri for backend communication and app control
- React Icons for UI icons
- i18next for internationalization

## Internationalization

The feature supports multiple languages through the shared i18n system. Messages and labels are defined in `src/shared/i18n/locales/*/app-restart.json`.

## Behavior

- **Development Mode**: Shows "Close App" button that terminates the application
- **Production Mode**: Shows "Restart App" button that restarts the application
- The prompt can be dismissed without taking action
- Loading states and error handling are built-in
- The component is designed to be shown as an overlay at the highest z-index level
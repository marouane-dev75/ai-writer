# Editor Feature

The Editor feature provides a rich text editor component built on Lexical, with integrated AI capabilities for content generation and transformation. It includes persistence, layout management, and toolbar controls.

## Overview

This feature enables:
- Rich text editing with Lexical editor
- AI-powered content generation and transformation panels
- Automatic state persistence with debouncing
- Configurable layout for showing/hiding AI panels
- Selection state tracking for transformer operations
- Toolbar with formatting and AI panel toggles

## Architecture

The feature follows a modular architecture with clear separation of concerns:

```
src/features/editor/editor/
├── components/          # UI components (Editor, Toolbar, BlockTypeDropdown)
├── hooks/              # React hooks for state management
├── services/           # Tauri command wrappers for persistence
└── index.ts            # Public API exports
```

## Usage

### Basic Usage

```tsx
import { Editor } from '@/features/editor/editor';
import type { AIRuntimeInstance } from '@/features/editor/shared';

function MyApp() {
  const transformerRuntime: AIRuntimeInstance = {
    isLoading: false,
    isStreaming: false,
    currentStream: '',
    error: null,
    startStream: async (systemPrompt, userPrompt) => {
      // Start transformation stream
    },
    cancelStream: async () => {
      // Cancel stream
    },
    clearStream: () => {
      // Clear stream
    },
  };

  const generatorRuntime: AIRuntimeInstance = {
    // Similar structure for generation
  };

  return (
    <Editor
      onChange={(content) => console.log('Content changed:', content)}
      transformerRuntime={transformerRuntime}
      generatorRuntime={generatorRuntime}
    />
  );
}
```

### Using Editor Hooks

```tsx
import { useEditorPersistence, useEditorLayout, useSelectionState } from '@/features/editor/editor';

function EditorControls() {
  const { isLoading: persistenceLoading, error: persistenceError, saveState, clearState } = useEditorPersistence();
  const { showTransformer, showGenerator, setShowTransformer, setShowGenerator } = useEditorLayout();
  const { hasSelection, selectedText, selectedMarkdown } = useSelectionState();

  return (
    <div>
      <button onClick={() => setShowTransformer(!showTransformer)}>
        Toggle Transformer
      </button>
      <button onClick={() => setShowGenerator(!showGenerator)}>
        Toggle Generator
      </button>
      {hasSelection && <p>Selected: {selectedText}</p>}
    </div>
  );
}
```

## API Reference

### Components

#### `Editor`

Main editor component with integrated AI panels.

**Props:**
- `onChange?: (content: string) => void` - Callback for content changes
- `transformerRuntime: AIRuntimeInstance` - Runtime for AI transformations
- `generatorRuntime: AIRuntimeInstance` - Runtime for AI generation

#### `Toolbar`

Toolbar component with formatting and AI panel controls.

**Props:**
- `onToggleTransformer: () => void` - Toggle transformer panel
- `onToggleGenerator: () => void` - Toggle generator panel

#### `BlockTypeDropdown`

Dropdown for selecting block types (headings, quotes, etc.).

**Props:** None

### Hooks

#### `useEditor()`

Main editor hook (currently minimal, may be expanded).

**Returns:** Editor instance and utilities

#### `useEditorPersistence()`

Manages editor state persistence with debouncing.

**Returns:**
- `initialState: string | null` - Initial editor state for loading
- `isLoading: boolean` - Whether state is loading
- `error: string | null` - Loading error message
- `saveState(state: SerializedEditorState): void` - Save editor state (debounced)
- `clearState(): Promise<void>` - Clear saved state

#### `useEditorLayout()`

Manages visibility of AI panels with persistence.

**Returns:**
- `showTransformer: boolean` - Whether transformer panel is visible
- `showGenerator: boolean` - Whether generator panel is visible
- `setShowTransformer(show: boolean): void` - Set transformer visibility
- `setShowGenerator(show: boolean): void` - Set generator visibility
- `isLoading: boolean` - Whether layout is loading

#### `useSelectionState()`

Tracks current text selection in the editor.

**Returns:**
- `hasSelection: boolean` - Whether text is selected
- `selectedText: string` - Plain text of selection
- `selectedMarkdown: string` - Markdown representation of selection

### Services

#### `EditorPersistenceService`

**Methods:**
- `saveEditorState(state: string): Promise<void>` - Save editor state
- `loadEditorState(): Promise<string>` - Load editor state
- `clearEditorState(): Promise<void>` - Clear saved state

#### `editor-layout.service`

**Functions:**
- `loadEditorLayout(): Promise<EditorLayoutConfig>` - Load layout config
- `saveEditorLayout(config: EditorLayoutConfig): Promise<void>` - Save layout config

### Types

#### `EditorLayoutConfig`

```typescript
interface EditorLayoutConfig {
  showTransformer: boolean;
  showGenerator: boolean;
}
```

## Features

### Rich Text Editing

- Headings (H1, H2, H3)
- Blockquotes
- Lists (ordered and unordered, including checklists)
- Code blocks
- Bold, italic, underline text formatting

### AI Integration

- Transformer panel for text transformation with presets
- Generator panel for content generation
- Real-time streaming of AI responses
- Preview and accept/reject functionality

### Persistence

- Automatic saving with 2-second debouncing
- State restoration on reload
- Layout preference persistence

### Layout Management

- Collapsible AI panels
- Persistent panel visibility settings
- Responsive design with side-by-side layout

## Error Handling

The feature provides comprehensive error handling:

- Editor state loading errors are displayed in the UI
- Persistence errors are logged but don't interrupt editing
- Layout loading falls back to defaults
- All errors are propagated through hooks for UI feedback

## Internationalization

UI text is internationalized using the shared i18n system. Translation keys are located in `src/shared/i18n/locales/*/editor.json`.

## Dependencies

- `@lexical/react` and related packages - Rich text editor
- `@tauri-apps/api/core` - For Tauri command invocation
- React hooks for state management
- Shared UI components and utilities
- AI runtime instances for AI functionality
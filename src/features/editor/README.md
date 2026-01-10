# Editor Feature

## Overview

The Editor feature provides a rich text editor with AI-powered content transformation and generation capabilities. It integrates with AI runtimes to enhance text editing workflows, allowing users to transform existing text or generate new content using advanced language models.

## Architecture

This feature follows Domain-Driven Design (DDD) principles and SOLID principles:

- **Bounded Context**: The editor domain is clearly separated with defined boundaries.
- **Entities/Value Objects**: `TransformPreset` serves as a value object for reusable transformation configurations.
- **Services**: Pure functions for text transformations, following the Single Responsibility Principle.
- **Dependency Inversion Principle (DIP)**: The editor depends on the `AIRuntimeInstance` abstraction rather than concrete AI implementations.

## Components

### [`Editor`](components/Editor.tsx)

The main editor component built on [Lexical](https://lexical.dev/), a powerful rich text editor framework.

**Props:**
- `onChange?: (content: string) => void` - Callback for content changes
- `transformerRuntime: AIRuntimeInstance` - AI runtime for transformations
- `generatorRuntime: AIRuntimeInstance` - AI runtime for content generation

**Features:**
- Rich text editing with support for headings, lists, quotes, and code blocks
- Automatic persistence of editor state
- Integrated toolbar for formatting
- Toggleable AI transformer and generator panels
- Error handling and loading states

### [`AiTransformer`](components/ai-transformer/AiTransformer.tsx)

Handles AI-powered text transformations with preset management.

**Features:**
- Real-time streaming of transformation results
- Preset-based transformations
- Stream cancellation and clearing

### [`AiGenerator`](components/ai-generator/AiGenerator.tsx)

Manages AI-powered content generation.

**Features:**
- Streaming content generation
- Error handling for generation failures
- Stream management (start, cancel, clear)

### [`Toolbar`](components/toolbar/Toolbar.tsx)

Provides formatting controls and panel toggles.

**Features:**
- Block type selection (paragraph, headings)
- Text formatting (bold, italic, underline)
- List creation
- Toggle buttons for AI panels

## Hooks

### [`useEditor`](hooks/useEditor.ts)

A simple hook for managing basic editor content state.

**Returns:**
- `content: string` - Current content
- `setContent: (content: string) => void` - Update content
- `clearContent: () => void` - Clear content

### [`useEditorPersistence`](hooks/useEditorPersistence.ts)

Manages editor state persistence with debounced saving.

**Features:**
- Loads initial state on mount
- Debounced auto-save (2-second delay)
- Error handling for load/save operations
- State clearing functionality

**Returns:**
- `initialState: string | null` - Initial editor state
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message
- `saveState: (state: SerializedEditorState) => void` - Save state
- `clearState: () => Promise<void>` - Clear persisted state

### [`useTransformPresets`](hooks/useTransformPresets.ts)

Manages transformation presets with full CRUD operations.

**Features:**
- Load/save presets from storage
- Add, update, delete presets
- Selected preset management
- Validation of preset existence

**Returns:**
- `presets: TransformPreset[]` - Array of available presets
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message
- `selectedPresetId: string | null` - Currently selected preset
- `addPreset: (title: string, description: string) => Promise<void>` - Add new preset
- `updatePreset: (preset: TransformPreset) => Promise<void>` - Update existing preset
- `deletePreset: (id: string) => Promise<void>` - Delete preset
- `setSelectedPreset: (presetId: string | null) => Promise<void>` - Set selected preset
- `refreshPresets: () => Promise<void>` - Reload presets

## Services

### [`ai-transformer.service`](services/ai-transformer.service.ts)

Provides pure functions for basic text transformations.

**Functions:**
- `uppercaseTransform(text: string): string` - Convert text to uppercase
- `lowercaseTransform(text: string): string` - Convert text to lowercase

### [`editor-persistence.service`](services/editor-persistence.service.ts)

Handles persistence of editor state using Tauri's storage capabilities.

### [`transform-preset.service`](services/transform-preset.service.ts)

Manages storage and retrieval of transformation presets.

## Types

### [`TransformPreset`](types.ts:1)

```typescript
interface TransformPreset {
  id: string;
  title: string;
  description: string;
  createdAt: number;
}
```

### [`TransformPresetsConfig`](types.ts:8)

```typescript
interface TransformPresetsConfig {
  presets: TransformPreset[];
  selectedPresetId?: string | null;
}
```

### [`AIRuntimeInstance`](types.ts:17)

Abstraction interface for AI runtime implementations, following DIP.

```typescript
interface AIRuntimeInstance {
  isStreaming: boolean;
  currentStream: string;
  error: string | null;
  startStream: (systemPrompt: string, userPrompt: string) => Promise<void>;
  cancelStream: () => Promise<void>;
  clearStream: () => void;
}
```

## Usage

Import the feature components and types:

```typescript
import { Editor, type AIRuntimeInstance } from '@/features/editor';
```

Use the Editor component with AI runtime instances:

```tsx
<Editor
  onChange={(content) => console.log('Content changed:', content)}
  transformerRuntime={transformerRuntime}
  generatorRuntime={generatorRuntime}
/>
```

## Dependencies

- **Lexical**: Rich text editor framework
- **AI Runtime**: Abstract interface for AI providers (OpenAI, Anthropic, Local Qwen)
- **Shared UI Components**: Buttons, dialogs, loading spinners
- **i18n**: Internationalization support
- **Theme**: Dark/light mode theming

## File Structure

```
src/features/editor/
├── components/
│   ├── Editor.tsx
│   ├── ai-generator/
│   ├── ai-transformer/
│   └── toolbar/
├── hooks/
│   ├── useEditor.ts
│   ├── useEditorPersistence.ts
│   └── useTransformPresets.ts
├── services/
│   ├── ai-transformer.service.ts
│   ├── editor-persistence.service.ts
│   └── transform-preset.service.ts
├── types.ts
├── index.ts
└── README.md

# TODO:
- [ ] Separate AI transformer into its own folder with hooks...
- [ ] Separate AI generator into its own folder with hooks...

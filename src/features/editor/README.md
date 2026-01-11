# Editor Feature

The Editor feature provides a comprehensive rich text editing experience with integrated AI capabilities for content generation and transformation. Built on Lexical, it offers a modular architecture with separate concerns for editing, AI generation, AI transformation, and shared utilities.

## Overview

This feature enables:
- Rich text editing with formatting toolbar
- AI-powered content generation with customizable prompts
- AI-powered text transformation using presets
- Automatic state persistence and layout management
- Real-time streaming of AI responses
- Preview and accept/reject workflows for AI operations

## Architecture

The feature follows a modular architecture with clear separation of concerns:

```
src/features/editor/
├── ai-generator/       # AI content generation functionality
├── ai-transformer/     # AI text transformation with presets
├── editor/            # Core rich text editor components
├── shared/            # Common types and utilities
└── index.ts           # Public API exports
```

## Sub-Features

### AI Generator (`ai-generator/`)

Provides functionality for generating new content using AI models.

- **Components**: `AiGenerator`, `GeneratorPreview`
- **Configuration**: Persistent prompt settings with system/user prompt support
- **Integration**: Streams AI responses and inserts into editor
- **Features**: Optional system prompts, height persistence, preview workflow

### AI Transformer (`ai-transformer/`)

Provides functionality for transforming selected text using AI with presets.

- **Components**: `AiTransformer`, `TransformPreview`, `PresetManager`
- **Presets**: User-managed transformation configurations
- **Integration**: Selection-based operation with markdown processing
- **Features**: Preset management, streaming transformation, accept/reject workflow

### Editor Core (`editor/`)

Provides the main rich text editor with persistence and layout management.

- **Components**: `Editor`, `Toolbar`, `BlockTypeDropdown`
- **Persistence**: Automatic state saving with debouncing
- **Layout**: Configurable panel visibility for AI features
- **Features**: Lexical-based editing, formatting toolbar, selection tracking

### Shared (`shared/`)

Provides common types and utilities used across editor features.

- **Types**: `AIRuntimeInstance`, `TransformPreset`, `TransformPresetsConfig`
- **Utilities**: Markdown serialization/deserialization
- **Features**: Type-safe interfaces, bidirectional markdown conversion

## Usage

### Basic Editor Setup

```tsx
import { Editor } from '@/features/editor';
import type { AIRuntimeInstance } from '@/features/editor/shared';

function MyApp() {
  const transformerRuntime: AIRuntimeInstance = {
    // Implementation for transformation
  };

  const generatorRuntime: AIRuntimeInstance = {
    // Implementation for generation
  };

  return (
    <Editor
      onChange={(content) => console.log('Content:', content)}
      transformerRuntime={transformerRuntime}
      generatorRuntime={generatorRuntime}
    />
  );
}
```

### Using Individual Features

```tsx
import { AiGenerator, AiTransformer } from '@/features/editor';
import { useAiGeneratorConfig, useTransformPresets } from '@/features/editor';

// Use AI generator with config
const { useSystemPrompt, systemPromptText } = useAiGeneratorConfig();

// Use AI transformer with presets
const { presets, selectedPresetId, setSelectedPreset } = useTransformPresets();
```

## API Reference

### Main Exports

#### `Editor`

Main editor component with integrated AI panels.

**Props:**
- `onChange?: (content: string) => void` - Content change callback
- `transformerRuntime: AIRuntimeInstance` - Runtime for transformations
- `generatorRuntime: AIRuntimeInstance` - Runtime for generation

#### `AiGenerator`

Standalone AI generation component.

**Props:** See ai-generator README

#### `AiTransformer`

Standalone AI transformation component.

**Props:** See ai-transformer README

#### `AIRuntimeInstance`

Interface for AI runtime implementations.

**Properties:** See shared README

## Features

### Rich Text Editing

- Headings (H1-H6)
- Blockquotes
- Lists (ordered/unordered, nested)
- Code blocks with syntax highlighting
- Text formatting (bold, italic, underline, strikethrough)
- Checklists

### AI Integration

- **Generation**: Create new content with AI prompts
- **Transformation**: Modify selected text using AI presets
- **Streaming**: Real-time response streaming
- **Preview**: Accept/reject AI-generated content
- **Persistence**: Save configurations and preferences

### User Experience

- **Responsive Design**: Side-by-side layout with collapsible panels
- **Persistence**: Automatic saving and layout preferences
- **Accessibility**: Keyboard navigation and screen reader support
- **Internationalization**: Full i18n support for all UI text

### Developer Experience

- **Type Safety**: Full TypeScript support with strict typing
- **Modular Architecture**: Clear separation of concerns
- **Testable**: Isolated components and utilities
- **Extensible**: Easy to add new AI features or editor capabilities

## Configuration

### AI Runtime Implementation

To use the editor, you need to provide `AIRuntimeInstance` implementations:

```typescript
interface AIRuntimeInstance {
  isLoading: boolean;
  isStreaming: boolean;
  currentStream: string;
  error: string | null;
  startStream: (systemPrompt: string, userPrompt: string) => Promise<void>;
  cancelStream: () => Promise<void>;
  clearStream: () => void;
}
```

### Persistence

The editor automatically persists:
- Editor content (debounced, 2-second delay)
- Layout preferences (panel visibility)
- AI generator configuration (prompt settings)
- Transform presets and selection

## Error Handling

The feature provides comprehensive error handling:

- **Editor Errors**: State loading failures with fallbacks
- **AI Errors**: Stream errors displayed in UI with recovery options
- **Persistence Errors**: Logged but don't interrupt user workflow
- **Validation**: Input validation for presets and configurations

## Internationalization

All UI text is internationalized using the shared i18n system. Translation keys are organized by feature:

- `editor.*` - Core editor translations
- `editor.aiGenerator.*` - AI generator translations
- `editor.aiTransformer.*` - AI transformer translations

## Dependencies

- **Lexical**: Rich text editor framework
- **Tauri**: Backend communication for persistence
- **React**: UI framework with hooks
- **Shared UI**: Common UI components
- **i18n**: Internationalization system

## Testing

The editor feature includes comprehensive testing:

- **Unit Tests**: Individual components and utilities
- **Integration Tests**: Feature interactions
- **E2E Tests**: Full user workflows
- **Type Tests**: TypeScript type checking

## Performance

- **Debounced Persistence**: Reduces save operations
- **Lazy Loading**: Components load on demand
- **Efficient Rendering**: Optimized React rendering
- **Memory Management**: Proper cleanup of subscriptions
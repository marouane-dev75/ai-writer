# Editor Shared Feature

The Editor Shared feature provides common types, utilities, and interfaces used across the editor sub-features. It includes markdown serialization/deserialization utilities and shared type definitions.

## Overview

This feature provides:
- TypeScript type definitions for editor components
- Markdown serialization and deserialization utilities
- AIRuntime interface for AI operations
- Transform preset types and configurations

## Architecture

The feature follows a modular architecture:

```
src/features/editor/shared/
├── types.ts            # TypeScript type definitions
├── utils/              # Utility functions for markdown processing
└── index.ts            # Public API exports
```

## Usage

### Using Shared Types

```tsx
import type { TransformPreset, AIRuntimeInstance } from '@/features/editor/shared';

function MyComponent() {
  const runtime: AIRuntimeInstance = {
    isLoading: false,
    isStreaming: false,
    currentStream: '',
    error: null,
    startStream: async (systemPrompt, userPrompt) => {
      // Start AI stream
    },
    cancelStream: async () => {
      // Cancel stream
    },
    clearStream: () => {
      // Clear stream
    },
  };

  // Use runtime...
}
```

### Markdown Serialization

```tsx
import { serializeToMarkdown } from '@/features/editor/shared';

function serializeSelection(nodes: LexicalNode[]) {
  const markdown = serializeToMarkdown(nodes);
  console.log('Markdown:', markdown);
}
```

### Markdown Deserialization

```tsx
import { deserializeFromMarkdown } from '@/features/editor/shared';

function insertMarkdown(markdown: string) {
  const nodes = deserializeFromMarkdown(markdown);
  // Insert nodes into editor...
}
```

## API Reference

### Types

#### `TransformPreset`

Represents a transformation preset configuration.

```typescript
interface TransformPreset {
  id: string;
  title: string;
  description: string;
  createdAt: number;
}
```

#### `TransformPresetsConfig`

Configuration for managing transform presets.

```typescript
interface TransformPresetsConfig {
  presets: TransformPreset[];
  selectedPresetId?: string | null;
}
```

#### `AIRuntimeInstance`

Interface defining what the editor needs from an AI runtime. Follows DIP principle.

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

### Utilities

#### `serializeToMarkdown(nodes: LexicalNode[]): string`

Converts an array of Lexical nodes to markdown format.

**Parameters:**
- `nodes: LexicalNode[]` - Array of Lexical nodes to serialize

**Returns:** Markdown string representation

**Supported Node Types:**
- Headings (H1-H6)
- Paragraphs
- Blockquotes
- Lists (ordered and unordered, including nested)
- Code blocks
- Text formatting (bold, italic, underline, strikethrough, inline code)

#### `deserializeFromMarkdown(markdown: string): LexicalNode[]`

Converts a markdown string to an array of Lexical nodes.

**Parameters:**
- `markdown: string` - Markdown string to deserialize

**Returns:** Array of Lexical nodes

**Supported Markdown:**
- `# Headings`
- `> Blockquotes`
- `- Lists` and `1. Ordered lists`
- ```` ``` Code blocks`
- `**bold**`, `*italic*`, `~~strikethrough~~`, `` `code` ``

## Features

### Markdown Processing

The shared utilities provide bidirectional conversion between Lexical's rich text format and markdown:

- **Serialization**: Converts editor content to markdown for AI processing
- **Deserialization**: Converts AI-generated markdown back to editor nodes
- **Formatting Support**: Handles common markdown formatting syntax
- **Nested Structures**: Supports nested lists and complex document structures

### Type Safety

- Strongly typed interfaces for all editor interactions
- DIP-compliant AI runtime abstraction
- Consistent type definitions across editor features

### Extensibility

- Easy to add support for new markdown elements
- Modular design allows for additional shared utilities
- Type-safe extension points for new features

## Error Handling

The utilities include basic error handling:

- Invalid markdown gracefully falls back to plain text
- Unknown node types are handled with text content extraction
- Type safety prevents runtime errors from malformed data

## Dependencies

- `lexical` and related packages - For node type checking and creation
- TypeScript for type definitions
- No external runtime dependencies

## Testing

The utilities should be tested with various markdown inputs to ensure:

- Round-trip conversion (serialize → deserialize) preserves content
- All supported markdown elements are handled correctly
- Edge cases (empty content, malformed markdown) are handled gracefully
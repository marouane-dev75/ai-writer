# AI Generator Feature

The AI Generator feature provides functionality for generating new content using AI models within the editor. It allows users to input prompts and generate text that can be inserted into the document.

## Overview

This feature enables:
- AI-powered content generation with customizable prompts
- Optional system prompt configuration for consistent AI behavior
- Real-time streaming of generated content
- Preview and acceptance/rejection of generated text
- Persistent configuration of prompt settings

## Architecture

The feature follows a modular architecture with clear separation of concerns:

```
src/features/editor/ai-generator/
├── components/          # UI components for generation interface
├── hooks/              # React hooks for state management
├── services/           # Tauri command wrappers for config persistence
└── index.ts            # Public API exports
```

## Usage

### Basic Usage

```tsx
import { AiGenerator, useAiGeneratorConfig } from '@/features/editor/ai-generator';

function MyEditor() {
  const { useSystemPrompt, systemPromptText } = useAiGeneratorConfig();

  return (
    <AiGenerator
      onGenerateStream={(systemPrompt, userPrompt) => {
        // Start AI generation stream
      }}
      onCancelStream={() => {
        // Cancel current stream
      }}
      isLoading={false}
      isStreaming={false}
      currentStream="Generated text..."
      error={null}
      onClearStream={() => {
        // Clear current stream
      }}
    />
  );
}
```

### Configuration Management

```tsx
import { useAiGeneratorConfig } from '@/features/editor/ai-generator';

function ConfigComponent() {
  const {
    useSystemPrompt,
    systemPromptText,
    systemPromptHeight,
    userPromptHeight,
    setUseSystemPrompt,
    setSystemPromptText,
    setSystemPromptHeight,
    setUserPromptHeight,
  } = useAiGeneratorConfig();

  return (
    <div>
      <Switch
        checked={useSystemPrompt}
        onChange={(e) => setUseSystemPrompt(e.target.checked)}
        label="Use system prompt"
      />
      {useSystemPrompt && (
        <textarea
          value={systemPromptText}
          onChange={(e) => setSystemPromptText(e.target.value)}
          style={{ height: `${systemPromptHeight}px` }}
          placeholder="Enter system prompt..."
        />
      )}
    </div>
  );
}
```

## API Reference

### Components

#### `AiGenerator`

Main component for AI content generation.

**Props:**
- `onGenerateStream(systemPrompt: string, userPrompt: string): Promise<void>` - Start generation stream
- `onCancelStream(): Promise<void>` - Cancel current stream
- `isLoading: boolean` - Whether generation is initializing
- `isStreaming: boolean` - Whether content is streaming
- `currentStream: string` - Current generated content
- `error: string | null` - Current error message
- `onClearStream(): () => void` - Clear current stream
- `onClose?: () => void` - Optional close handler

#### `GeneratorPreview`

Displays generated content with accept/reject options.

**Props:**
- `generatedText: string` - The generated content to preview
- `isStreaming: boolean` - Whether content is still streaming
- `error: string | null` - Error message if generation failed
- `onAccept: () => void` - Accept and insert generated content
- `onReject: () => void` - Reject and discard generated content
- `onCancel: () => void` - Cancel ongoing generation

### Hooks

#### `useAiGeneratorConfig()`

Manages AI generator configuration with persistence.

**Returns:**
- `useSystemPrompt: boolean` - Whether to use system prompt
- `systemPromptText: string` - System prompt content
- `systemPromptHeight: number` - System prompt textarea height
- `userPromptHeight: number` - User prompt textarea height
- `setUseSystemPrompt(value: boolean): void` - Update system prompt usage
- `setSystemPromptText(value: string): void` - Update system prompt text
- `setSystemPromptHeight(value: number): void` - Update system prompt height
- `setUserPromptHeight(value: number): void` - Update user prompt height

### Services

#### `ai-generator-config.service`

**Functions:**
- `loadAiGeneratorConfig(): Promise<AiGeneratorConfig>` - Load config from backend
- `saveAiGeneratorConfig(config: AiGeneratorConfig): Promise<void>` - Save config to backend

### Types

#### `AiGeneratorConfig`

```typescript
interface AiGeneratorConfig {
  useSystemPrompt: boolean;
  systemPromptText: string;
  systemPromptHeight: number;
  userPromptHeight: number;
}
```

## Error Handling

The feature provides comprehensive error handling:

- Generation errors are captured and displayed in the preview
- Configuration loading/saving errors are logged and fall back to defaults
- All errors are propagated through the component props for UI feedback

## Internationalization

UI text is internationalized using the shared i18n system. Translation keys are located in `src/shared/i18n/locales/*/editor.json` under the `aiGenerator` namespace.

## Dependencies

- `@tauri-apps/api/core` - For Tauri command invocation
- React hooks for state management
- Shared UI components (`Button`, `Switch`)
- Shared i18n context for translations
- Lexical editor integration for content insertion
# AI Transformer Feature

The AI Transformer feature provides functionality for transforming selected text using AI models within the editor. It allows users to apply predefined transformation presets to modify content through AI processing.

## Overview

This feature enables:
- AI-powered text transformation with customizable presets
- Preset management for reusable transformation configurations
- Real-time streaming of transformed content
- Preview and acceptance/rejection of transformations
- Selection-based operation requiring text selection in the editor

## Architecture

The feature follows a modular architecture with clear separation of concerns:

```
src/features/editor/ai-transformer/
├── components/          # UI components for transformation interface
├── hooks/              # React hooks for state management
├── services/           # Tauri command wrappers for preset persistence
└── index.ts            # Public API exports
```

## Usage

### Basic Usage

```tsx
import { AiTransformer, useTransformPresets } from '@/features/editor/ai-transformer';

function MyEditor() {
  const { presets, selectedPresetId, setSelectedPreset } = useTransformPresets();

  return (
    <AiTransformer
      onTransformStream={(systemPrompt, userPrompt) => {
        // Start AI transformation stream
      }}
      onCancelStream={() => {
        // Cancel current stream
      }}
      isLoading={false}
      isStreaming={false}
      currentStream="Transformed text..."
      error={null}
      onClearStream={() => {
        // Clear current stream
      }}
    />
  );
}
```

### Preset Management

```tsx
import { useTransformPresets } from '@/features/editor/ai-transformer';

function PresetManager() {
  const {
    presets,
    isLoading,
    selectedPresetId,
    addPreset,
    updatePreset,
    deletePreset,
    setSelectedPreset,
  } = useTransformPresets();

  const handleAddPreset = async () => {
    await addPreset('Make it formal', 'Transform the text to be more formal and professional.');
  };

  const handleUpdatePreset = async (preset) => {
    await updatePreset({ ...preset, description: 'Updated description' });
  };

  const handleDeletePreset = async (id) => {
    await deletePreset(id);
  };

  return (
    <div>
      {presets.map(preset => (
        <div key={preset.id}>
          <h3>{preset.title}</h3>
          <p>{preset.description}</p>
          <button onClick={() => handleUpdatePreset(preset)}>Edit</button>
          <button onClick={() => handleDeletePreset(preset.id)}>Delete</button>
        </div>
      ))}
      <button onClick={handleAddPreset}>Add Preset</button>
    </div>
  );
}
```

## API Reference

### Components

#### `AiTransformer`

Main component for AI text transformation.

**Props:**
- `onTransformStream(systemPrompt: string, userPrompt: string): Promise<void>` - Start transformation stream
- `onCancelStream(): Promise<void>` - Cancel current stream
- `isLoading: boolean` - Whether transformation is initializing
- `isStreaming: boolean` - Whether content is streaming
- `currentStream: string` - Current transformed content
- `error: string | null` - Current error message
- `onClearStream(): () => void` - Clear current stream
- `onClose?: () => void` - Optional close handler

#### `TransformPreview`

Displays original and transformed content with accept/reject options.

**Props:**
- `originalText: string` - The original selected text
- `transformedText: string` - The transformed content to preview
- `isStreaming: boolean` - Whether transformation is still streaming
- `error: string | null` - Error message if transformation failed
- `onAccept: () => void` - Accept and replace with transformed content
- `onReject: () => void` - Reject and keep original content
- `onCancel: () => void` - Cancel ongoing transformation

#### `PresetManager`

Dialog component for managing transformation presets.

**Props:**
- `isOpen: boolean` - Whether the dialog is open
- `onClose: () => void` - Close dialog handler
- `presets: TransformPreset[]` - Array of available presets
- `onAdd: (title: string, description: string) => Promise<void>` - Add new preset
- `onUpdate: (preset: TransformPreset) => Promise<void>` - Update existing preset
- `onDelete: (id: string) => Promise<void>` - Delete preset
- `isLoading: boolean` - Whether operations are in progress

#### `PresetManagerDialog`

Wrapper component that includes the preset manager in a dialog.

**Props:** Same as `PresetManager`

#### `TransformButton`

Button component for triggering transformations.

**Props:**
- `onClick: () => void` - Click handler
- `disabled: boolean` - Whether button is disabled
- `children: React.ReactNode` - Button content

### Hooks

#### `useTransformPresets()`

Manages transformation presets with persistence.

**Returns:**
- `presets: TransformPreset[]` - Array of available presets
- `isLoading: boolean` - Whether presets are loading
- `error: string | null` - Current error message
- `selectedPresetId: string | null` - ID of currently selected preset
- `addPreset(title: string, description: string): Promise<void>` - Add new preset
- `updatePreset(preset: TransformPreset): Promise<void>` - Update existing preset
- `deletePreset(id: string): Promise<void>` - Delete preset by ID
- `setSelectedPreset(presetId: string | null): Promise<void>` - Set selected preset
- `refreshPresets(): Promise<void>` - Reload presets from backend

### Services

#### `transform-preset.service`

**Functions:**
- `loadPresets(): Promise<TransformPreset[]>` - Load all presets from backend
- `savePresets(presets: TransformPreset[]): Promise<void>` - Save all presets to backend
- `addPreset(preset: TransformPreset): Promise<void>` - Add new preset
- `updatePreset(preset: TransformPreset): Promise<void>` - Update existing preset
- `deletePreset(id: string): Promise<void>` - Delete preset by ID
- `getSelectedPreset(): Promise<string | null>` - Get selected preset ID
- `setSelectedPreset(presetId: string | null): Promise<void>` - Set selected preset ID

### Types

#### `UseTransformPresetsReturn`

```typescript
interface UseTransformPresetsReturn {
  presets: TransformPreset[];
  isLoading: boolean;
  error: string | null;
  selectedPresetId: string | null;
  addPreset: (title: string, description: string) => Promise<void>;
  updatePreset: (preset: TransformPreset) => Promise<void>;
  deletePreset: (id: string) => Promise<void>;
  setSelectedPreset: (presetId: string | null) => Promise<void>;
  refreshPresets: () => Promise<void>;
}
```

## Error Handling

The feature provides comprehensive error handling:

- Transformation errors are captured and displayed in the preview
- Preset operations errors are logged and shown in UI
- Invalid preset selections are automatically cleared
- All errors are propagated through hooks for UI feedback

## Internationalization

UI text is internationalized using the shared i18n system. Translation keys are located in `src/shared/i18n/locales/*/editor.json` under the `aiTransformer` namespace.

## Dependencies

- `@tauri-apps/api/core` - For Tauri command invocation
- React hooks for state management
- Shared UI components (`Button`, `Select`, `Dialog`)
- Shared i18n context for translations
- Lexical editor integration for text selection and replacement
- Shared utilities for markdown serialization/deserialization
# AI Settings Feature

## Overview

The AI Settings feature provides a comprehensive interface for configuring and managing AI providers within the application. It supports multiple AI providers including OpenAI, Anthropic, and Local Qwen, allowing users to customize model parameters, API keys, and runtime settings.

## Architecture

The feature follows a modular architecture organized into the following directories:

- `components/` - React components for the settings UI
- `hooks/` - Custom React hooks for state management and validation
- `services/` - Business logic and API communication services
- `types.ts` - TypeScript type definitions
- `validation.ts` - Zod schemas for form validation

## Components

### AIProviderSettings
[`AIProviderSettings.tsx`](components/AIProviderSettings.tsx)
Main container component that orchestrates the provider settings interface. It manages the active provider selection and renders the appropriate settings form.

### Provider-Specific Components
- [`OpenAISettings.tsx`](components/OpenAISettings.tsx) - Configuration form for OpenAI provider
- [`AnthropicSettings.tsx`](components/AnthropicSettings.tsx) - Configuration form for Anthropic provider
- [`LocalQwenSettings.tsx`](components/LocalQwenSettings.tsx) - Configuration form for Local Qwen provider
- [`ActiveProviderButton.tsx`](components/ActiveProviderButton.tsx) - Button component for switching active providers

## Hooks

### useProviderSettings
[`useProviderSettings.ts`](hooks/useProviderSettings.ts)
Manages the state and persistence of AI provider configurations. Handles loading, saving, and switching between providers.

### useFormValidation
[`useFormValidation.ts`](hooks/useFormValidation.ts)
Provides form validation utilities using Zod schemas. Returns validation errors and helper functions for form submission.

### useQwenModels
[`useQwenModels.ts`](hooks/useQwenModels.ts)
Manages Local Qwen model discovery, selection, and metadata retrieval from the filesystem.

## Services

### ai-provider.service
[`ai-provider.service.ts`](services/ai-provider.service.ts)
Handles communication with the backend for AI provider configuration management. Provides methods for getting and setting provider settings.

### qwen-model.service
[`qwen-model.service.ts`](services/qwen-model.service.ts)
Manages Local Qwen model operations including model scanning, downloading, and metadata retrieval.

## Types

The feature defines comprehensive TypeScript interfaces for all AI provider configurations:

- `AIProvider` - Union type for supported providers
- `OpenAIConfig` - OpenAI-specific configuration interface
- `AnthropicConfig` - Anthropic-specific configuration interface
- `LocalQwenConfig` - Local Qwen-specific configuration interface
- `AIProvidersConfig` - Container interface for all provider configurations

## Validation

Form validation is implemented using Zod schemas with internationalization support:

- `openAIConfigSchema` - Validates OpenAI configuration fields
- `anthropicConfigSchema` - Validates Anthropic configuration fields
- `localQwenConfigSchema` - Validates Local Qwen configuration fields

All schemas include proper error messages and range validations for numeric fields.

## Usage

```typescript
import { AIProviderSettings, aiProviderService } from './features/ai-settings';

// Use the main component in your settings page
<AIProviderSettings />

// Or use the service directly for programmatic access
const config = await aiProviderService.getProvidersConfig();
await aiProviderService.saveProvidersConfig(updatedConfig);
```

## Dependencies

- React for UI components
- Zod for schema validation
- React Hook Form for form management
- i18next for internationalization
- Tauri for backend communication

## Internationalization

The feature supports multiple languages through the shared i18n system. Validation messages and UI labels are defined in `src/shared/i18n/locales/*/ai-settings.json`.
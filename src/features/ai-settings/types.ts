export type AIProvider = 'openai' | 'anthropic' | 'localQwen';

/**
 * OpenAI provider configuration
 */
export interface OpenAIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

/**
 * Anthropic provider configuration
 */
export interface AnthropicConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

/**
 * Local Qwen provider configuration
 */
export interface LocalQwenConfig {
  modelPath: string;
  contextSize: number;
  temperature: number;
  seed: number;
  repeatPenalty: number;
  repeatLastN: number;
  useThinkingMode: boolean;
  useGpu: boolean;
}

/**
 * AI Providers configuration containing all providers and active selection
 */
export interface AIProvidersConfig {
  activeProvider: AIProvider;
  openai: OpenAIConfig;
  anthropic: AnthropicConfig;
  localQwen: LocalQwenConfig;
}

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
 * Combined AI provider configurations
 */
export interface AIProviderConfigs {
  openai: OpenAIConfig;
  anthropic: AnthropicConfig;
  localQwen: LocalQwenConfig;
}

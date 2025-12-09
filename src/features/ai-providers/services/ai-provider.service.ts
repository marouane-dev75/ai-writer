import type { AIProvider, OpenAIConfig, AnthropicConfig, LocalQwenConfig } from '../types';

/**
 * Service interface for AI provider operations
 */
export interface AIProviderService {
  getActiveProvider(): AIProvider;
  setActiveProvider(provider: AIProvider): void;
  
  // OpenAI configuration
  getOpenAIConfig(): OpenAIConfig;
  setOpenAIConfig(config: OpenAIConfig): void;
  
  // Anthropic configuration
  getAnthropicConfig(): AnthropicConfig;
  setAnthropicConfig(config: AnthropicConfig): void;
  
  // LocalQwen configuration
  getLocalQwenConfig(): LocalQwenConfig;
  setLocalQwenConfig(config: LocalQwenConfig): void;
}

/**
 * Default configuration for OpenAI provider
 */
const DEFAULT_OPENAI_CONFIG: OpenAIConfig = {
  apiKey: '',
  model: 'gpt-4-turbo',
  temperature: 0.7,
  maxTokens: 2048,
};

/**
 * Default configuration for Anthropic provider
 */
const DEFAULT_ANTHROPIC_CONFIG: AnthropicConfig = {
  apiKey: '',
  model: 'claude-3-opus',
  maxTokens: 2048,
};

/**
 * Default configuration for Local Qwen provider
 */
const DEFAULT_LOCAL_QWEN_CONFIG: LocalQwenConfig = {
  modelPath: '',
  contextSize: 4096,
  temperature: 0.7,
  seed: -1,
  repeatPenalty: 1.1,
  repeatLastN: 64,
  useThinkingMode: false,
  useGpu: true,
};

/**
 * In-memory implementation of AIProviderService
 * Stores the active provider and configurations in memory (will be replaced with backend later)
 */
class InMemoryAIProviderService implements AIProviderService {
  private activeProvider: AIProvider = 'localQwen';
  private openaiConfig: OpenAIConfig = { ...DEFAULT_OPENAI_CONFIG };
  private anthropicConfig: AnthropicConfig = { ...DEFAULT_ANTHROPIC_CONFIG };
  private localQwenConfig: LocalQwenConfig = { ...DEFAULT_LOCAL_QWEN_CONFIG };

  getActiveProvider(): AIProvider {
    return this.activeProvider;
  }

  setActiveProvider(provider: AIProvider): void {
    this.activeProvider = provider;
  }

  getOpenAIConfig(): OpenAIConfig {
    return { ...this.openaiConfig };
  }

  setOpenAIConfig(config: OpenAIConfig): void {
    this.openaiConfig = { ...config };
  }

  getAnthropicConfig(): AnthropicConfig {
    return { ...this.anthropicConfig };
  }

  setAnthropicConfig(config: AnthropicConfig): void {
    this.anthropicConfig = { ...config };
  }

  getLocalQwenConfig(): LocalQwenConfig {
    return { ...this.localQwenConfig };
  }

  setLocalQwenConfig(config: LocalQwenConfig): void {
    this.localQwenConfig = { ...config };
  }
}

// Export singleton instance
export const aiProviderService: AIProviderService = new InMemoryAIProviderService();

import { invoke } from '@tauri-apps/api/core';
import type { 
  AIProvider, 
  OpenAIConfig, 
  AnthropicConfig, 
  LocalQwenConfig,
  AIProvidersConfig 
} from '../types';

/**
 * Service interface for AI provider operations
 * This abstraction allows different implementations (mock, backend, etc.)
 */
export interface AIProviderService {
  /**
   * Load all AI provider configs from backend
   */
  loadConfig(): Promise<AIProvidersConfig>;
  
  /**
   * Save all AI provider configs to backend
   * Only updates the aiProviders section, preserves other app config
   */
  saveConfig(config: AIProvidersConfig): Promise<void>;
  
  /**
   * Get active provider from current cached state
   * Requires loadConfig() to be called first
   */
  getActiveProvider(): AIProvider;
  
  /**
   * Get OpenAI config from current cached state
   * Requires loadConfig() to be called first
   */
  getOpenAIConfig(): OpenAIConfig;
  
  /**
   * Get Anthropic config from current cached state
   * Requires loadConfig() to be called first
   */
  getAnthropicConfig(): AnthropicConfig;
  
  /**
   * Get Local Qwen config from current cached state
   * Requires loadConfig() to be called first
   */
  getLocalQwenConfig(): LocalQwenConfig;
}

/**
 * Backend implementation of AIProviderService
 * Communicates with Tauri backend via invoke
 * Uses dedicated AI provider commands - no knowledge of other app config
 */
class BackendAIProviderService implements AIProviderService {
  private currentConfig: AIProvidersConfig | null = null;

  async loadConfig(): Promise<AIProvidersConfig> {
    try {
      const config = await invoke<AIProvidersConfig>('load_ai_providers_config');
      this.currentConfig = config;
      return { ...this.currentConfig };
    } catch (error) {
      throw new Error(
        `Failed to load AI provider configuration: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async saveConfig(config: AIProvidersConfig): Promise<void> {
    try {
      await invoke('save_ai_providers_config', { aiProvidersConfig: config });
      
      // Update local cache
      this.currentConfig = { ...config };
    } catch (error) {
      throw new Error(
        `Failed to save AI provider configuration: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  getActiveProvider(): AIProvider {
    if (!this.currentConfig) {
      throw new Error('Config not loaded. Call loadConfig() first.');
    }
    return this.currentConfig.activeProvider;
  }

  getOpenAIConfig(): OpenAIConfig {
    if (!this.currentConfig) {
      throw new Error('Config not loaded. Call loadConfig() first.');
    }
    return { ...this.currentConfig.openai };
  }

  getAnthropicConfig(): AnthropicConfig {
    if (!this.currentConfig) {
      throw new Error('Config not loaded. Call loadConfig() first.');
    }
    return { ...this.currentConfig.anthropic };
  }

  getLocalQwenConfig(): LocalQwenConfig {
    if (!this.currentConfig) {
      throw new Error('Config not loaded. Call loadConfig() first.');
    }
    return { ...this.currentConfig.localQwen };
  }
}

/**
 * Singleton instance of the AI provider service
 * This is the main service used throughout the application
 */
export const aiProviderService: AIProviderService = new BackendAIProviderService();

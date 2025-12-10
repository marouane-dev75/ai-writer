import { invoke } from '@tauri-apps/api/core';
import type { 
  AIProvider, 
  OpenAIConfig, 
  AnthropicConfig, 
  LocalQwenConfig,
  AIProvidersConfig 
} from '../types';

/**
 * Internal AppConfig interface - only used internally to communicate with backend
 * This feature should only expose AI provider configs
 */
interface AppConfig {
  theme: {
    darkMode: boolean;
  };
  locale: {
    language: string;
  };
  aiProviders: AIProvidersConfig;
}

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
 * Only exposes AI provider configs, internal handling of full AppConfig
 */
class BackendAIProviderService implements AIProviderService {
  private currentConfig: AIProvidersConfig | null = null;

  async loadConfig(): Promise<AIProvidersConfig> {
    try {
      const appConfig = await invoke<AppConfig>('load_config');
      this.currentConfig = appConfig.aiProviders;
      return { ...this.currentConfig };
    } catch (error) {
      throw new Error(
        `Failed to load AI provider configuration: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async saveConfig(config: AIProvidersConfig): Promise<void> {
    try {
      // Load current full app config
      const appConfig = await invoke<AppConfig>('load_config');
      
      // Update only AI providers section
      appConfig.aiProviders = config;
      
      // Save back the full config
      await invoke('save_config', { config: appConfig });
      
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

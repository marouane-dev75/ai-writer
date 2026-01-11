import { invoke } from '@tauri-apps/api/core';

export interface AiGeneratorConfig {
  useSystemPrompt: boolean;
  systemPromptText: string;
  systemPromptHeight: number;
  userPromptHeight: number;
}

/**
 * Load AI generator configuration from backend
 */
export const loadAiGeneratorConfig = async (): Promise<AiGeneratorConfig> => {
  try {
    const config = await invoke<AiGeneratorConfig>('load_ai_generator_config');
    return config;
  } catch (error) {
    console.error('Failed to load AI generator config:', error);
    // Return default values on error
    return {
      useSystemPrompt: false,
      systemPromptText: '',
      systemPromptHeight: 120,
      userPromptHeight: 120,
    };
  }
};

/**
 * Save AI generator configuration to backend
 */
export const saveAiGeneratorConfig = async (config: AiGeneratorConfig): Promise<void> => {
  try {
    await invoke('save_ai_generator_config', { aiGeneratorConfig: config });
  } catch (error) {
    console.error('Failed to save AI generator config:', error);
    throw error;
  }
};

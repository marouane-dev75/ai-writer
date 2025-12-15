import { invoke } from '@tauri-apps/api/core';
import type { AIPreset, AIPresetsConfig } from '../types';

export class AIPresetsService {
  /**
   * Load AI presets configuration
   */
  async loadConfig(): Promise<AIPresetsConfig> {
    return invoke<AIPresetsConfig>('load_ai_presets_config');
  }

  /**
   * Add a new AI preset
   */
  async addPreset(preset: AIPreset): Promise<void> {
    return invoke('add_ai_preset', { preset });
  }

  /**
   * Update an existing AI preset
   */
  async updatePreset(id: string, preset: AIPreset): Promise<void> {
    return invoke('update_ai_preset', { id, preset });
  }

  /**
   * Delete an AI preset
   */
  async deletePreset(id: string): Promise<void> {
    return invoke('delete_ai_preset', { id });
  }
}

// Export singleton instance
export const aiPresetsService = new AIPresetsService();

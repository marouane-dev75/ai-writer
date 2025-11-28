import { invoke } from '@tauri-apps/api/core';
import type { AppConfig } from '../types';

/**
 * Service interface for configuration operations
 */
export interface ConfigService {
  loadConfig(): Promise<AppConfig>;
  saveConfig(config: AppConfig): Promise<void>;
}

/**
 * Concrete implementation using Tauri backend
 */
class TauriConfigService implements ConfigService {
  async loadConfig(): Promise<AppConfig> {
    return await invoke<AppConfig>('load_config');
  }

  async saveConfig(config: AppConfig): Promise<void> {
    await invoke('save_config', { config });
  }
}

// Export singleton instance
export const configService: ConfigService = new TauriConfigService();

import { invoke } from '@tauri-apps/api/core';
import type { LocaleStorage, LocaleConfig } from '../types';

/**
 * Implementation of LocaleStorage using dedicated Tauri commands
 * Uses feature-specific commands - no knowledge of other app config
 */
export class TauriLocaleStorage implements LocaleStorage {
  async loadLocale(): Promise<LocaleConfig> {
    try {
      const config = await invoke<LocaleConfig>('load_locale_config');
      return config;
    } catch (error) {
      throw new Error(
        `Failed to load locale configuration: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async saveLocale(locale: LocaleConfig): Promise<void> {
    try {
      await invoke('save_locale_config', { localeConfig: locale });
    } catch (error) {
      throw new Error(
        `Failed to save locale configuration: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

// Export singleton instance
export const localeStorage = new TauriLocaleStorage();

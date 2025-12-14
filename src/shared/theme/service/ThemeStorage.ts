import { invoke } from '@tauri-apps/api/core';
import type { ThemeStorage, ThemeConfig } from '../types';

/**
 * Implementation of ThemeStorage using dedicated Tauri commands
 * Uses feature-specific commands - no knowledge of other app config
 */
export class TauriThemeStorage implements ThemeStorage {
  async loadTheme(): Promise<ThemeConfig> {
    try {
      const config = await invoke<ThemeConfig>('load_theme_config');
      return config;
    } catch (error) {
      throw new Error(
        `Failed to load theme configuration: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async saveTheme(theme: ThemeConfig): Promise<void> {
    try {
      await invoke('save_theme_config', { themeConfig: theme });
    } catch (error) {
      throw new Error(
        `Failed to save theme configuration: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

// Export singleton instance
export const themeStorage = new TauriThemeStorage();

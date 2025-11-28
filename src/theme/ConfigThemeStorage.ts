import type { ThemeStorage, ThemeConfig } from './ThemeStorage.interface';
import { configService } from '../features/configuration/services/config.service';

/**
 * Implementation of ThemeStorage using the configuration service
 * This is the concrete implementation that bridges theme and config (DIP)
 */
export class ConfigThemeStorage implements ThemeStorage {
  async loadTheme(): Promise<ThemeConfig> {
    const config = await configService.loadConfig();
    return config.theme;
  }

  async saveTheme(theme: ThemeConfig): Promise<void> {
    const config = await configService.loadConfig();
    config.theme = theme;
    await configService.saveConfig(config);
  }
}

// Export singleton instance
export const configThemeStorage = new ConfigThemeStorage();

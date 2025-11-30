import type { LocaleStorage } from './LocaleStorage.interface';
import type { LocaleConfig } from '../configuration/types';
import { configService } from '../configuration/services/config.service';

/**
 * Implementation of LocaleStorage using the configuration service
 * This is the concrete implementation that bridges locale and config (DIP)
 */
export class ConfigLocaleStorage implements LocaleStorage {
  async loadLocale(): Promise<LocaleConfig> {
    const config = await configService.loadConfig();
    return config.locale;
  }

  async saveLocale(locale: LocaleConfig): Promise<void> {
    const config = await configService.loadConfig();
    config.locale = locale;
    await configService.saveConfig(config);
  }
}

// Export singleton instance
export const configLocaleStorage = new ConfigLocaleStorage();

import { configService } from './config.service';
import type { LocaleStorage } from '@/shared/i18n';
import type { LocaleConfig } from '@/shared/i18n';

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

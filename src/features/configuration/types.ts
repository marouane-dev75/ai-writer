import type { LocaleConfig } from '@/shared/i18n';
import type { ThemeConfig } from '@/shared/theme';

export interface AppConfig {
  theme: ThemeConfig;
  locale: LocaleConfig;
}

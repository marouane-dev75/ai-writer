/**
 * Locale configuration type
 * Defines the structure for locale/language settings
 */
export interface LocaleConfig {
  language: string;
}

/**
 * Interface for locale storage abstraction
 * This allows different storage implementations (DIP)
 */
export interface LocaleStorage {
  loadLocale(): Promise<LocaleConfig>;
  saveLocale(locale: LocaleConfig): Promise<void>;
}

import { LocaleConfig } from "@/features/configuration";


/**
 * Interface for locale storage abstraction
 * This allows different storage implementations (DIP)
 */
export interface LocaleStorage {
  loadLocale(): Promise<LocaleConfig>;
  saveLocale(locale: LocaleConfig): Promise<void>;
}

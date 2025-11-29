// TypeScript types matching Rust structures
// These will be auto-generated from Rust in production using tauri bindings

export interface AppConfig {
  theme: ThemeConfig;
  locale: LocaleConfig;
}

export interface ThemeConfig {
  dark_mode: boolean;
}

export interface LocaleConfig {
  language: string;
}

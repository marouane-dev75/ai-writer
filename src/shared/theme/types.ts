/**
 * Theme configuration type
 * Defines the structure for theme settings
 */
export interface ThemeConfig {
  darkMode: boolean;
}

/**
 * ThemeStorage abstraction (DIP)
 * ThemeContext depends on this interface, not on concrete implementations
 */
export interface ThemeStorage {
  loadTheme(): Promise<ThemeConfig>;
  saveTheme(theme: ThemeConfig): Promise<void>;
}

/**
 * ThemeStorage abstraction (DIP)
 * ThemeContext depends on this interface, not on concrete implementations
 */

export interface ThemeConfig {
  dark_mode: boolean;
}

export interface ThemeStorage {
  loadTheme(): Promise<ThemeConfig>;
  saveTheme(theme: ThemeConfig): Promise<void>;
}

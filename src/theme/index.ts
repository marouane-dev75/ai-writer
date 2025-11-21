/**
 * Theme Module
 * 
 * This module provides centralized theme configuration for the application.
 * 
 * ## CSS Variables
 * All theme colors are defined as CSS custom properties in `theme.css`:
 * - Primary colors: --color-primary-{50-950}
 * - Secondary colors: --color-secondary-{50-950}
 * - Success colors: --color-success-{50-950}
 * - Danger colors: --color-danger-{50-950}
 * - Warning colors: --color-warning-{50-950}
 * - Info colors: --color-info-{50-950}
 * 
 * ## Dark Mode
 * Dark mode is automatically handled via the `.dark` class on the root element.
 * Color values are inverted in dark mode to maintain proper contrast.
 * 
 * ## Usage
 * Import the theme CSS in your main entry point:
 * ```tsx
 * import './theme/theme.css';
 * ```
 * 
 * Use Tailwind utility classes with theme colors:
 * ```tsx
 * <div className="bg-primary text-white">Primary Button</div>
 * <span className="bg-success-light text-success-dark">Success Badge</span>
 * ```
 * 
 * Or use CSS variables directly:
 * ```css
 * .custom-element {
 *   background-color: var(--color-primary-500);
 *   color: var(--color-primary-50);
 * }
 * ```
 */

export { ThemeProvider, useTheme } from './ThemeContext';

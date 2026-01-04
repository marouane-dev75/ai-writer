/**
 * Types for the app restart feature
 */

/**
 * Service interface for app restart operations
 */
export interface AppRestartService {
  /**
   * Restart the application
   */
  restart(): Promise<void>;
  
  /**
   * Check if running in development mode
   */
  isDevMode(): Promise<boolean>;
  
  /**
   * Close the application
   */
  close(): Promise<void>;
}

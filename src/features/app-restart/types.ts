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
   * Close the application
   */
  close(): Promise<void>;
}

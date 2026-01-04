import { invoke } from '@tauri-apps/api/core';
import type { AppRestartService } from '../types';

/**
 * Backend implementation of AppRestartService
 * Communicates with Tauri backend via invoke
 */
class BackendAppRestartService implements AppRestartService {
  async restart(): Promise<void> {
    try {
      await invoke('restart_app');
    } catch (error) {
      throw new Error(
        `Failed to restart application: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async isDevMode(): Promise<boolean> {
    try {
      return await invoke<boolean>('is_dev_mode');
    } catch (error) {
      throw new Error(
        `Failed to check dev mode: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async close(): Promise<void> {
    try {
      await invoke('close_app');
    } catch (error) {
      throw new Error(
        `Failed to close application: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

/**
 * Singleton instance of the app restart service
 * This is the main service used throughout the application
 */
export const appRestartService: AppRestartService = new BackendAppRestartService();

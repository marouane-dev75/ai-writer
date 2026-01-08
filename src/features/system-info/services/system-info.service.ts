import { invoke } from '@tauri-apps/api/core';
import type { SystemInfo } from '../types';

/**
 * Service interface for system information operations
 * This abstraction allows different implementations (mock, backend, etc.)
 */
export interface SystemInfoService {
  /**
   * Get system hardware information
   */
  getSystemInfo(): Promise<SystemInfo>;
}

/**
 * Backend implementation of SystemInfoService
 * Communicates with Tauri backend via invoke
 */
class BackendSystemInfoService implements SystemInfoService {
  async getSystemInfo(): Promise<SystemInfo> {
    try {
      const info = await invoke<SystemInfo>('get_system_info');
      return info;
    } catch (error) {
      throw new Error(
        `Failed to get system information: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

/**
 * Singleton instance of the system info service
 * This is the main service used throughout the application
 */
export const systemInfoService: SystemInfoService = new BackendSystemInfoService();

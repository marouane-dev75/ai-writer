import { invoke } from '@tauri-apps/api/core';
import type { LogResponse } from '../types';

export const logService = {
  /**
   * Get logs from a specific cursor position
   */
  async getLogs(cursor: number): Promise<LogResponse> {
    return await invoke<LogResponse>('get_logs', { cursor });
  },

  /**
   * Get all logs (cursor = 0)
   */
  async getAllLogs(): Promise<LogResponse> {
    return await invoke<LogResponse>('get_all_logs');
  },

  /**
   * Clear all logs
   */
  async clearLogs(): Promise<void> {
    return await invoke<void>('clear_logs');
  },
};

import { invoke } from '@tauri-apps/api/core';

/**
 * Service for persisting editor state to disk via Tauri backend
 */
export class EditorPersistenceService {
  /**
   * Save editor state to disk
   * @param state - Serialized editor state (JSON string)
   */
  static async saveEditorState(state: string): Promise<void> {
    try {
      await invoke('save_editor_state', { state });
    } catch (error) {
      console.error('Failed to save editor state:', error);
      throw error;
    }
  }

  /**
   * Load editor state from disk
   * @returns Serialized editor state (JSON string) or empty string if no state exists
   */
  static async loadEditorState(): Promise<string> {
    try {
      const state = await invoke<string>('load_editor_state');
      return state;
    } catch (error) {
      console.error('Failed to load editor state:', error);
      throw error;
    }
  }

  /**
   * Clear saved editor state
   */
  static async clearEditorState(): Promise<void> {
    try {
      await invoke('clear_editor_state');
    } catch (error) {
      console.error('Failed to clear editor state:', error);
      throw error;
    }
  }
}

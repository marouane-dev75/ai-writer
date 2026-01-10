import { invoke } from '@tauri-apps/api/core';

export interface EditorLayoutConfig {
  showTransformer: boolean;
  showGenerator: boolean;
}

/**
 * Load editor layout configuration from backend
 */
export const loadEditorLayout = async (): Promise<EditorLayoutConfig> => {
  try {
    const config = await invoke<EditorLayoutConfig>('load_editor_layout_config');
    return config;
  } catch (error) {
    console.error('Failed to load editor layout config:', error);
    // Return default values on error
    return {
      showTransformer: true,
      showGenerator: true,
    };
  }
};

/**
 * Save editor layout configuration to backend
 */
export const saveEditorLayout = async (config: EditorLayoutConfig): Promise<void> => {
  try {
    await invoke('save_editor_layout_config', { editorLayoutConfig: config });
  } catch (error) {
    console.error('Failed to save editor layout config:', error);
    throw error;
  }
};

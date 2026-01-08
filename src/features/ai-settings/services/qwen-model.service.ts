import { invoke } from '@tauri-apps/api/core';
import { listen, UnlistenFn } from '@tauri-apps/api/event';

export interface QwenModelInfo {
  id: string;
  name: string;
  model_repo: string;
  model_file: string;
  tokenizer_repo: string;
  subfolder: string;
}

export interface QwenAvailableModel {
  id: string;
  name: string;
  is_downloaded: boolean;
  model_path: string | null;
  tokenizer_path: string | null;
}

export interface QwenScanResult {
  base_path: string;
  available_models: QwenAvailableModel[];
}

export interface DownloadProgress {
  file: string; // "model" or "tokenizer"
  downloaded: number;
  total: number | null;
  percentage: number;
}

/**
 * Service for managing Qwen models
 */
export const qwenModelService = {
  /**
   * Scans the base path for downloaded Qwen models
   */
  scanModels: async (basePath: string): Promise<QwenScanResult> => {
    return invoke<QwenScanResult>('scan_qwen_models_cmd', { basePath });
  },

  /**
   * Gets the catalog of available Qwen models
   */
  getAvailableModels: async (): Promise<QwenModelInfo[]> => {
    return invoke<QwenModelInfo[]>('get_qwen_models_cmd');
  },

  /**
   * Downloads a Qwen model and its tokenizer
   */
  downloadModel: async (
    basePath: string,
    modelId: string,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> => {
    let unlisten: UnlistenFn | null = null;

    try {
      // Listen to progress events if callback provided
      if (onProgress) {
        unlisten = await listen<DownloadProgress>('model-download-progress', (event) => {
          onProgress(event.payload);
        });
      }

      // Start download
      await invoke('download_qwen_model_cmd', { basePath, modelId });
    } finally {
      // Clean up listener
      if (unlisten) {
        unlisten();
      }
    }
  },
};

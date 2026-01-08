import { useState, useEffect, useCallback } from 'react';
import {
  qwenModelService,
  QwenModelInfo,
  QwenAvailableModel,
  DownloadProgress,
} from '../services/qwen-model.service';

interface UseQwenModelsResult {
  availableModels: QwenModelInfo[];
  downloadedModels: QwenAvailableModel[];
  isScanning: boolean;
  isDownloading: boolean;
  downloadProgress: DownloadProgress | null;
  error: string | null;
  downloadModel: (modelId: string) => Promise<void>;
  rescan: () => Promise<void>;
}

/**
 * Hook for managing Qwen models
 */
export const useQwenModels = (basePath: string): UseQwenModelsResult => {
  const [availableModels, setAvailableModels] = useState<QwenModelInfo[]>([]);
  const [downloadedModels, setDownloadedModels] = useState<QwenAvailableModel[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load available models catalog
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const models = await qwenModelService.getAvailableModels();
        setAvailableModels(models);
      } catch (err) {
        console.error('Failed to load model catalog:', err);
        setError(err instanceof Error ? err.message : 'Failed to load model catalog');
      }
    };

    loadCatalog();
  }, []);

  // Scan for downloaded models when basePath changes
  const rescan = useCallback(async () => {
    if (!basePath) {
      setDownloadedModels([]);
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      const result = await qwenModelService.scanModels(basePath);
      setDownloadedModels(result.available_models);
    } catch (err) {
      console.error('Failed to scan models:', err);
      setError(err instanceof Error ? err.message : 'Failed to scan models');
      setDownloadedModels([]);
    } finally {
      setIsScanning(false);
    }
  }, [basePath]);

  // Auto-scan when basePath changes
  useEffect(() => {
    rescan();
  }, [rescan]);

  // Download a model
  const downloadModel = useCallback(
    async (modelId: string) => {
      if (!basePath) {
        setError('Please select a base path first');
        return;
      }

      setIsDownloading(true);
      setDownloadProgress(null);
      setError(null);

      try {
        await qwenModelService.downloadModel(
          basePath,
          modelId,
          (progress) => {
            setDownloadProgress(progress);
          }
        );

        // Rescan after successful download
        await rescan();
      } catch (err) {
        console.error('Failed to download model:', err);
        setError(err instanceof Error ? err.message : 'Failed to download model');
      } finally {
        setIsDownloading(false);
        setDownloadProgress(null);
      }
    },
    [basePath, rescan]
  );

  return {
    availableModels,
    downloadedModels,
    isScanning,
    isDownloading,
    downloadProgress,
    error,
    downloadModel,
    rescan,
  };
};

import { useState, useEffect, useCallback } from 'react';
import type { AIPreset, AIPresetsConfig } from '../types';
import type { AIPresetsService } from '../services/ai-presets.service';

export interface UseAIPresetsReturn {
  presets: AIPreset[];
  isLoading: boolean;
  error: string | null;
  addPreset: (preset: AIPreset) => Promise<void>;
  updatePreset: (id: string, preset: AIPreset) => Promise<void>;
  deletePreset: (id: string) => Promise<void>;
  refreshPresets: () => Promise<void>;
}

export const useAIPresets = (service: AIPresetsService): UseAIPresetsReturn => {
  const [presets, setPresets] = useState<AIPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPresets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const config = await service.loadConfig();
      setPresets(config.presets);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load AI presets';
      setError(errorMessage);
      console.error('Failed to load AI presets:', err);
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const addPreset = useCallback(async (preset: AIPreset) => {
    try {
      setError(null);
      await service.addPreset(preset);
      await loadPresets();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add preset';
      setError(errorMessage);
      throw err;
    }
  }, [service, loadPresets]);

  const updatePreset = useCallback(async (id: string, preset: AIPreset) => {
    try {
      setError(null);
      await service.updatePreset(id, preset);
      await loadPresets();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update preset';
      setError(errorMessage);
      throw err;
    }
  }, [service, loadPresets]);

  const deletePreset = useCallback(async (id: string) => {
    try {
      setError(null);
      await service.deletePreset(id);
      await loadPresets();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete preset';
      setError(errorMessage);
      throw err;
    }
  }, [service, loadPresets]);

  useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  return {
    presets,
    isLoading,
    error,
    addPreset,
    updatePreset,
    deletePreset,
    refreshPresets: loadPresets,
  };
};

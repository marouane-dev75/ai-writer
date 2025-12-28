import { useState, useEffect, useCallback } from 'react';
import type { TransformPreset } from '../types';
import * as presetService from '../services/transform-preset.service';

export interface UseTransformPresetsReturn {
  presets: TransformPreset[];
  isLoading: boolean;
  error: string | null;
  addPreset: (title: string, description: string) => Promise<void>;
  updatePreset: (preset: TransformPreset) => Promise<void>;
  deletePreset: (id: string) => Promise<void>;
  refreshPresets: () => Promise<void>;
}

export function useTransformPresets(): UseTransformPresetsReturn {
  const [presets, setPresets] = useState<TransformPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPresets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedPresets = await presetService.loadPresets();
      setPresets(loadedPresets);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load presets';
      setError(errorMessage);
      console.error('Failed to load presets:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  const addPreset = useCallback(async (title: string, description: string) => {
    try {
      setError(null);
      const newPreset: TransformPreset = {
        id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        createdAt: Date.now(),
      };
      
      await presetService.addPreset(newPreset);
      setPresets((prev) => [...prev, newPreset]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add preset';
      setError(errorMessage);
      console.error('Failed to add preset:', err);
      throw err;
    }
  }, []);

  const updatePreset = useCallback(async (preset: TransformPreset) => {
    try {
      setError(null);
      await presetService.updatePreset(preset);
      setPresets((prev) =>
        prev.map((p) => (p.id === preset.id ? preset : p))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update preset';
      setError(errorMessage);
      console.error('Failed to update preset:', err);
      throw err;
    }
  }, []);

  const deletePreset = useCallback(async (id: string) => {
    try {
      setError(null);
      await presetService.deletePreset(id);
      setPresets((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete preset';
      setError(errorMessage);
      console.error('Failed to delete preset:', err);
      throw err;
    }
  }, []);

  return {
    presets,
    isLoading,
    error,
    addPreset,
    updatePreset,
    deletePreset,
    refreshPresets: loadPresets,
  };
}

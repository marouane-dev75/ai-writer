import { useState, useCallback, useEffect } from 'react';
import type { AIProviderService } from '../services/ai-provider.service';
import type { AIProvidersConfig, AIProvider } from '../types';

interface UseProviderSettingsReturn {
  // Current editing state
  config: AIProvidersConfig | null;
  
  // Selected tab
  selectedProvider: AIProvider;
  setSelectedProvider: (provider: AIProvider) => void;
  
  // Update methods (local state only, doesn't save)
  updateConfig: (updates: Partial<AIProvidersConfig>) => void;
  
  // Persistence
  save: () => Promise<void>;
  reset: () => void;
  
  // State flags
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  error: string | null;
}

/**
 * Custom hook to manage AI provider settings state
 * Handles loading, editing, saving, and resetting configuration
 * 
 * @param service - The AI provider service instance
 * @returns State and methods for managing provider settings
 * 
 * @example
 * ```tsx
 * const {
 *   config,
 *   updateConfig,
 *   save,
 *   isDirty,
 *   isSaving
 * } = useProviderSettings(aiProviderService);
 * ```
 */
export function useProviderSettings(
  service: AIProviderService
): UseProviderSettingsReturn {
  const [config, setConfig] = useState<AIProvidersConfig | null>(null);
  const [originalConfig, setOriginalConfig] = useState<AIProvidersConfig | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('localQwen');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load config on mount
  useEffect(() => {
    let mounted = true;
    
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loaded = await service.loadConfig();
        
        if (mounted) {
          setConfig(loaded);
          setOriginalConfig(loaded);
          setSelectedProvider(loaded.activeProvider);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load configuration');
          console.error('Failed to load AI provider config:', err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadConfig();
    
    return () => {
      mounted = false;
    };
  }, [service]);

  // Update local config (doesn't save to backend)
  const updateConfig = useCallback((updates: Partial<AIProvidersConfig>) => {
    setConfig(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  // Save to backend
  const save = useCallback(async () => {
    if (!config) {
      throw new Error('No configuration to save');
    }
    
    try {
      setIsSaving(true);
      setError(null);
      await service.saveConfig(config);
      setOriginalConfig(config); // Update baseline after successful save
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save configuration';
      setError(errorMessage);
      console.error('Failed to save AI provider config:', err);
      throw err; // Re-throw for component handling
    } finally {
      setIsSaving(false);
    }
  }, [config, service]);

  // Reset to last saved state
  const reset = useCallback(() => {
    setConfig(originalConfig);
    if (originalConfig) {
      setSelectedProvider(originalConfig.activeProvider);
    }
    setError(null);
  }, [originalConfig]);

  // Check if config has unsaved changes
  const isDirty = config !== null && 
                  originalConfig !== null && 
                  JSON.stringify(config) !== JSON.stringify(originalConfig);

  return {
    config,
    selectedProvider,
    setSelectedProvider,
    updateConfig,
    save,
    reset,
    isLoading,
    isSaving,
    isDirty,
    error,
  };
}

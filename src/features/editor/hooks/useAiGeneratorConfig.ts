import { useState, useEffect, useCallback } from 'react';
import { loadAiGeneratorConfig, saveAiGeneratorConfig, AiGeneratorConfig } from '../services/ai-generator-config.service';

interface UseAiGeneratorConfigResult {
  useSystemPrompt: boolean;
  systemPromptText: string;
  setUseSystemPrompt: (use: boolean) => void;
  setSystemPromptText: (text: string) => void;
  isLoading: boolean;
}

/**
 * Hook to manage AI generator configuration with backend persistence
 */
export const useAiGeneratorConfig = (): UseAiGeneratorConfigResult => {
  const [useSystemPrompt, setUseSystemPromptState] = useState(false);
  const [systemPromptText, setSystemPromptTextState] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load config on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await loadAiGeneratorConfig();
        setUseSystemPromptState(config.useSystemPrompt);
        setSystemPromptTextState(config.systemPromptText);
      } catch (error) {
        console.error('Failed to load AI generator config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Save config when it changes
  const saveConfig = useCallback(async (config: AiGeneratorConfig) => {
    try {
      await saveAiGeneratorConfig(config);
    } catch (error) {
      console.error('Failed to save AI generator config:', error);
    }
  }, []);

  // Wrapper for setUseSystemPrompt that also saves
  const setUseSystemPrompt = useCallback((use: boolean) => {
    setUseSystemPromptState(use);
    saveConfig({ useSystemPrompt: use, systemPromptText });
  }, [systemPromptText, saveConfig]);

  // Wrapper for setSystemPromptText that also saves
  const setSystemPromptText = useCallback((text: string) => {
    setSystemPromptTextState(text);
    saveConfig({ useSystemPrompt, systemPromptText: text });
  }, [useSystemPrompt, saveConfig]);

  return {
    useSystemPrompt,
    systemPromptText,
    setUseSystemPrompt,
    setSystemPromptText,
    isLoading,
  };
};

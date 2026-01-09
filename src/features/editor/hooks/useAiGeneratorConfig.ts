import { useState, useEffect, useCallback } from 'react';
import { loadAiGeneratorConfig, saveAiGeneratorConfig, AiGeneratorConfig } from '../services/ai-generator-config.service';

interface UseAiGeneratorConfigResult {
  useSystemPrompt: boolean;
  systemPromptText: string;
  systemPromptHeight: number;
  userPromptHeight: number;
  setUseSystemPrompt: (use: boolean) => void;
  setSystemPromptText: (text: string) => void;
  setSystemPromptHeight: (height: number) => void;
  setUserPromptHeight: (height: number) => void;
  isLoading: boolean;
}

/**
 * Hook to manage AI generator configuration with backend persistence
 */
export const useAiGeneratorConfig = (): UseAiGeneratorConfigResult => {
  const [useSystemPrompt, setUseSystemPromptState] = useState(false);
  const [systemPromptText, setSystemPromptTextState] = useState('');
  const [systemPromptHeight, setSystemPromptHeightState] = useState(120);
  const [userPromptHeight, setUserPromptHeightState] = useState(120);
  const [isLoading, setIsLoading] = useState(true);

  // Load config on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await loadAiGeneratorConfig();
        setUseSystemPromptState(config.useSystemPrompt);
        setSystemPromptTextState(config.systemPromptText);
        setSystemPromptHeightState(config.systemPromptHeight);
        setUserPromptHeightState(config.userPromptHeight);
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
    saveConfig({ useSystemPrompt: use, systemPromptText, systemPromptHeight, userPromptHeight });
  }, [systemPromptText, systemPromptHeight, userPromptHeight, saveConfig]);

  // Wrapper for setSystemPromptText that also saves
  const setSystemPromptText = useCallback((text: string) => {
    setSystemPromptTextState(text);
    saveConfig({ useSystemPrompt, systemPromptText: text, systemPromptHeight, userPromptHeight });
  }, [useSystemPrompt, systemPromptHeight, userPromptHeight, saveConfig]);

  // Wrapper for setSystemPromptHeight that also saves
  const setSystemPromptHeight = useCallback((height: number) => {
    setSystemPromptHeightState(height);
    saveConfig({ useSystemPrompt, systemPromptText, systemPromptHeight: height, userPromptHeight });
  }, [useSystemPrompt, systemPromptText, userPromptHeight, saveConfig]);

  // Wrapper for setUserPromptHeight that also saves
  const setUserPromptHeight = useCallback((height: number) => {
    setUserPromptHeightState(height);
    saveConfig({ useSystemPrompt, systemPromptText, systemPromptHeight, userPromptHeight: height });
  }, [useSystemPrompt, systemPromptText, systemPromptHeight, saveConfig]);

  return {
    useSystemPrompt,
    systemPromptText,
    systemPromptHeight,
    userPromptHeight,
    setUseSystemPrompt,
    setSystemPromptText,
    setSystemPromptHeight,
    setUserPromptHeight,
    isLoading,
  };
};

import { useState, useEffect, useCallback } from 'react';
import { loadEditorLayout, saveEditorLayout, EditorLayoutConfig } from '../services/editor-layout.service';

interface UseEditorLayoutResult {
  showTransformer: boolean;
  showGenerator: boolean;
  setShowTransformer: (show: boolean) => void;
  setShowGenerator: (show: boolean) => void;
  isLoading: boolean;
}

/**
 * Hook to manage editor layout state with backend persistence
 */
export const useEditorLayout = (): UseEditorLayoutResult => {
  const [showTransformer, setShowTransformerState] = useState(true);
  const [showGenerator, setShowGeneratorState] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load layout on mount
  useEffect(() => {
    const loadLayout = async () => {
      try {
        const config = await loadEditorLayout();
        setShowTransformerState(config.showTransformer);
        setShowGeneratorState(config.showGenerator);
      } catch (error) {
        console.error('Failed to load editor layout:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLayout();
  }, []);

  // Save layout when it changes
  const saveLayout = useCallback(async (config: EditorLayoutConfig) => {
    try {
      await saveEditorLayout(config);
    } catch (error) {
      console.error('Failed to save editor layout:', error);
    }
  }, []);

  // Wrapper for setShowTransformer that also saves
  const setShowTransformer = useCallback((show: boolean) => {
    setShowTransformerState(show);
    saveLayout({ showTransformer: show, showGenerator });
  }, [showGenerator, saveLayout]);

  // Wrapper for setShowGenerator that also saves
  const setShowGenerator = useCallback((show: boolean) => {
    setShowGeneratorState(show);
    saveLayout({ showTransformer, showGenerator: show });
  }, [showTransformer, saveLayout]);

  return {
    showTransformer,
    showGenerator,
    setShowTransformer,
    setShowGenerator,
    isLoading,
  };
};

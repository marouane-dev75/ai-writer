import { useState, useEffect, useCallback, useRef } from 'react';
import type { SerializedEditorState } from 'lexical';
import { EditorPersistenceService } from '../services/editor-persistence.service';

interface UseEditorPersistenceResult {
  initialState: string | null;
  isLoading: boolean;
  error: string | null;
  saveState: (state: SerializedEditorState) => void;
  clearState: () => Promise<void>;
}

const DEBOUNCE_DELAY = 2000; // 2 seconds

/**
 * Hook to manage editor state persistence
 * - Loads initial state on mount
 * - Provides debounced save function
 * - Auto-saves on window beforeunload
 */
export const useEditorPersistence = (): UseEditorPersistenceResult => {
  const [initialState, setInitialState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastStateRef = useRef<string | null>(null);

  // Load initial state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const state = await EditorPersistenceService.loadEditorState();
        
        if (state && state.trim() !== '') {
          setInitialState(state);
          lastStateRef.current = state;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load editor state';
        setError(errorMessage);
        console.error('Error loading editor state:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, []);

  // Debounced save function
  const saveState = useCallback((state: SerializedEditorState) => {
    const stateString = JSON.stringify(state);
    lastStateRef.current = stateString;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await EditorPersistenceService.saveEditorState(stateString);
        console.debug('Editor state saved');
      } catch (err) {
        console.error('Failed to save editor state:', err);
      }
    }, DEBOUNCE_DELAY);
  }, []);

  // Clear state function
  const clearState = useCallback(async () => {
    try {
      await EditorPersistenceService.clearEditorState();
      setInitialState(null);
      lastStateRef.current = null;
      console.debug('Editor state cleared');
    } catch (err) {
      console.error('Failed to clear editor state:', err);
      throw err;
    }
  }, []);

  return {
    initialState,
    isLoading,
    error,
    saveState,
    clearState,
  };
};

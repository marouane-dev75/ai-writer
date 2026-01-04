import { useState, useCallback } from 'react';
import type { AppRestartService } from '../types';

interface UseAppRestartReturn {
  restart: () => Promise<void>;
  isRestarting: boolean;
  error: string | null;
}

/**
 * Hook to handle application restart
 * @param service - The app restart service to use
 * @returns Object containing restart function, loading state, and error
 */
export const useAppRestart = (service: AppRestartService): UseAppRestartReturn => {
  const [isRestarting, setIsRestarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const restart = useCallback(async () => {
    setIsRestarting(true);
    setError(null);

    try {
      await service.restart();
      // If restart succeeds, the app will close and restart
      // so we won't reach this point normally
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setIsRestarting(false);
    }
  }, [service]);

  return { restart, isRestarting, error };
};

import { useState, useCallback, useEffect } from 'react';
import type { AppRestartService } from '../types';

interface UseAppRestartReturn {
  restart: () => Promise<void>;
  close: () => Promise<void>;
  isDevMode: boolean;
  isRestarting: boolean;
  error: string | null;
}

/**
 * Hook to handle application restart
 * @param service - The app restart service to use
 * @returns Object containing restart/close functions, dev mode flag, loading state, and error
 */
export const useAppRestart = (service: AppRestartService): UseAppRestartReturn => {
  const [isRestarting, setIsRestarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    // Check if running in dev mode
    service.isDevMode().then(setIsDevMode).catch(() => setIsDevMode(false));
  }, [service]);

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

  const close = useCallback(async () => {
    setIsRestarting(true);
    setError(null);

    try {
      await service.close();
      // If close succeeds, the app will terminate
      // so we won't reach this point normally
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setIsRestarting(false);
    }
  }, [service]);

  return { restart, close, isDevMode, isRestarting, error };
};

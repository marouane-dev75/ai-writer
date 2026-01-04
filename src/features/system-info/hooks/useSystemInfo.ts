import { useState, useEffect } from 'react';
import type { SystemInfo } from '../types';
import type { SystemInfoService } from '../services/system-info.service';

/**
 * Hook to fetch and manage system information
 * 
 * @param service - The system info service to use
 * @returns Object containing system info, loading state, and error
 */
export const useSystemInfo = (service: SystemInfoService) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const info = await service.getSystemInfo();
        setSystemInfo(info);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemInfo();
  }, [service]);

  return {
    systemInfo,
    isLoading,
    error,
  };
};

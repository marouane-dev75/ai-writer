/**
 * AI Status hook - handles model status polling
 */

import { useState, useEffect } from 'react';
import type { ModelStatus } from '../types';
import * as aiRuntimeService from '../services/ai-runtime.service';

export function useAiStatus() {
  const [status, setStatus] = useState<ModelStatus | null>(null);

  // Poll model status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const modelStatus = await aiRuntimeService.getModelStatus();
        setStatus(modelStatus);
      } catch (err) {
        console.error('Failed to fetch model status:', err);
      }
    };

    // Initial fetch
    fetchStatus();

    // Poll every 5 seconds
    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return { status };
}

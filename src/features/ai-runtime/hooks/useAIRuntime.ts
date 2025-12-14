/**
 * Unified AI Runtime hook - handles model status and streaming
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';
import type { StreamEvent } from '../types';
import * as aiRuntimeService from '../services/ai-runtime.service';

export interface UseAIRuntimeReturn {
  isStreaming: boolean;
  currentStream: string;
  error: string | null;
  startStream: (systemPrompt: string, userPrompt: string) => Promise<void>;
  cancelStream: () => Promise<void>;
  clearStream: () => void;
}

export function useAIRuntime(): UseAIRuntimeReturn {
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStream, setCurrentStream] = useState('');
  const [error, setError] = useState<string | null>(null);
  const currentRequestId = useRef<number | null>(null);
  const listenerSetupRef = useRef(false);

  // Listen to stream events
  useEffect(() => {
    let unlisten: UnlistenFn | null = null;

    const setupListener = async () => {
      // FIXME Prevent duplicate listener registration due to StrictMode
      if (listenerSetupRef.current) {
        return;
      }
      listenerSetupRef.current = true;

      unlisten = await listen<StreamEvent>('ai_stream_event', (event) => {
        const streamEvent = event.payload;

        // Only process events for the current request
        if (currentRequestId.current !== null && streamEvent.request_id !== currentRequestId.current) {
          return;
        }

        switch (streamEvent.type) {
          case 'Started':
            setIsStreaming(true);
            setCurrentStream('');
            setError(null);
            break;

          case 'Chunk':
            setCurrentStream((prev) => prev + streamEvent.content);
            break;

          case 'Completed':
            setIsStreaming(false);
            currentRequestId.current = null;
            break;

          case 'Error':
            setIsStreaming(false);
            setError(streamEvent.error.message || 'An error occurred');
            currentRequestId.current = null;
            break;

          case 'Cancelled':
            setIsStreaming(false);
            currentRequestId.current = null;
            break;
        }
      });
    };

    setupListener();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  const startStream = useCallback(async (systemPrompt: string, userPrompt: string) => {
    try {
      setError(null);
      const requestId = await aiRuntimeService.generateStream(systemPrompt, userPrompt);
      currentRequestId.current = requestId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start stream');
      setIsStreaming(false);
    }
  }, []);

  const cancelStream = useCallback(async () => {
    try {
      await aiRuntimeService.cancelStream();
      currentRequestId.current = null;
    } catch (err) {
      console.error('Failed to cancel stream:', err);
    }
  }, []);

  const clearStream = useCallback(() => {
    setCurrentStream('');
    setError(null);
  }, []);

  return {
    isStreaming,
    currentStream,
    error,
    startStream,
    cancelStream,
    clearStream,
  };
}

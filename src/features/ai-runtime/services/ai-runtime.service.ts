/**
 * AI Runtime service - Tauri command wrappers
 */

import { invoke } from '@tauri-apps/api/core';
import type { ModelStatus } from '../types';

/**
 * Get the current model status
 */
export async function getModelStatus(): Promise<ModelStatus> {
  return await invoke<ModelStatus>('get_model_status');
}

/**
 * Generate a streaming AI response
 * 
 * @param systemPrompt - System prompt for the model
 * @param userPrompt - User prompt for the model
 * @returns The request ID for tracking the stream
 */
export async function generateStream(
  systemPrompt: string,
  userPrompt: string
): Promise<number> {
  return await invoke<number>('generate_stream', {
    systemPrompt,
    userPrompt,
  });
}

/**
 * Cancel the current streaming operation
 */
export async function cancelStream(): Promise<void> {
  await invoke('cancel_stream');
}

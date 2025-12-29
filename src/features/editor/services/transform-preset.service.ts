import { invoke } from '@tauri-apps/api/core';
import type { TransformPreset, TransformPresetsConfig } from '../types';

/**
 * Load all transform presets from backend
 */
export async function loadPresets(): Promise<TransformPreset[]> {
  const config = await invoke<TransformPresetsConfig>('load_transform_presets_config');
  return config.presets;
}

/**
 * Save all transform presets to backend
 */
export async function savePresets(presets: TransformPreset[]): Promise<void> {
  const config: TransformPresetsConfig = { presets };
  await invoke('save_transform_presets_config', { transformPresetsConfig: config });
}

/**
 * Add a new transform preset
 */
export async function addPreset(preset: TransformPreset): Promise<void> {
  await invoke('add_transform_preset', { preset });
}

/**
 * Update an existing transform preset
 */
export async function updatePreset(preset: TransformPreset): Promise<void> {
  await invoke('update_transform_preset', { preset });
}

/**
 * Delete a transform preset by ID
 */
export async function deletePreset(id: string): Promise<void> {
  await invoke('delete_transform_preset', { id });
}

/**
 * Get the currently selected preset ID
 */
export async function getSelectedPreset(): Promise<string | null> {
  const result = await invoke<string | null>('get_selected_preset');
  return result;
}

/**
 * Set the currently selected preset ID
 */
export async function setSelectedPreset(presetId: string | null): Promise<void> {
  await invoke('set_selected_preset', { presetId });
}

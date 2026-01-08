export interface TransformPreset {
  id: string;
  title: string;
  description: string;
  createdAt: number;
}

export interface TransformPresetsConfig {
  presets: TransformPreset[];
  selectedPresetId?: string | null;
}

/**
 * AI Runtime interface - defines what the editor needs from an AI runtime
 * This follows DIP: editor depends on abstraction, not concrete implementation
 */
export interface AIRuntimeInstance {
  isLoading: boolean;
  isStreaming: boolean;
  currentStream: string;
  error: string | null;
  startStream: (systemPrompt: string, userPrompt: string) => Promise<void>;
  cancelStream: () => Promise<void>;
  clearStream: () => void;
}

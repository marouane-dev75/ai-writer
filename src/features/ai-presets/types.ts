export interface AIPreset {
  id: string;
  name: string;
  promptTemplate: string;
  linesBefore: number;
  linesAfter: number;
}

export interface AIPresetsConfig {
  presets: AIPreset[];
}

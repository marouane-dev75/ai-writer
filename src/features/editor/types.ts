export interface TransformPreset {
  id: string;
  title: string;
  description: string;
  createdAt: number;
}

export interface TransformPresetsConfig {
  presets: TransformPreset[];
}

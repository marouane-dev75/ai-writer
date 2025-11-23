import type EditorJS from '@editorjs/editorjs';

export interface EditorConfig {
  holder: string;
  placeholder?: string;
  minHeight?: number;
}

export interface EditorData {
  time?: number;
  blocks: EditorBlock[];
  version?: string;
}

export interface EditorBlock {
  id?: string;
  type: string;
  data: Record<string, any>;
}

export interface UseEditorReturn {
  editorInstance: EditorJS | null;
  isReady: boolean;
  save: () => Promise<EditorData | undefined>;
  clear: () => Promise<void>;
}

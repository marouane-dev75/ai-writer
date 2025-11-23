import { useEffect, useRef, useState } from 'react';
import EditorJS, { type ToolConstructable } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import type { EditorConfig, EditorData, UseEditorReturn } from '../types';

export const useEditor = (config: EditorConfig): UseEditorReturn => {
  const editorRef = useRef<EditorJS | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: config.holder,
        placeholder: config.placeholder || 'Start writing your content...',
        minHeight: config.minHeight || 300,
        data: {
          blocks: [
            {
              type: 'header',
              data: { text: 'Welcome', level: 2 },
            },
            {
              type: 'paragraph',
              data: { text: 'This is the first paragraph of default content.' },
            },
            {
              type: 'paragraph',
              data: { text: 'This is the second paragraph of default content.' },
            },
          ],
        },
        tools: {
          header: {
            class: Header as unknown as ToolConstructable,
            config: {
              placeholder: 'Enter a header',
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 2,
            },
          },
          list: {
            class: List as unknown as ToolConstructable,
            inlineToolbar: true,
          },
        },
        onReady: () => {
          setIsReady(true);
        },
      });

      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
        setIsReady(false);
      }
    };
  }, [config.holder, config.placeholder, config.minHeight]);

  const save = async (): Promise<EditorData | undefined> => {
    if (editorRef.current) {
      try {
        const outputData = await editorRef.current.save();
        return outputData as EditorData;
      } catch (error) {
        console.error('Error saving editor data:', error);
        return undefined;
      }
    }
    return undefined;
  };

  const clear = async (): Promise<void> => {
    if (editorRef.current) {
      try {
        await editorRef.current.clear();
      } catch (error) {
        console.error('Error clearing editor:', error);
      }
    }
  };

  return {
    editorInstance: editorRef.current,
    isReady,
    save,
    clear,
  };
};

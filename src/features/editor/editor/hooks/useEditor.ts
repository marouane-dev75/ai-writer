import { useState, useCallback } from 'react';

interface UseEditorReturn {
  content: string;
  setContent: (content: string) => void;
  clearContent: () => void;
}

export const useEditor = (): UseEditorReturn => {
  const [content, setContentState] = useState<string>('');

  const setContent = useCallback((newContent: string) => {
    setContentState(newContent);
  }, []);

  const clearContent = useCallback(() => {
    setContentState('');
  }, []);

  return {
    content,
    setContent,
    clearContent,
  };
};

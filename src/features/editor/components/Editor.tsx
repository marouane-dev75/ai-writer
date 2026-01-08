import { useState, useMemo } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode } from '@lexical/code';
import { $getRoot } from 'lexical';
import type { EditorState } from 'lexical';
import { useTranslation } from '@/shared/i18n';
import { LoadingSpinner } from '@/shared/ui';
import type { AIRuntimeInstance } from '../types';
import { useEditorPersistence } from '../hooks/useEditorPersistence';
import { Toolbar } from './toolbar/Toolbar';
import { AiTransformer } from './ai-transformer';
import { AiGenerator } from './ai-generator';

interface EditorProps {
  onChange?: (content: string) => void;
  transformerRuntime: AIRuntimeInstance;
  generatorRuntime: AIRuntimeInstance;
}

export const Editor: React.FC<EditorProps> = ({ onChange, transformerRuntime, generatorRuntime }) => {
  const { t } = useTranslation();
  const [showTransformer, setShowTransformer] = useState(true);
  const [showGenerator, setShowGenerator] = useState(true);
  
  // Use persistence hook
  const { initialState, isLoading, error, saveState } = useEditorPersistence();

  const toggleTransformer = () => setShowTransformer((prev) => !prev);
  const toggleGenerator = () => setShowGenerator((prev) => !prev);

  // Memoize initial config with persisted state
  const initialConfig = useMemo(() => ({
    namespace: 'MinimalEditor',
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode],
    editorState: initialState || undefined,
    theme: {
      paragraph: 'mb-2',
      heading: {
        h1: 'text-3xl font-bold mb-4',
        h2: 'text-2xl font-bold mb-3',
        h3: 'text-xl font-bold mb-2',
      },
      quote: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-2',
      list: {
        nested: {
          listitem: 'list-none',
        },
        ol: 'list-decimal ml-4 my-2',
        ul: 'list-disc ml-4 my-2',
        listitem: 'ml-4',
        listitemChecked: 'line-through',
        listitemUnchecked: 'list-none',
      },
      code: 'bg-gray-100 dark:bg-gray-800 p-4 rounded font-mono text-sm my-2 block',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
      },
    },
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
  }), [initialState]);

  const handleEditorChange = (editorState: EditorState) => {
    // Save state for persistence
    saveState(editorState.toJSON());
    
    // Call onChange callback if provided
    editorState.read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      onChange?.(textContent);
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="mb-12 flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-full">
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
          {t('editor.loadError')}: {error}
        </div>
      )}
      <LexicalComposer initialConfig={initialConfig}>
        <div className="flex gap-4 h-full">
          {/* Text Editor - Left Side */}
          <div className="flex-1 flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <Toolbar 
              onToggleTransformer={toggleTransformer}
              onToggleGenerator={toggleGenerator}
            />
            <div className="relative flex-1 overflow-y-auto">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="min-h-full p-4 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                }
                placeholder={
                  <div className="absolute top-4 left-4 text-gray-400 dark:text-gray-500 pointer-events-none">
                    {t('editor.placeholder')}
                  </div>
                }
                ErrorBoundary={() => <div className="p-4 text-red-600">{t('editor.error')}</div>}
              />
            </div>
            <HistoryPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <OnChangePlugin onChange={handleEditorChange} />
            <ClearEditorPlugin />
          </div>

          {/* AI Panels - Right Side */}
          <div className="w-96 h-full flex flex-col gap-4">
            {showTransformer && (
              <div className="flex-1 min-h-0 overflow-y-auto">
                <AiTransformer
                  onTransformStream={transformerRuntime.startStream}
                  onCancelStream={transformerRuntime.cancelStream}
                  isLoading={transformerRuntime.isLoading}
                  isStreaming={transformerRuntime.isStreaming}
                  currentStream={transformerRuntime.currentStream}
                  error={transformerRuntime.error}
                  onClearStream={transformerRuntime.clearStream}
                  onClose={() => setShowTransformer(false)}
                />
              </div>
            )}
            {showGenerator && (
              <div className="flex-1 min-h-0 overflow-y-auto">
                <AiGenerator
                  onGenerateStream={generatorRuntime.startStream}
                  onCancelStream={generatorRuntime.cancelStream}
                  isLoading={generatorRuntime.isLoading}
                  isStreaming={generatorRuntime.isStreaming}
                  currentStream={generatorRuntime.currentStream}
                  error={generatorRuntime.error}
                  onClearStream={generatorRuntime.clearStream}
                  onClose={() => setShowGenerator(false)}
                />
              </div>
            )}
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
};

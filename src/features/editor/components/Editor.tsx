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
import { useAIRuntime } from '@/features/ai-runtime';
import { Toolbar } from './toolbar/Toolbar';
import { AiTransformer } from './ai-transformer';
import { AiGenerator } from './ai-generator';

interface EditorProps {
  onChange?: (content: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ onChange }) => {
  const { t } = useTranslation();
  const { isStreaming, currentStream, error, startStream, clearStream } = useAIRuntime();

  const initialConfig = {
    namespace: 'MinimalEditor',
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode],
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
  };

  const handleEditorChange = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      onChange?.(textContent);
    });
  };

  const handleClear = () => {
    onChange?.('');
  };

  return (
    <div className="mb-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {t('editor.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('editor.description')}
        </p>
      </div>

      <LexicalComposer initialConfig={initialConfig}>
        <div className="flex gap-6 mb-6">
          <div className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <Toolbar onClear={handleClear} />
            <div className="relative">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="min-h-96 p-4 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                }
                placeholder={
                  <div className="absolute top-4 left-4 text-gray-400 dark:text-gray-500 pointer-events-none">
                    {t('editor.placeholder')}
                  </div>
                }
                ErrorBoundary={() => <div className="p-4 text-red-600">An error occurred</div>}
              />
            </div>
            <HistoryPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <OnChangePlugin onChange={handleEditorChange} />
            <ClearEditorPlugin />
          </div>

          <div className="w-80">
            <AiTransformer
              onTransformStream={startStream}
              isStreaming={isStreaming}
              currentStream={currentStream}
              error={error}
              onClearStream={clearStream}
            />
          </div>
        </div>

        {/* AI Generator Component - Full Width Below Editor */}
        <div className="w-full">
          <AiGenerator
            onGenerateStream={startStream}
            isStreaming={isStreaming}
            currentStream={currentStream}
            error={error}
            onClearStream={clearStream}
          />
        </div>
      </LexicalComposer>
    </div>
  );
};

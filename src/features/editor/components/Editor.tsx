import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, FORMAT_TEXT_COMMAND, CLEAR_EDITOR_COMMAND } from 'lexical';
import type { EditorState } from 'lexical';
import { useTranslation } from '@/shared/i18n';
import { Button } from '@/shared/ui';

interface ToolbarPluginProps {
  onClear: () => void;
}

function ToolbarPlugin({ onClear }: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const formatUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };

  const handleClear = () => {
    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    onClear();
  };

  return (
    <div className="flex gap-2 p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
      <button
        onClick={formatBold}
        className="px-3 py-1 text-sm font-bold rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
        title={t('editor.toolbar.bold')}
      >
        B
      </button>
      <button
        onClick={formatItalic}
        className="px-3 py-1 text-sm italic rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
        title={t('editor.toolbar.italic')}
      >
        I
      </button>
      <button
        onClick={formatUnderline}
        className="px-3 py-1 text-sm underline rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
        title={t('editor.toolbar.underline')}
      >
        U
      </button>
      <div className="flex-1" />
      <Button
        variant="secondary"
        onClick={handleClear}
        className="text-xs"
      >
        {t('editor.toolbar.clear')}
      </Button>
    </div>
  );
}

interface EditorProps {
  onChange?: (content: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ onChange }) => {
  const { t } = useTranslation();

  const initialConfig = {
    namespace: 'MinimalEditor',
    theme: {
      paragraph: 'mb-2',
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8 mb-12">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        {t('editor.title')}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {t('editor.description')}
      </p>

      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin onClear={handleClear} />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="min-h-[200px] p-4 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
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
          <OnChangePlugin onChange={handleEditorChange} />
          <ClearEditorPlugin />
        </LexicalComposer>
      </div>
    </div>
  );
};

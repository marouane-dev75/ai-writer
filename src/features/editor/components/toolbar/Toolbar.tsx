import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { useTranslation } from '@/shared/i18n';
import { BlockTypeDropdown } from './BlockTypeDropdown';

export const Toolbar: React.FC = () => {
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

  return (
    <div className="flex items-center gap-2 p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
      <BlockTypeDropdown />
      <div className="w-px bg-gray-300 dark:bg-gray-600" />
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
    </div>
  );
};

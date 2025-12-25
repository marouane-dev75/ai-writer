import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, CLEAR_EDITOR_COMMAND } from 'lexical';
import { useTranslation } from '@/shared/i18n';
import { Button } from '@/shared/ui';
import { BlockTypeDropdown } from './BlockTypeDropdown';

interface ToolbarProps {
  onClear: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onClear }) => {
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
};

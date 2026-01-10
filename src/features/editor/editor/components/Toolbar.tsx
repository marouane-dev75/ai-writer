import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, $getRoot } from 'lexical';
import { $convertToMarkdownString, $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { useTranslation } from '@/shared/i18n';
import { BlockTypeDropdown } from './BlockTypeDropdown';
import { FiDownload, FiUpload, FiRefreshCw, FiZap } from 'react-icons/fi';
import { invoke } from '@tauri-apps/api/core';

interface ToolbarProps {
  onToggleTransformer: () => void;
  onToggleGenerator: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onToggleTransformer,
  onToggleGenerator,
}) => {
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

  const handleExport = async () => {
    try {
      await editor.update(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        
        // Call Tauri command to save file
        invoke('save_markdown_file', { content: markdown })
          .catch((error) => {
            console.error('Failed to save markdown file:', error);
          });
      });
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  const handleImport = async () => {
    try {
      // Call Tauri command to open file
      const markdown = await invoke<string>('open_markdown_file');
      
      if (markdown) {
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          $convertFromMarkdownString(markdown, TRANSFORMERS);
        });
      }
    } catch (error) {
      console.error('Failed to import:', error);
    }
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
      <button
        onClick={handleImport}
        className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
        title={t('editor.toolbar.import')}
      >
        <FiUpload />
        <span>{t('editor.toolbar.import')}</span>
      </button>
      <button
        onClick={handleExport}
        className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
        title={t('editor.toolbar.export')}
      >
        <FiDownload />
        <span>{t('editor.toolbar.export')}</span>
      </button>
      <div className="w-px bg-gray-300 dark:bg-gray-600" />
      <button
        onClick={onToggleTransformer}
        className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-300"
        title={t('editor.toolbar.toggleTransformer')}
      >
        <FiRefreshCw />
        <span>{t('editor.toolbar.toggleTransformer')}</span>
      </button>
      <button
        onClick={onToggleGenerator}
        className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-300"
        title={t('editor.toolbar.toggleGenerator')}
      >
        <FiZap />
        <span>{t('editor.toolbar.toggleGenerator')}</span>
      </button>
    </div>
  );
};

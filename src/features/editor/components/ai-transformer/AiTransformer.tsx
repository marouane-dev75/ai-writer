import React, { useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { useTranslation } from '@/shared/i18n';
import { useSelectionState } from '../../hooks/useSelectionState';
import { uppercaseTransform } from '../../services/ai-transformer.service';
import { TransformButton } from './TransformButton';

export const AiTransformer: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const { hasSelection, isSingleNode, selectedText } = useSelectionState();

  const handleUppercase = useCallback(() => {
    if (!hasSelection || !isSingleNode) {
      return;
    }

    editor.update(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        return;
      }

      const transformedText = uppercaseTransform(selectedText);
      selection.insertText(transformedText);
    });
  }, [editor, hasSelection, isSingleNode, selectedText]);

  const isButtonEnabled = hasSelection && isSingleNode;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-6 h-full">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        {t('editor.aiTransformer.title')}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {t('editor.aiTransformer.description')}
      </p>

      <div className="space-y-3">
        <TransformButton
          onClick={handleUppercase}
          disabled={!isButtonEnabled}
          label={t('editor.aiTransformer.uppercase')}
        />

        {!hasSelection && (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            {t('editor.aiTransformer.selectText')}
          </p>
        )}

        {hasSelection && !isSingleNode && (
          <p className="text-xs text-amber-600 dark:text-amber-400 italic">
            {t('editor.aiTransformer.singleNodeOnly')}
          </p>
        )}
      </div>
    </div>
  );
};

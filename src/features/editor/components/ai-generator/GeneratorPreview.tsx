import React from 'react';
import { Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';

interface GeneratorPreviewProps {
  generatedText: string;
  onAccept: () => void;
  onReject: () => void;
}

export const GeneratorPreview: React.FC<GeneratorPreviewProps> = ({
  generatedText,
  onAccept,
  onReject,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {t('editor.aiGenerator.preview.title')}
      </h4>

      <div className="space-y-3">
        {/* Generated Content */}
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
            {t('editor.aiGenerator.preview.content')}
          </label>
          <div className="p-3 bg-white dark:bg-gray-800 rounded border border-green-300 dark:border-green-600 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap max-h-64 overflow-y-auto">
            {generatedText}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onAccept}
            variant="primary"
            className="flex-1 text-sm"
          >
            {t('editor.aiGenerator.preview.accept')}
          </Button>
          <Button
            onClick={onReject}
            variant="secondary"
            className="flex-1 text-sm"
          >
            {t('editor.aiGenerator.preview.reject')}
          </Button>
        </div>
      </div>
    </div>
  );
};

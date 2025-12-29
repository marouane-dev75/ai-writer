import React from 'react';
import { Button, LoadingSpinner } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';

interface GeneratorPreviewProps {
  generatedText: string;
  isStreaming: boolean;
  error: string | null;
  onAccept: () => void;
  onReject: () => void;
  onCancel: () => Promise<void>;
}

export const GeneratorPreview: React.FC<GeneratorPreviewProps> = ({
  generatedText,
  isStreaming,
  error,
  onAccept,
  onReject,
  onCancel,
}) => {
  const { t } = useTranslation();

  // Determine border color based on state
  const borderColor = error 
    ? 'border-red-300 dark:border-red-600' 
    : 'border-green-300 dark:border-green-600';

  // Show error message or generated text
  const displayContent = error || generatedText;

  // Disable accept button if there's an error or no content
  const canAccept = !error && !isStreaming && generatedText.trim().length > 0;

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {t('editor.aiGenerator.preview.title')}
        {isStreaming && (
          <span className="ml-2 text-blue-600 dark:text-blue-400 text-xs font-normal">
            {t('showcase.aiStreaming.streaming')}
          </span>
        )}
      </h4>

      <div className="space-y-3">
        {/* Generated Content or Error */}
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
            {error ? t('common.error') : t('editor.aiGenerator.preview.content')}
          </label>
          <div className={`relative p-3 bg-white dark:bg-gray-800 rounded border ${borderColor} text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'} whitespace-pre-wrap max-h-64 overflow-y-auto`}>
            {displayContent || (
              <span className="text-gray-500 dark:text-gray-400 italic">
                {t('showcase.aiStreaming.noOutput')}
              </span>
            )}
            {isStreaming && (
              <div className="absolute bottom-2 right-2">
                <LoadingSpinner size="small" className="min-h-0" />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {isStreaming ? (
            <Button
              onClick={onCancel}
              variant="secondary"
              className="w-full text-sm"
            >
              {t('common.cancel')}
            </Button>
          ) : (
            <>
              <Button
                onClick={onAccept}
                disabled={!canAccept}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

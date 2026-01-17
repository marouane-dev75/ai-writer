import React from 'react';
import { Button, LoadingSpinner } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { MarkdownPreview } from './MarkdownPreview';

interface TransformPreviewProps {
  originalText: string;
  transformedText: string;
  isStreaming: boolean;
  error: string | null;
  onAccept: () => void;
  onReject: () => void;
  onCancel: () => Promise<void>;
}

export const TransformPreview: React.FC<TransformPreviewProps> = ({
  originalText,
  transformedText,
  isStreaming,
  error,
  onAccept,
  onReject,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {t('editor.aiTransformer.preview.title')}
      </h4>

      <div className="space-y-3">
        {/* Transformed Text */}
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
            {t('editor.aiTransformer.preview.transformed')}
          </label>
          <div className="p-2 bg-white dark:bg-gray-800 rounded border border-green-300 dark:border-green-600 text-sm min-h-20 max-h-32 overflow-y-auto relative">
            {error ? (
              <div className="text-red-600 dark:text-red-400">
                {error}
              </div>
            ) : isStreaming ? (
              <>
                {transformedText ? (
                  <>
                    <MarkdownPreview content={transformedText} />
                    <div className="absolute bottom-2 right-2">
                      <LoadingSpinner size="small" />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <LoadingSpinner size="small" />
                    <span>{t('editor.aiTransformer.preview.streaming')}</span>
                  </div>
                )}
              </>
            ) : transformedText ? (
              <MarkdownPreview content={transformedText} />
            ) : (
              <span className="text-gray-400 dark:text-gray-500 italic">
                {t('editor.aiTransformer.preview.noContent')}
              </span>
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
                variant="primary"
                className="flex-1 text-sm"
                disabled={!!error || !transformedText}
              >
                {t('editor.aiTransformer.preview.accept')}
              </Button>
              <Button
                onClick={onReject}
                variant="secondary"
                className="flex-1 text-sm"
              >
                {t('editor.aiTransformer.preview.reject')}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

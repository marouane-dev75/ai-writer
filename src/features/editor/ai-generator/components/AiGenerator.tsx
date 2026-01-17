import React, { useCallback, useState, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, $getRoot } from 'lexical';
import { MdClose } from 'react-icons/md';
import { useTranslation } from '@/shared/i18n';
import { Button, Switch } from '@/shared/ui';
import { useAiGeneratorConfig } from '../hooks/useAiGeneratorConfig';
import { deserializeFromMarkdown } from '../../shared';
import { GeneratorPreview } from './GeneratorPreview';

interface AiGeneratorProps {
  onGenerateStream: (systemPrompt: string, userPrompt: string) => Promise<void>;
  onCancelStream: () => Promise<void>;
  isLoading: boolean;
  isStreaming: boolean;
  currentStream: string;
  error: string | null;
  onClearStream: () => void;
  onClose?: () => void;
}

export const AiGenerator: React.FC<AiGeneratorProps> = ({
  onGenerateStream,
  onCancelStream,
  isLoading,
  isStreaming,
  currentStream,
  error,
  onClearStream,
  onClose,
}) => {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const [promptText, setPromptText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  // Use persisted config hook for system prompt settings
  const {
    useSystemPrompt,
    systemPromptText,
    systemPromptHeight,
    userPromptHeight,
    setUseSystemPrompt,
    setSystemPromptText,
    setSystemPromptHeight,
    setUserPromptHeight,
  } = useAiGeneratorConfig();

  // Show preview when loading, streaming starts or completes
  useEffect(() => {
    if (isLoading || isStreaming || currentStream || error) {
      setShowPreview(true);
    }
  }, [isLoading, isStreaming, currentStream, error]);

  const handleGenerate = useCallback(async () => {
    if (!promptText.trim()) {
      return;
    }

    // Clear any previous stream
    onClearStream();
    
    // Use system prompt only if enabled
    const systemPrompt = useSystemPrompt ? systemPromptText : '';
    await onGenerateStream(systemPrompt, promptText);
  }, [promptText, systemPromptText, useSystemPrompt, onGenerateStream, onClearStream]);

  const handleAccept = useCallback(() => {
    if (!currentStream) {
      return;
    }

    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        // Parse markdown response and insert as formatted nodes
        const nodes = deserializeFromMarkdown(currentStream);
        selection.insertNodes(nodes);
      } else {
        // No selection, append to the end of the document
        const root = $getRoot();
        const nodes = deserializeFromMarkdown(currentStream);
        nodes.forEach(node => root.append(node));
      }
    });

    // Clear state
    onClearStream();
    setShowPreview(false);
    setPromptText('');
  }, [editor, currentStream, onClearStream]);

  const handleReject = useCallback(() => {
    onClearStream();
    setShowPreview(false);
  }, [onClearStream]);

  const isSendEnabled = promptText.trim().length > 0 && !isLoading && !isStreaming && !showPreview;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 h-full flex flex-col">
      {/* Fixed Header */}
      <div className="shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            {t('editor.aiGenerator.title')}
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <MdClose className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {t('editor.aiGenerator.description')}
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
        {/* System Prompt Toggle */}
        <Switch
          label={t('editor.aiGenerator.useSystemPrompt')}
          checked={useSystemPrompt}
          onChange={(e) => setUseSystemPrompt(e.target.checked)}
          disabled={isLoading || isStreaming || showPreview}
        />

        {/* System Prompt Textarea (conditional) */}
        {useSystemPrompt && (
          <div className="px-0.5">
            <textarea
              value={systemPromptText}
              onChange={(e) => setSystemPromptText(e.target.value)}
              placeholder={t('editor.aiGenerator.systemPromptPlaceholder')}
              disabled={isLoading || isStreaming || showPreview}
              style={{ height: `${systemPromptHeight}px` }}
              onMouseUp={(e) => {
                const newHeight = e.currentTarget.offsetHeight;
                if (newHeight !== systemPromptHeight) {
                  setSystemPromptHeight(newHeight);
                }
              }}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        )}

        {/* User Prompt Textarea */}
        <div className="px-0.5">
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={t('editor.aiGenerator.placeholder')}
            disabled={isLoading || isStreaming || showPreview}
            style={{ height: `${userPromptHeight}px` }}
            onMouseUp={(e) => {
              const newHeight = e.currentTarget.offsetHeight;
              if (newHeight !== userPromptHeight) {
                setUserPromptHeight(newHeight);
              }
            }}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleGenerate}
          disabled={!isSendEnabled}
          variant="primary"
          className="w-full text-sm"
        >
          {isLoading ? t('editor.aiGenerator.loading') : t('editor.aiGenerator.send')}
        </Button>

          {/* Preview Component */}
          {showPreview && (
            <GeneratorPreview
              generatedText={currentStream}
              isStreaming={isLoading || isStreaming}
              error={error}
              onAccept={handleAccept}
              onReject={handleReject}
              onCancel={onCancelStream}
            />
          )}
        </div>
      </div>
    </div>
  );
};

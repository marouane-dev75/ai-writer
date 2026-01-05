import React, { useCallback, useState, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import { MdClose } from 'react-icons/md';
import { useTranslation } from '@/shared/i18n';
import { Button, Switch } from '@/shared/ui';
import { GeneratorPreview } from './GeneratorPreview';

interface AiGeneratorProps {
  onGenerateStream: (systemPrompt: string, userPrompt: string) => Promise<void>;
  onCancelStream: () => Promise<void>;
  isStreaming: boolean;
  currentStream: string;
  error: string | null;
  onClearStream: () => void;
  onClose?: () => void;
}

export const AiGenerator: React.FC<AiGeneratorProps> = ({
  onGenerateStream,
  onCancelStream,
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
  const [useSystemPrompt, setUseSystemPrompt] = useState(false);
  const [systemPromptText, setSystemPromptText] = useState('');

  // Show preview when streaming starts or completes
  useEffect(() => {
    if (isStreaming || currentStream || error) {
      setShowPreview(true);
    }
  }, [isStreaming, currentStream, error]);

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

      // Create a new paragraph node with the generated text
      const paragraphNode = $createParagraphNode();
      const textNode = $createTextNode(currentStream);
      paragraphNode.append(textNode);

      if ($isRangeSelection(selection)) {
        // Get the selected node and insert after it
        const nodes = selection.getNodes();
        if (nodes.length > 0) {
          const lastNode = nodes[nodes.length - 1];
          const parentNode = lastNode.getParent();
          
          if (parentNode) {
            // Find the top-level block node
            let topLevelNode = lastNode;
            while (topLevelNode.getParent() && topLevelNode.getParent()?.getType() !== 'root') {
              topLevelNode = topLevelNode.getParent()!;
            }
            
            // Insert after the top-level node
            topLevelNode.insertAfter(paragraphNode);
          } else {
            // Fallback: insert at the end
            selection.insertNodes([paragraphNode]);
          }
        } else {
          // No nodes selected, insert at current position
          selection.insertNodes([paragraphNode]);
        }
      } else {
        // No selection, append to the end of the document
        const root = $getRoot();
        root.append(paragraphNode);
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

  const isSendEnabled = promptText.trim().length > 0 && !isStreaming && !showPreview;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-6">
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

      <div className="space-y-3">
        {/* System Prompt Toggle */}
        <Switch
          label={t('editor.aiGenerator.useSystemPrompt')}
          checked={useSystemPrompt}
          onChange={(e) => setUseSystemPrompt(e.target.checked)}
          disabled={isStreaming || showPreview}
        />

        {/* System Prompt Textarea (conditional) */}
        {useSystemPrompt && (
          <div>
            <textarea
              value={systemPromptText}
              onChange={(e) => setSystemPromptText(e.target.value)}
              placeholder={t('editor.aiGenerator.systemPromptPlaceholder')}
              disabled={isStreaming || showPreview}
              className="w-full min-h-[120px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
              rows={4}
            />
          </div>
        )}

        {/* User Prompt Textarea */}
        <div>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={t('editor.aiGenerator.placeholder')}
            disabled={isStreaming || showPreview}
            className="w-full min-h-[120px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
            rows={4}
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleGenerate}
          disabled={!isSendEnabled}
          variant="primary"
          className="w-full text-sm"
        >
          {t('editor.aiGenerator.send')}
        </Button>

        {/* Preview Component */}
        {showPreview && (
          <GeneratorPreview
            generatedText={currentStream}
            isStreaming={isStreaming}
            error={error}
            onAccept={handleAccept}
            onReject={handleReject}
            onCancel={onCancelStream}
          />
        )}
      </div>
    </div>
  );
};

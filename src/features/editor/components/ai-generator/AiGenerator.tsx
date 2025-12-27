import React, { useCallback, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import { useTranslation } from '@/shared/i18n';
import { Button } from '@/shared/ui';
import { GeneratorPreview } from './GeneratorPreview';

interface PreviewState {
  generatedText: string;
}

const mockGenerate = (prompt: string): string => {
  return `Generated content based on: "${prompt}"\n\nThis is a placeholder for AI-generated text. In a real implementation, this would be replaced with actual AI-generated content.`;
};

export const AiGenerator: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const [promptText, setPromptText] = useState('');
  const [previewState, setPreviewState] = useState<PreviewState | null>(null);

  const handleGenerate = useCallback(() => {
    if (!promptText.trim()) {
      return;
    }

    const generatedText = mockGenerate(promptText);
    setPreviewState({ generatedText });
  }, [promptText]);

  const handleAccept = useCallback(() => {
    if (!previewState) {
      return;
    }

    editor.update(() => {
      const selection = $getSelection();

      // Create a new paragraph node with the generated text
      const paragraphNode = $createParagraphNode();
      const textNode = $createTextNode(previewState.generatedText);
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
    setPreviewState(null);
    setPromptText('');
  }, [editor, previewState]);

  const handleReject = useCallback(() => {
    setPreviewState(null);
  }, []);

  const isSendEnabled = promptText.trim().length > 0 && !previewState;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        {t('editor.aiGenerator.title')}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {t('editor.aiGenerator.description')}
      </p>

      <div className="space-y-3">
        {/* Large Textarea Input */}
        <div>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={t('editor.aiGenerator.placeholder')}
            disabled={!!previewState}
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
        {previewState && (
          <GeneratorPreview
            generatedText={previewState.generatedText}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}
      </div>
    </div>
  );
};

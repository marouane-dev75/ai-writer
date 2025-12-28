import React, { useCallback, useState, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { useTranslation } from '@/shared/i18n';
import { Button, Select } from '@/shared/ui';
import { useSelectionState } from '../../hooks/useSelectionState';
import { useTransformPresets } from '../../hooks/useTransformPresets';
import { TransformPreview } from './TransformPreview';
import { PresetManagerDialog } from './PresetManagerDialog';

interface AiTransformerProps {
  onTransformStream: (systemPrompt: string, userPrompt: string) => Promise<void>;
  isStreaming: boolean;
  currentStream: string;
  error: string | null;
  onClearStream: () => void;
}

export const AiTransformer: React.FC<AiTransformerProps> = ({
  onTransformStream,
  isStreaming,
  currentStream,
  error,
  onClearStream,
}) => {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const { hasSelection, isSingleNode, selectedText } = useSelectionState();
  const { presets, isLoading: presetsLoading, addPreset, updatePreset, deletePreset } = useTransformPresets();
  
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Show preview when streaming starts or completes
  useEffect(() => {
    if (isStreaming || currentStream || error) {
      setShowPreview(true);
    }
  }, [isStreaming, currentStream, error]);

  const handleTransform = useCallback(async () => {
    if (!hasSelection || !isSingleNode || !selectedPresetId) {
      return;
    }

    const selectedPreset = presets.find((p) => p.id === selectedPresetId);
    if (!selectedPreset) {
      return;
    }

    // Clear any previous stream
    onClearStream();

    // Use preset description as system prompt, selected text as user input
    await onTransformStream(selectedPreset.description, selectedText);
  }, [hasSelection, isSingleNode, selectedPresetId, selectedText, presets, onTransformStream, onClearStream]);

  const handleAccept = useCallback(() => {
    if (!currentStream) {
      return;
    }

    editor.update(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        return;
      }

      selection.insertText(currentStream);
    });

    // Clear state
    onClearStream();
    setShowPreview(false);
  }, [editor, currentStream, onClearStream]);

  const handleReject = useCallback(() => {
    onClearStream();
    setShowPreview(false);
  }, [onClearStream]);

  const isTransformEnabled = hasSelection && isSingleNode && selectedPresetId && !isStreaming && !showPreview;

  // Prepare preset options for Select component
  const presetOptions = presets.map((preset) => ({
    value: preset.id,
    label: preset.title,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-6 h-full">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        {t('editor.aiTransformer.title')}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {t('editor.aiTransformer.description')}
      </p>

      <div className="space-y-3">
        {/* Manage Presets Button */}
        <Button
          onClick={() => setIsDialogOpen(true)}
          variant="secondary"
          className="w-full text-sm"
          disabled={isStreaming || showPreview}
        >
          {t('editor.aiTransformer.managePresetsButton')}
        </Button>

        {/* Preset Selector */}
        {presets.length > 0 && (
          <>
            <Select
              label={t('editor.aiTransformer.presetLabel')}
              options={presetOptions}
              value={selectedPresetId || null}
              onChange={(value) => setSelectedPresetId(value || '')}
              disabled={isStreaming || showPreview}
              placeholder={t('editor.aiTransformer.selectPreset')}
            />

            {/* Transform Button */}
            <Button
              onClick={handleTransform}
              disabled={!isTransformEnabled}
              variant="primary"
              className="w-full text-sm"
            >
              {t('editor.aiTransformer.transform')}
            </Button>
          </>
        )}

        {/* Empty State */}
        {presets.length === 0 && !presetsLoading && (
          <p className="text-sm text-amber-600 dark:text-amber-400 italic">
            {t('editor.aiTransformer.noPresets')}
          </p>
        )}

        {/* Selection Hints */}
        {!showPreview && presets.length > 0 && (
          <>
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
          </>
        )}

        {/* Preview Component */}
        {showPreview && (
          <TransformPreview
            originalText={selectedText}
            transformedText={currentStream}
            isStreaming={isStreaming}
            error={error}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}
      </div>

      {/* Preset Manager Dialog */}
      <PresetManagerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        presets={presets}
        onAdd={addPreset}
        onUpdate={updatePreset}
        onDelete={deletePreset}
        isLoading={presetsLoading}
      />
    </div>
  );
};

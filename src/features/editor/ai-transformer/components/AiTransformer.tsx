import React, { useCallback, useState, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { MdClose } from 'react-icons/md';
import { useTranslation } from '@/shared/i18n';
import { Button, Select } from '@/shared/ui';
import { useSelectionState } from '../../editor/hooks/useSelectionState';
import { useTransformPresets } from '../hooks/useTransformPresets';
import { deserializeFromMarkdown } from '../../shared';
import { TransformPreview } from './TransformPreview';
import { PresetManagerDialog } from './PresetManagerDialog';

interface AiTransformerProps {
  onTransformStream: (systemPrompt: string, userPrompt: string) => Promise<void>;
  onCancelStream: () => Promise<void>;
  isLoading: boolean;
  isStreaming: boolean;
  currentStream: string;
  error: string | null;
  onClearStream: () => void;
  onClose?: () => void;
}

export const AiTransformer: React.FC<AiTransformerProps> = ({
  onTransformStream,
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
  const { hasSelection, selectedText, selectedMarkdown } = useSelectionState();
  const { 
    presets, 
    isLoading: presetsLoading, 
    selectedPresetId, 
    addPreset, 
    updatePreset, 
    deletePreset,
    setSelectedPreset 
  } = useTransformPresets();
  
  const [showPreview, setShowPreview] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Show preview when loading, streaming starts or completes
  useEffect(() => {
    if (isLoading || isStreaming || currentStream || error) {
      setShowPreview(true);
    }
  }, [isLoading, isStreaming, currentStream, error]);

  const handleTransform = useCallback(async () => {
    if (!hasSelection || !selectedPresetId) {
      return;
    }

    const selectedPreset = presets.find((p) => p.id === selectedPresetId);
    if (!selectedPreset) {
      return;
    }

    // Clear any previous stream
    onClearStream();

    // Use preset description as system prompt, selected markdown as user input
    await onTransformStream(selectedPreset.description, selectedMarkdown);
  }, [hasSelection, selectedPresetId, selectedMarkdown, presets, onTransformStream, onClearStream]);

  const handlePresetChange = useCallback(async (value: string | null) => {
    try {
      await setSelectedPreset(value);
    } catch (err) {
      console.error('Failed to set selected preset:', err);
    }
  }, [setSelectedPreset]);

  const handleAccept = useCallback(() => {
    if (!currentStream) {
      return;
    }

    editor.update(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        return;
      }

      // Remove the current selection
      selection.removeText();

      // Parse markdown response and insert as formatted nodes
      const nodes = deserializeFromMarkdown(currentStream);
      for (const node of nodes) {
        selection.insertNodes([node]);
      }
    });

    // Clear state
    onClearStream();
    setShowPreview(false);
  }, [editor, currentStream, onClearStream]);

  const handleReject = useCallback(() => {
    onClearStream();
    setShowPreview(false);
  }, [onClearStream]);

  const isTransformEnabled = hasSelection && selectedPresetId && !isLoading && !isStreaming && !showPreview;

  // Prepare preset options for Select component
  const presetOptions = presets.map((preset) => ({
    value: preset.id,
    label: preset.title,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 h-full flex flex-col">
      {/* Fixed Header */}
      <div className="shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            {t('editor.aiTransformer.title')}
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
          {t('editor.aiTransformer.description')}
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-0.5">
        <div className="space-y-3">
        {/* Manage Presets Button */}
        <Button
          onClick={() => setIsDialogOpen(true)}
          variant="secondary"
          className="w-full text-sm"
          disabled={isLoading || isStreaming || showPreview}
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
              onChange={handlePresetChange}
              disabled={isLoading || isStreaming || showPreview}
              placeholder={t('editor.aiTransformer.selectPreset')}
            />

            {/* Transform Button */}
            <Button
              onClick={handleTransform}
              disabled={!isTransformEnabled}
              variant="primary"
              className="w-full text-sm"
            >
              {isLoading ? t('editor.aiTransformer.loading') : t('editor.aiTransformer.transform')}
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
        {!showPreview && presets.length > 0 && !hasSelection && (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            {t('editor.aiTransformer.selectText')}
          </p>
        )}

          {/* Preview Component */}
          {showPreview && (
            <TransformPreview
              originalText={selectedText}
              transformedText={currentStream}
              isStreaming={isLoading || isStreaming}
              error={error}
              onAccept={handleAccept}
              onReject={handleReject}
              onCancel={onCancelStream}
            />
          )}
        </div>
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

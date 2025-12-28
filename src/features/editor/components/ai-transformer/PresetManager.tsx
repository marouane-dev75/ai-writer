import React, { useState } from 'react';
import { useTranslation } from '@/shared/i18n';
import { Button, FormInput } from '@/shared/ui';
import type { TransformPreset } from '../../types';

interface PresetManagerProps {
  presets: TransformPreset[];
  onAdd: (title: string, description: string) => Promise<void>;
  onUpdate: (preset: TransformPreset) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const PresetManager: React.FC<PresetManagerProps> = ({
  presets,
  onAdd,
  onUpdate,
  onDelete,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormTitle('');
    setFormDescription('');
  };

  const handleStartEdit = (preset: TransformPreset) => {
    setIsAdding(false);
    setEditingId(preset.id);
    setFormTitle(preset.title);
    setFormDescription(preset.description);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormTitle('');
    setFormDescription('');
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !formDescription.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      if (isAdding) {
        await onAdd(formTitle.trim(), formDescription.trim());
      } else if (editingId) {
        const preset = presets.find((p) => p.id === editingId);
        if (preset) {
          await onUpdate({
            ...preset,
            title: formTitle.trim(),
            description: formDescription.trim(),
          });
        }
      }
      handleCancel();
    } catch (err) {
      console.error('Failed to save preset:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('editor.aiTransformer.presetManager.confirmDelete'))) {
      return;
    }

    try {
      await onDelete(id);
      if (editingId === id) {
        handleCancel();
      }
    } catch (err) {
      console.error('Failed to delete preset:', err);
    }
  };

  const showForm = isAdding || editingId !== null;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {t('editor.aiTransformer.presetManager.title')}
      </h4>

      {/* Add Preset Button */}
      {!showForm && (
        <Button
          onClick={handleStartAdd}
          variant="primary"
          className="w-full text-sm mb-3"
          disabled={isLoading}
        >
          {t('editor.aiTransformer.presetManager.addNew')}
        </Button>
      )}

      {/* Form */}
      {showForm && (
        <div className="space-y-3 mb-3">
          <FormInput
            label={t('editor.aiTransformer.presetManager.titleLabel')}
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder={t('editor.aiTransformer.presetManager.titlePlaceholder')}
            disabled={isSaving}
          />
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              {t('editor.aiTransformer.presetManager.descriptionLabel')}
            </label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder={t('editor.aiTransformer.presetManager.descriptionPlaceholder')}
              disabled={isSaving}
              className="w-full min-h-[100px] p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-y text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              variant="primary"
              className="flex-1 text-sm"
              disabled={isSaving || !formTitle.trim() || !formDescription.trim()}
            >
              {isSaving ? t('common.saving') : t('common.save')}
            </Button>
            <Button
              onClick={handleCancel}
              variant="secondary"
              className="flex-1 text-sm"
              disabled={isSaving}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      )}

      {/* Preset List */}
      {presets.length > 0 && (
        <div className="space-y-2">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-1">
                <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {preset.title}
                </h5>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleStartEdit(preset)}
                    disabled={showForm}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('common.edit')}
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={() => handleDelete(preset.id)}
                    disabled={showForm}
                    className="text-xs text-red-600 dark:text-red-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {preset.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {presets.length === 0 && !showForm && (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center">
          {t('editor.aiTransformer.presetManager.empty')}
        </p>
      )}
    </div>
  );
};

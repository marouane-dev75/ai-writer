import React, { useState } from 'react';
import { useTranslation } from '@/shared/i18n';
import { Button, FormInput } from '@/shared/ui';
import Flag from 'react-country-flag';
import type { TransformPreset } from '../../shared/types';

// Default presets
const DEFAULT_ENGLISH_PRESETS = [
  {
    title: 'EN - Make Professional',
    description: 'Rewrite the text to be more professional and formal while maintaining the core message and key information.',
  },
  {
    title: 'EN - Simplify',
    description: 'Simplify the text to make it easier to understand, using simpler words and shorter sentences while keeping the main ideas.',
  },
  {
    title: 'EN - Fix Grammar',
    description: 'Correct any grammar, spelling, and punctuation errors in the text. Keep the original style and tone.',
  },
  {
    title: 'EN - Summarize',
    description: 'Create a concise summary of the main points in the text, reducing it to about 30% of the original length.',
  },
  {
    title: 'EN - Expand',
    description: 'Expand the text with more details, examples, and explanations to make it more comprehensive and informative.',
  },
];

const DEFAULT_FRENCH_PRESETS = [
  {
    title: 'FR - Rendre professionnel',
    description: 'Réécrivez le texte pour qu\'il soit plus professionnel et formel tout en conservant le message principal et les informations clés.',
  },
  {
    title: 'FR - Simplifier',
    description: 'Simplifiez le texte pour le rendre plus facile à comprendre, en utilisant des mots plus simples et des phrases plus courtes tout en gardant les idées principales.',
  },
  {
    title: 'FR - Corriger la grammaire',
    description: 'Corrigez toutes les erreurs de grammaire, d\'orthographe et de ponctuation dans le texte. Conservez le style et le ton d\'origine.',
  },
  {
    title: 'FR - Résumer',
    description: 'Créez un résumé concis des points principaux du texte, en le réduisant à environ 30% de la longueur d\'origine.',
  },
  {
    title: 'FR - Développer',
    description: 'Développez le texte avec plus de détails, d\'exemples et d\'explications pour le rendre plus complet et informatif.',
  },
];

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

  const handleAddDefaultPresets = async (presets: Array<{ title: string; description: string }>) => {
    setIsSaving(true);
    try {
      for (const preset of presets) {
        await onAdd(preset.title, preset.description);
      }
    } catch (err) {
      console.error('Failed to add default presets:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFrenchPresets = () => handleAddDefaultPresets(DEFAULT_FRENCH_PRESETS);
  const handleAddEnglishPresets = () => handleAddDefaultPresets(DEFAULT_ENGLISH_PRESETS);
  const handleAddAllPresets = () => handleAddDefaultPresets([...DEFAULT_FRENCH_PRESETS, ...DEFAULT_ENGLISH_PRESETS]);

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

      {/* Empty State - Default Preset Buttons */}
      {presets.length === 0 && !showForm && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center mb-3">
            {t('editor.aiTransformer.presetManager.empty')}
          </p>
          <div className="space-y-2">
            <Button
              onClick={handleAddFrenchPresets}
              variant="secondary"
              className="w-full text-sm"
              disabled={isSaving}
            >
              {isSaving ? t('common.loading') : t('editor.aiTransformer.presetManager.addFrenchPresets')}
            </Button>
            <Button
              onClick={handleAddEnglishPresets}
              variant="secondary"
              className="w-full text-sm"
              disabled={isSaving}
            >
              {isSaving ? t('common.loading') : t('editor.aiTransformer.presetManager.addEnglishPresets')}
            </Button>
            <Button
              onClick={handleAddAllPresets}
              variant="secondary"
              className="w-full text-sm"
              disabled={isSaving}
            >
              {isSaving ? t('common.loading') : t('editor.aiTransformer.presetManager.addAllPresets')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

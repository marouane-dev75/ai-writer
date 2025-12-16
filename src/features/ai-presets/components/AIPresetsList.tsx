import { useState } from 'react';
import { useTranslation } from '@/shared/i18n';
import { Button } from '@/shared/ui';
import { HiPlus } from 'react-icons/hi2';
import { AIPresetCard } from './AIPresetCard';
import { AIPresetForm } from './AIPresetForm';
import { useAIPresets } from '../hooks/useAIPresets';
import type { AIPresetsService } from '../services/ai-presets.service';
import type { AIPreset } from '../types';

interface AIPresetsListProps {
  service: AIPresetsService;
}

export const AIPresetsList = ({ service }: AIPresetsListProps) => {
  const { t } = useTranslation();
  const { presets, isLoading, error, addPreset, updatePreset, deletePreset } = useAIPresets(service);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<AIPreset | undefined>();

  const handleAddClick = () => {
    setEditingPreset(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (preset: AIPreset) => {
    setEditingPreset(preset);
    setIsFormOpen(true);
  };

  const handleSave = async (preset: AIPreset) => {
    if (editingPreset) {
      await updatePreset(editingPreset.id, preset);
    } else {
      await addPreset(preset);
    }
    setIsFormOpen(false);
    setEditingPreset(undefined);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingPreset(undefined);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('aiPresets.confirmDelete'))) {
      await deletePreset(id);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('aiPresets.title')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('aiPresets.subtitle')}
          </p>
        </div>
        {!isFormOpen && (
          <Button onClick={handleAddClick} variant="primary" className="flex items-center gap-2">
            <HiPlus className="w-5 h-5" />
            {t('aiPresets.addPreset')}
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {isFormOpen && (
        <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingPreset ? t('aiPresets.editPreset') : t('aiPresets.addPreset')}
          </h3>
          <AIPresetForm
            preset={editingPreset}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {presets.length === 0 && !isFormOpen ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t('aiPresets.noPresets')}
          </p>
          <Button onClick={handleAddClick} variant="primary" className="flex items-center gap-2 mx-auto">
            <HiPlus className="w-5 h-5" />
            {t('aiPresets.addFirstPreset')}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {presets.map((preset) => (
            <AIPresetCard
              key={preset.id}
              preset={preset}
              onEdit={() => handleEditClick(preset)}
              onDelete={() => handleDelete(preset.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

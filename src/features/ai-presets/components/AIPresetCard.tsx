import { useTranslation } from '@/shared/i18n';
import { HiPencil, HiTrash } from 'react-icons/hi2';
import type { AIPreset } from '../types';

interface AIPresetCardProps {
  preset: AIPreset;
  onEdit: () => void;
  onDelete: () => void;
}

export const AIPresetCard = ({ preset, onEdit, onDelete }: AIPresetCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {preset.name}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title={t('aiPresets.editPreset')}
          >
            <HiPencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title={t('aiPresets.deletePreset')}
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">{t('aiPresets.promptTemplate')}:</span>
          <p className="mt-1 text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 font-mono whitespace-pre-wrap wrap-break-word">
            {preset.promptTemplate}
          </p>
        </div>

        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div>
            <span className="font-medium">{t('aiPresets.linesBefore')}:</span>{' '}
            <span className="text-gray-900 dark:text-white">{preset.linesBefore}</span>
          </div>
          <div>
            <span className="font-medium">{t('aiPresets.linesAfter')}:</span>{' '}
            <span className="text-gray-900 dark:text-white">{preset.linesAfter}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

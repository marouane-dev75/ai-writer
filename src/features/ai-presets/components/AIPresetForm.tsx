import { useState, useEffect } from 'react';
import { useTranslation } from '@/shared/i18n';
import { Button, FormInput, Slider } from '@/shared/ui';
import type { AIPreset } from '../types';

interface AIPresetFormProps {
  preset?: AIPreset;
  onSave: (preset: AIPreset) => Promise<void>;
  onCancel: () => void;
}

export const AIPresetForm = ({ preset, onSave, onCancel }: AIPresetFormProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState(preset?.name || '');
  const [promptTemplate, setPromptTemplate] = useState(preset?.promptTemplate || '');
  const [linesBefore, setLinesBefore] = useState(preset?.linesBefore || 3);
  const [linesAfter, setLinesAfter] = useState(preset?.linesAfter || 3);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (preset) {
      setName(preset.name);
      setPromptTemplate(preset.promptTemplate);
      setLinesBefore(preset.linesBefore);
      setLinesAfter(preset.linesAfter);
    }
  }, [preset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !promptTemplate.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      const newPreset: AIPreset = {
        id: preset?.id || crypto.randomUUID(),
        name: name.trim(),
        promptTemplate: promptTemplate.trim(),
        linesBefore,
        linesAfter,
      };
      
      await onSave(newPreset);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label={t('aiPresets.name')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('aiPresets.namePlaceholder')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('aiPresets.promptTemplate')}
        </label>
        <textarea
          value={promptTemplate}
          onChange={(e) => setPromptTemplate(e.target.value)}
          placeholder={t('aiPresets.promptTemplatePlaceholder')}
          required
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder-gray-400 dark:placeholder-gray-500"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t('aiPresets.placeholderHint')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Slider
          label={t('aiPresets.linesBefore')}
          value={linesBefore}
          onChange={setLinesBefore}
          min={0}
          step={1}
          max={50}
        />

        <Slider
          label={t('aiPresets.linesAfter')}
          value={linesAfter}
          onChange={setLinesAfter}
          min={0}
          step={1}
          max={50}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          disabled={isSaving}
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSaving || !name.trim() || !promptTemplate.trim()}
        >
          {isSaving ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  );
};

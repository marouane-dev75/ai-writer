import { useCallback } from "react";
import { useTranslation } from "@/shared/i18n";
import { FormInput, Slider, Select, SelectOption } from "@/shared/ui";
import { ActiveProviderButton } from "./ActiveProviderButton";
import type { OpenAIConfig } from "../types";

interface OpenAISettingsProps {
  config: OpenAIConfig;
  onChange: (updates: Partial<OpenAIConfig>) => void;
  isActive: boolean;
  onSetActive: () => void;
}

const OPENAI_MODELS: SelectOption[] = [
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-4-32k', label: 'GPT-4 32K' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'gpt-3.5-turbo-16k', label: 'GPT-3.5 Turbo 16K' },
];

export const OpenAISettings = ({ 
  config, 
  onChange, 
  isActive, 
  onSetActive 
}: OpenAISettingsProps) => {
  const { t } = useTranslation();

  const handleChange = useCallback(
    (field: keyof OpenAIConfig) => (value: string | number | null) => {
      if (value !== null) {
        onChange({ [field]: value });
      }
    },
    [onChange]
  );

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t('ai.openai.title')}
      </h2>
      <div className="space-y-4">
        <FormInput
          label={t('ai.openai.apiKey')}
          type="password"
          value={config.apiKey}
          onChange={(e) => handleChange('apiKey')(e.target.value)}
          placeholder={t('ai.openai.apiKey')}
        />
        <Select
          label={t('ai.openai.model')}
          options={OPENAI_MODELS}
          value={config.model}
          onChange={(value) => handleChange('model')(value)}
          placeholder={t('ai.openai.modelPlaceholder')}
        />
        <Slider
          label={t('ai.openai.temperature')}
          value={config.temperature}
          onChange={handleChange('temperature')}
          min={0}
          max={2}
          step={0.1}
        />
        <Slider
          label={t('ai.openai.maxTokens')}
          value={config.maxTokens}
          onChange={handleChange('maxTokens')}
          min={100}
          max={4096}
          step={100}
        />
        
        <ActiveProviderButton isActive={isActive} onSetActive={onSetActive} />
      </div>
    </div>
  );
};

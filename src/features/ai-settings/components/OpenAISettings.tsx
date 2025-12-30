import { useCallback } from "react";
import { useTranslation } from "@/shared/i18n";
import { FormInput, Slider, Select, SelectOption, FieldError } from "@/shared/ui";
import { ActiveProviderButton } from "./ActiveProviderButton";
import { useFormValidation } from "../hooks/useFormValidation";
import { openAIConfigSchema } from "../validation";
import type { OpenAIConfig } from "../types";

interface OpenAISettingsProps {
  config: OpenAIConfig;
  onChange: (updates: Partial<OpenAIConfig>) => void;
  isActive: boolean;
  onSetActive: () => void;
}

const OPENAI_MODELS: SelectOption[] = [
  { value: 'gpt-5-mini', label: 'GPT-5 mini' },
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 mini' },
  { value: 'gpt-4.1-nano', label: 'GPT-4.1 nano' },
  { value: 'gpt-4-nano', label: 'GPT-4 nano' },
];

export const OpenAISettings = ({ 
  config, 
  onChange, 
  isActive, 
  onSetActive 
}: OpenAISettingsProps) => {
  const { t } = useTranslation();
  const { errors } = useFormValidation(openAIConfigSchema, config);

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
        <div>
          <FormInput
            label={t('ai.openai.apiKey')}
            type="password"
            value={config.apiKey}
            onChange={(e) => handleChange('apiKey')(e.target.value)}
            placeholder={t('ai.openai.apiKey')}
          />
          <FieldError error={errors.apiKey} />
        </div>
        <div>
          <Select
            label={t('ai.openai.model')}
            options={OPENAI_MODELS}
            value={config.model}
            onChange={(value) => handleChange('model')(value)}
            placeholder={t('ai.openai.modelPlaceholder')}
          />
          <FieldError error={errors.model} />
        </div>
        <div>
          <Slider
            label={t('ai.openai.temperature')}
            value={config.temperature}
            onChange={handleChange('temperature')}
            min={0}
            max={2}
            step={0.1}
          />
          <FieldError error={errors.temperature} />
        </div>
        <div>
          <Slider
            label={t('ai.openai.maxTokens')}
            value={config.maxTokens}
            onChange={handleChange('maxTokens')}
            min={100}
            max={4096}
            step={100}
          />
          <FieldError error={errors.maxTokens} />
        </div>
        
        <ActiveProviderButton isActive={isActive} onSetActive={onSetActive} />
      </div>
    </div>
  );
};

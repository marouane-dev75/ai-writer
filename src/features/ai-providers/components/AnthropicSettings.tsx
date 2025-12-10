import { useCallback } from "react";
import { useTranslation } from "@/shared/i18n";
import { FormInput, Slider, Select, SelectOption } from "@/shared/ui";
import { ActiveProviderButton } from "./ActiveProviderButton";
import type { AnthropicConfig } from "../types";

interface AnthropicSettingsProps {
  config: AnthropicConfig;
  onChange: (updates: Partial<AnthropicConfig>) => void;
  isActive: boolean;
  onSetActive: () => void;
}

const ANTHROPIC_MODELS: SelectOption[] = [
  { value: 'claude-3-opus', label: 'Claude 3 Opus' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
  { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
  { value: 'claude-2.1', label: 'Claude 2.1' },
  { value: 'claude-2.0', label: 'Claude 2.0' },
  { value: 'claude-instant-1.2', label: 'Claude Instant 1.2' },
];

export const AnthropicSettings = ({ 
  config, 
  onChange, 
  isActive, 
  onSetActive 
}: AnthropicSettingsProps) => {
  const { t } = useTranslation();

  const handleChange = useCallback(
    (field: keyof AnthropicConfig) => (value: string | number | null) => {
      if (value !== null) {
        onChange({ [field]: value });
      }
    },
    [onChange]
  );

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t('ai.anthropic.title')}
      </h2>
      <div className="space-y-4">
        <FormInput
          label={t('ai.anthropic.apiKey')}
          type="password"
          value={config.apiKey}
          onChange={(e) => handleChange('apiKey')(e.target.value)}
          placeholder={t('ai.anthropic.apiKey')}
        />
        <Select
          label={t('ai.anthropic.model')}
          options={ANTHROPIC_MODELS}
          value={config.model}
          onChange={(value) => handleChange('model')(value)}
          placeholder={t('ai.anthropic.modelPlaceholder')}
        />
        <Slider
          label={t('ai.anthropic.maxTokens')}
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

import { useState } from "react";
import { useTranslation } from "@/shared/i18n";
import { FormInput, Slider, Select, SelectOption } from "@/shared/ui";
import { ActiveProviderButton } from "./ActiveProviderButton";

interface AnthropicSettingsProps {
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

export const AnthropicSettings = ({ isActive, onSetActive }: AnthropicSettingsProps) => {
  const { t } = useTranslation();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  return (
    <div className="relative animate-fade-in">
      {/* Coming Soon Badge */}
      <div className="absolute top-0 right-0">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {t('ai.comingSoon')}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t('ai.anthropic.title')}
      </h2>
      <div className="space-y-4">
        <FormInput
          label={t('ai.anthropic.apiKey')}
          type="password"
          disabled
          placeholder={t('ai.comingSoon')}
        />
        <Select
          label={t('ai.anthropic.model')}
          options={ANTHROPIC_MODELS}
          value={selectedModel}
          onChange={setSelectedModel}
          disabled
          placeholder={t('ai.anthropic.modelPlaceholder')}
        />
        <Slider
          label={t('ai.anthropic.maxTokens')}
          value={2048}
          min={100}
          max={4096}
          step={100}
          disabled
        />
        
        <ActiveProviderButton isActive={isActive} onSetActive={onSetActive} />
      </div>
    </div>
  );
};

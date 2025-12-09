import { useState, useEffect } from "react";
import { useTranslation } from "@/shared/i18n";
import { FormInput, Slider, Select, SelectOption } from "@/shared/ui";
import { ActiveProviderButton } from "./ActiveProviderButton";
import { aiProviderService } from "../services/ai-provider.service";

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
  const [apiKey, setApiKey] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [maxTokens, setMaxTokens] = useState<number>(2048);

  // Load config on mount
  useEffect(() => {
    const config = aiProviderService.getAnthropicConfig();
    setApiKey(config.apiKey);
    setSelectedModel(config.model);
    setMaxTokens(config.maxTokens);
  }, []);

  // Update config when values change
  const updateConfig = () => {
    aiProviderService.setAnthropicConfig({
      apiKey,
      model: selectedModel || 'claude-3-opus',
      maxTokens,
    });
  };

  useEffect(() => {
    updateConfig();
  }, [apiKey, selectedModel, maxTokens]);

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t('ai.anthropic.title')}
      </h2>
      <div className="space-y-4">
        <FormInput
          label={t('ai.anthropic.apiKey')}
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={t('ai.anthropic.apiKey')}
        />
        <Select
          label={t('ai.anthropic.model')}
          options={ANTHROPIC_MODELS}
          value={selectedModel}
          onChange={setSelectedModel}
          placeholder={t('ai.anthropic.modelPlaceholder')}
        />
        <Slider
          label={t('ai.anthropic.maxTokens')}
          value={maxTokens}
          onChange={setMaxTokens}
          min={100}
          max={4096}
          step={100}
        />
        
        <ActiveProviderButton isActive={isActive} onSetActive={onSetActive} />
      </div>
    </div>
  );
};

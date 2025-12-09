import { useState, useEffect } from "react";
import { useTranslation } from "@/shared/i18n";
import { FormInput, Slider, Select, SelectOption } from "@/shared/ui";
import { ActiveProviderButton } from "./ActiveProviderButton";
import { aiProviderService } from "../services/ai-provider.service";

interface OpenAISettingsProps {
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

export const OpenAISettings = ({ isActive, onSetActive }: OpenAISettingsProps) => {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(2048);

  // Load config on mount
  useEffect(() => {
    const config = aiProviderService.getOpenAIConfig();
    setApiKey(config.apiKey);
    setSelectedModel(config.model);
    setTemperature(config.temperature);
    setMaxTokens(config.maxTokens);
  }, []);

  // Update config when values change
  const updateConfig = () => {
    aiProviderService.setOpenAIConfig({
      apiKey,
      model: selectedModel || 'gpt-4-turbo',
      temperature,
      maxTokens,
    });
  };

  useEffect(() => {
    updateConfig();
  }, [apiKey, selectedModel, temperature, maxTokens]);

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t('ai.openai.title')}
      </h2>
      <div className="space-y-4">
        <FormInput
          label={t('ai.openai.apiKey')}
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={t('ai.openai.apiKey')}
        />
        <Select
          label={t('ai.openai.model')}
          options={OPENAI_MODELS}
          value={selectedModel}
          onChange={setSelectedModel}
          placeholder={t('ai.openai.modelPlaceholder')}
        />
        <Slider
          label={t('ai.openai.temperature')}
          value={temperature}
          onChange={setTemperature}
          min={0}
          max={2}
          step={0.1}
        />
        <Slider
          label={t('ai.openai.maxTokens')}
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

import { useState, useMemo } from "react";
import { useTranslation } from "@/shared/i18n";
import { Button } from "@/shared/ui";
import { SiOpenai, SiAnthropic } from "react-icons/si";
import { HiCpuChip } from "react-icons/hi2";
import { AnthropicSettings } from "./AnthropicSettings";
import { LocalQwenSettings } from "./LocalQwenSettings";
import { OpenAISettings } from "./OpenAISettings";
import type { AIProvider } from "../types";
import type { AIProviderService } from "../services/ai-provider.service";

interface AIProviderSettingsProps {
  service: AIProviderService;
}

export const AIProviderSettings = ({ service }: AIProviderSettingsProps) => {
  const { t } = useTranslation();
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(service.getActiveProvider());
  const [activeProvider, setActiveProvider] = useState<AIProvider>(service.getActiveProvider());

  const handleSetActive = (provider: AIProvider) => {
    service.setActiveProvider(provider);
    setActiveProvider(provider);
  };

  const providers = useMemo<{ id: AIProvider; label: string; icon: React.ReactNode }[]>(
    () => [
      { id: 'localQwen', label: t('ai.localQwen.title'), icon: <HiCpuChip className="w-5 h-5" /> },
      { id: 'anthropic', label: t('ai.anthropic.title'), icon: <SiAnthropic className="w-5 h-5" /> },
      { id: 'openai', label: t('ai.openai.title'), icon: <SiOpenai className="w-5 h-5" /> },
    ],
    [t]
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-6">
      {/* Provider Selector Tabs */}
      <div className="mb-6">
        <label 
          id="provider-selector-label"
          className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4"
        >
          {t('ai.selectProvider')}
        </label>
        <div 
          role="tablist" 
          aria-labelledby="provider-selector-label"
          className="flex gap-3 flex-wrap"
        >
          {providers.map((provider) => (
            <Button
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              variant={selectedProvider === provider.id ? 'primary' : 'outline'}
              className="flex items-center gap-2"
              aria-selected={selectedProvider === provider.id}
              aria-controls={`${provider.id}-panel`}
            >
              {provider.icon}
              {provider.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 mb-6"></div>

      {/* Provider Settings */}
      <div role="tabpanel" id="localQwen-panel" aria-labelledby="localQwen-tab" hidden={selectedProvider !== 'localQwen'}>
        <LocalQwenSettings 
          isActive={activeProvider === 'localQwen'}
          onSetActive={() => handleSetActive('localQwen')}
        />
      </div>
      <div role="tabpanel" id="openai-panel" aria-labelledby="openai-tab" hidden={selectedProvider !== 'openai'}>
        <OpenAISettings 
          isActive={activeProvider === 'openai'}
          onSetActive={() => handleSetActive('openai')}
        />
      </div>
      <div role="tabpanel" id="anthropic-panel" aria-labelledby="anthropic-tab" hidden={selectedProvider !== 'anthropic'}>
        <AnthropicSettings 
          isActive={activeProvider === 'anthropic'}
          onSetActive={() => handleSetActive('anthropic')}
        />
      </div>
    </div>
  );
};

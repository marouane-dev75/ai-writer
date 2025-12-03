import { useState } from "react";
import { useTranslation } from "@/shared/i18n";
import { Button } from "@/shared/ui";
import { SiOpenai, SiAnthropic } from "react-icons/si";
import { HiCpuChip } from "react-icons/hi2";
import { AnthropicSettings } from "./AnthropicSettings";
import { LocalQwenSettings } from "./LocalQwenSettings";
import { OpenAISettings } from "./OpenAISettings";
import type { AIProvider } from "../types";

export const AIProviderSettings = () => {
  const { t } = useTranslation();
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai');

  const providers: { id: AIProvider; label: string; icon: React.ReactNode }[] = [
    { id: 'openai', label: t('ai.openai.title'), icon: <SiOpenai className="w-5 h-5" /> },
    { id: 'anthropic', label: t('ai.anthropic.title'), icon: <SiAnthropic className="w-5 h-5" /> },
    { id: 'localQwen', label: t('ai.localQwen.title'), icon: <HiCpuChip className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Provider Selector Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-6">
        <label 
          id="provider-selector-label"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4"
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

      {/* Provider Settings */}
      <div role="tabpanel" id="openai-panel" aria-labelledby="openai-tab" hidden={selectedProvider !== 'openai'}>
        {selectedProvider === 'openai' && <OpenAISettings />}
      </div>
      <div role="tabpanel" id="anthropic-panel" aria-labelledby="anthropic-tab" hidden={selectedProvider !== 'anthropic'}>
        {selectedProvider === 'anthropic' && <AnthropicSettings />}
      </div>
      <div role="tabpanel" id="localQwen-panel" aria-labelledby="localQwen-tab" hidden={selectedProvider !== 'localQwen'}>
        {selectedProvider === 'localQwen' && <LocalQwenSettings />}
      </div>
    </div>
  );
};

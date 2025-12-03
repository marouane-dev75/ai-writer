import { useState } from "react";
import { useTranslation } from "@/shared/i18n";
import { AnthropicSettings } from "./AnthropicSettings";
import { LocalQwenSettings } from "./LocalQwenSettings";
import { OpenAISettings } from "./OpenAISettings";
import type { AIProvider } from "../types";

export const AIProviderSettings = () => {
  const { t } = useTranslation();
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai');

  const providers: { id: AIProvider; label: string }[] = [
    { id: 'openai', label: t('ai.openai.title') },
    { id: 'anthropic', label: t('ai.anthropic.title') },
    { id: 'localQwen', label: t('ai.localQwen.title') },
  ];

  return (
    <div className="space-y-6">
      {/* Provider Selector Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t('ai.selectProvider')}
        </label>
        <div className="flex gap-2 flex-wrap">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedProvider === provider.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {provider.label}
            </button>
          ))}
        </div>
      </div>

      {/* Provider Settings */}
      {selectedProvider === 'openai' && <OpenAISettings />}
      {selectedProvider === 'anthropic' && <AnthropicSettings />}
      {selectedProvider === 'localQwen' && <LocalQwenSettings />}
    </div>
  );
};

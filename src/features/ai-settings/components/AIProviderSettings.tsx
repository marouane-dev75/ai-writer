import { useMemo } from "react";
import { useTranslation } from "@/shared/i18n";
import { Button } from "@/shared/ui";
import { SiOpenai, SiAnthropic } from "react-icons/si";
import { HiCpuChip } from "react-icons/hi2";
import { AnthropicSettings } from "./AnthropicSettings";
import { LocalQwenSettings } from "./LocalQwenSettings";
import { OpenAISettings } from "./OpenAISettings";
import { useProviderSettings } from "../hooks/useProviderSettings";
import { useFormValidation } from "../hooks/useFormValidation";
import { openAIConfigSchema, anthropicConfigSchema, localQwenConfigSchema } from "../validation";
import type { AIProviderService } from "../services/ai-provider.service";

interface AIProviderSettingsProps {
  service: AIProviderService;
}

export const AIProviderSettings = ({ service }: AIProviderSettingsProps) => {
  const { t } = useTranslation();
  const {
    config,
    selectedProvider,
    setSelectedProvider,
    updateConfig,
    save,
    reset,
    isLoading,
    isSaving,
    isDirty,
    error,
  } = useProviderSettings(service);

  // Validate current provider config
  const { isValid: isOpenAIValid } = useFormValidation(
    openAIConfigSchema,
    config?.openai ?? { apiKey: '', model: '', temperature: 0, maxTokens: 100 }
  );
  const { isValid: isAnthropicValid } = useFormValidation(
    anthropicConfigSchema,
    config?.anthropic ?? { apiKey: '', model: '', temperature: 0, maxTokens: 100 }
  );
  const { isValid: isLocalQwenValid } = useFormValidation(
    localQwenConfigSchema,
    config?.localQwen ?? {
      modelPath: '',
      selectedModelId: '',
      contextSize: 512,
      temperature: 0,
      seed: -1,
      repeatPenalty: 1,
      repeatLastN: 1,
      useThinkingMode: false,
      useGpu: false,
    }
  );

  // Determine if current config is valid
  const isCurrentConfigValid = useMemo(() => {
    if (!config) return false;
    
    switch (config.activeProvider) {
      case 'openai':
        return isOpenAIValid;
      case 'anthropic':
        return isAnthropicValid;
      case 'localQwen':
        return isLocalQwenValid;
      default:
        return false;
    }
  }, [config, isOpenAIValid, isAnthropicValid, isLocalQwenValid]);

  const providers = useMemo(
    () => [
      { id: 'localQwen' as const, label: t('ai.localQwen.title'), icon: <HiCpuChip className="w-5 h-5" /> },
      { id: 'anthropic' as const, label: t('ai.anthropic.title'), icon: <SiAnthropic className="w-5 h-5" /> },
      { id: 'openai' as const, label: t('ai.openai.title'), icon: <SiOpenai className="w-5 h-5" /> },
    ],
    [t]
  );

  const handleSave = async () => {
    if (!isCurrentConfigValid) {
      return; // Don't save if validation fails
    }
    
    try {
      await save();
      // TODO: Show success toast notification
    } catch (err) {
      // Error already handled by hook with error state
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-red-600 dark:text-red-400">
          {t('ai.failedToLoad')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

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
            >
              {provider.icon}
              {provider.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 mb-6" />

      {/* Provider Settings - Controlled components */}
      {selectedProvider === 'localQwen' && (
        <LocalQwenSettings
          config={config.localQwen}
          onChange={(updates) => updateConfig({ localQwen: { ...config.localQwen, ...updates } })}
          isActive={config.activeProvider === 'localQwen'}
          onSetActive={() => updateConfig({ activeProvider: 'localQwen' })}
        />
      )}
      {selectedProvider === 'openai' && (
        <OpenAISettings
          config={config.openai}
          onChange={(updates) => updateConfig({ openai: { ...config.openai, ...updates } })}
          isActive={config.activeProvider === 'openai'}
          onSetActive={() => updateConfig({ activeProvider: 'openai' })}
        />
      )}
      {selectedProvider === 'anthropic' && (
        <AnthropicSettings
          config={config.anthropic}
          onChange={(updates) => updateConfig({ anthropic: { ...config.anthropic, ...updates } })}
          isActive={config.activeProvider === 'anthropic'}
          onSetActive={() => updateConfig({ activeProvider: 'anthropic' })}
        />
      )}

      {/* Save/Reset Actions */}
      <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 flex justify-end gap-3">
        <Button
          onClick={reset}
          variant="outline"
          disabled={!isDirty || isSaving}
        >
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSave}
          variant="primary"
          disabled={!isDirty || isSaving || !isCurrentConfigValid}
        >
          {isSaving ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </div>
  );
};

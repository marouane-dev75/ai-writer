import { useTranslation } from "@/shared/i18n";
import { FormInput, Slider } from "@/shared/ui";
import { ActiveProviderButton } from "./ActiveProviderButton";

interface OpenAISettingsProps {
  isActive: boolean;
  onSetActive: () => void;
}

export const OpenAISettings = ({ isActive, onSetActive }: OpenAISettingsProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative animate-fade-in">
      {/* Coming Soon Badge */}
      <div className="absolute top-0 right-0">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {t('ai.comingSoon')}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t('ai.openai.title')}
      </h2>
      <div className="space-y-4">
        <FormInput
          label={t('ai.openai.apiKey')}
          type="password"
          disabled
          placeholder={t('ai.comingSoon')}
        />
        <FormInput
          label={t('ai.openai.model')}
          type="text"
          disabled
          placeholder={t('ai.comingSoon')}
        />
        <Slider
          label={t('ai.openai.temperature')}
          value={0.7}
          min={0}
          max={2}
          step={0.1}
          disabled
        />
        <Slider
          label={t('ai.openai.maxTokens')}
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

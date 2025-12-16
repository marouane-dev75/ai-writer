import { useTranslation } from "@/shared/i18n";
import { AIProviderSettings, aiProviderService } from "@/features/ai-settings";
import { AIPresetsList, aiPresetsService } from "@/features/ai-presets";

export const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('settings.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="space-y-8">
        <AIProviderSettings service={aiProviderService} />
        <AIPresetsList service={aiPresetsService} />
      </div>
    </>
  );
};

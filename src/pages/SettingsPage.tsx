import { useTranslation } from "@/shared/i18n";
import { AIProviderSettings, aiProviderService } from "@/features/ai-settings";
import { useAppRestartPrompt } from "@/features/app-restart";

export const SettingsPage = () => {
  const { t } = useTranslation();
  const { setShowRestartPrompt } = useAppRestartPrompt();

  const handleConfigSaved = () => {
    setShowRestartPrompt(true);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t("settings.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t("settings.subtitle")}
        </p>
      </div>

      <AIProviderSettings
        service={aiProviderService}
        onConfigSaved={handleConfigSaved}
      />
    </>
  );
};

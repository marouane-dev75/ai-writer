import { useTranslation } from "@/shared/i18n";
import { AIProviderSettings, aiProviderService } from "@/features/ai-settings";
import { useAppRestartPrompt } from "@/features/app-restart";
import { ModelStatusIndicator, useAiStatus } from "@/features/ai-runtime";

export const SettingsPage = () => {
  const { t } = useTranslation();
  const { setShowRestartPrompt } = useAppRestartPrompt();
  const { status } = useAiStatus();

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

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {t("settings.aiModelStatus")}
        </h2>
        <ModelStatusIndicator status={status} />
      </div>

      <AIProviderSettings
        service={aiProviderService}
        onConfigSaved={handleConfigSaved}
      />
    </>
  );
};

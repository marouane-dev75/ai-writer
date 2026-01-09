import { useState } from "react";
import { useTranslation } from "@/shared/i18n";
import { AIProviderSettings, aiProviderService } from "@/features/ai-settings";
import { useAppRestartPrompt } from "@/features/app-restart";
import { ModelStatusIndicator, useAiStatus } from "@/features/ai-runtime";
import { SystemInfo, systemInfoService } from "@/features/system-info";
import { Button } from "@/shared/ui";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";

export const SettingsPage = () => {
  const { t } = useTranslation();
  const { setShowRestartPrompt } = useAppRestartPrompt();
  const { status } = useAiStatus();
  const [showSystemInfo, setShowSystemInfo] = useState(false);

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

      <div className="mt-8">
        <Button
          onClick={() => setShowSystemInfo(!showSystemInfo)}
          variant="secondary"
          className="flex items-center gap-2"
        >
          {showSystemInfo ? (
            <>
              <HiChevronUp className="w-5 h-5" />
              {t("settings.hideSystemInfo")}
            </>
          ) : (
            <>
              <HiChevronDown className="w-5 h-5" />
              {t("settings.seeSystemInfo")}
            </>
          )}
        </Button>

        {showSystemInfo && (
          <div className="mt-6 animate-fadeIn">
            <SystemInfo service={systemInfoService} />
          </div>
        )}
      </div>
    </>
  );
};

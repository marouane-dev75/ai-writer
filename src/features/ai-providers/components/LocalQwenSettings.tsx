import { useState } from "react";
import { useTranslation } from "@/shared/i18n";
import { DirectoryInput, FormInput, Slider, Switch } from "@/shared/ui";
import { ActiveProviderButton } from "./ActiveProviderButton";

interface LocalQwenSettingsProps {
  isActive: boolean;
  onSetActive: () => void;
}

export const LocalQwenSettings = ({
  isActive,
  onSetActive,
}: LocalQwenSettingsProps) => {
  const { t } = useTranslation();
  const [modelPath, setModelPath] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [repeatPenalty, setRepeatPenalty] = useState<number>(1.1);

  return (
    <div className="relative animate-fade-in">
      {/* Coming Soon Badge */}
      <div className="absolute top-0 right-0">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {t("ai.comingSoon")}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t("ai.localQwen.title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DirectoryInput
          label={t("ai.localQwen.modelPath")}
          value={modelPath}
          onChange={setModelPath}
          disabled
          placeholder={t("ai.comingSoon")}
        />

        <FormInput
          label={t("ai.localQwen.contextSize")}
          type="number"
          disabled
          placeholder={t("ai.comingSoon")}
        />

        <Slider
          label={t("ai.localQwen.temperature")}
          value={temperature}
          onChange={setTemperature}
          min={0}
          max={2}
          step={0.1}
          disabled
        />

        <div>
          <FormInput
            label={t("ai.localQwen.seed")}
            type="number"
            disabled
            placeholder={t("ai.comingSoon")}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
            {t("ai.localQwen.seedHelper")}
          </p>
        </div>

        <Slider
          label={t("ai.localQwen.repeatPenalty")}
          value={repeatPenalty}
          onChange={setRepeatPenalty}
          min={1}
          max={2}
          step={0.1}
          disabled
        />

        <FormInput
          label={t("ai.localQwen.repeatLastN")}
          type="number"
          disabled
          placeholder={t("ai.comingSoon")}
        />

        <Switch label={t("ai.localQwen.useThinkingMode")} disabled />

        <Switch label={t("ai.localQwen.useGpu")} disabled />

        <div className="md:col-span-2">
          <ActiveProviderButton isActive={isActive} onSetActive={onSetActive} />
        </div>
      </div>
    </div>
  );
};

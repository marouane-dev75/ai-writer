import { useCallback } from "react";
import { useTranslation } from "@/shared/i18n";
import { DirectoryInput, FormInput, Slider, Switch } from "@/shared/ui";
import { ActiveProviderButton } from "./ActiveProviderButton";
import type { LocalQwenConfig } from "../types";

interface LocalQwenSettingsProps {
  config: LocalQwenConfig;
  onChange: (updates: Partial<LocalQwenConfig>) => void;
  isActive: boolean;
  onSetActive: () => void;
}

export const LocalQwenSettings = ({
  config,
  onChange,
  isActive,
  onSetActive,
}: LocalQwenSettingsProps) => {
  const { t } = useTranslation();

  const handleChange = useCallback(
    (field: keyof LocalQwenConfig) => (value: string | number | boolean) => {
      onChange({ [field]: value });
    },
    [onChange]
  );

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t("ai.localQwen.title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DirectoryInput
          label={t("ai.localQwen.modelPath")}
          value={config.modelPath}
          onChange={handleChange('modelPath')}
          placeholder={t("ai.localQwen.modelPath")}
        />

        <FormInput
          label={t("ai.localQwen.contextSize")}
          type="number"
          value={config.contextSize.toString()}
          onChange={(e) => handleChange('contextSize')(Number(e.target.value))}
          placeholder="4096"
        />

        <Slider
          label={t("ai.localQwen.temperature")}
          value={config.temperature}
          onChange={handleChange('temperature')}
          min={0}
          max={2}
          step={0.1}
        />

        <div>
          <FormInput
            label={t("ai.localQwen.seed")}
            type="number"
            value={config.seed.toString()}
            onChange={(e) => handleChange('seed')(Number(e.target.value))}
            placeholder="-1"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
            {t("ai.localQwen.seedHelper")}
          </p>
        </div>

        <Slider
          label={t("ai.localQwen.repeatPenalty")}
          value={config.repeatPenalty}
          onChange={handleChange('repeatPenalty')}
          min={1}
          max={2}
          step={0.1}
        />

        <FormInput
          label={t("ai.localQwen.repeatLastN")}
          type="number"
          value={config.repeatLastN.toString()}
          onChange={(e) => handleChange('repeatLastN')(Number(e.target.value))}
          placeholder="64"
        />

        <Switch 
          label={t("ai.localQwen.useThinkingMode")} 
          checked={config.useThinkingMode}
          onChange={(e) => handleChange('useThinkingMode')(e.target.checked)}
        />

        <Switch 
          label={t("ai.localQwen.useGpu")} 
          checked={config.useGpu}
          onChange={(e) => handleChange('useGpu')(e.target.checked)}
        />

        <div className="md:col-span-2">
          <ActiveProviderButton isActive={isActive} onSetActive={onSetActive} />
        </div>
      </div>
    </div>
  );
};

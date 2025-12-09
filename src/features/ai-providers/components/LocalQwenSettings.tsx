import { useState, useEffect } from "react";
import { useTranslation } from "@/shared/i18n";
import { DirectoryInput, FormInput, Slider, Switch } from "@/shared/ui";
import { ActiveProviderButton } from "./ActiveProviderButton";
import { aiProviderService } from "../services/ai-provider.service";

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
  const [contextSize, setContextSize] = useState<number>(4096);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [seed, setSeed] = useState<number>(-1);
  const [repeatPenalty, setRepeatPenalty] = useState<number>(1.1);
  const [repeatLastN, setRepeatLastN] = useState<number>(64);
  const [useThinkingMode, setUseThinkingMode] = useState<boolean>(false);
  const [useGpu, setUseGpu] = useState<boolean>(true);

  // Load config on mount
  useEffect(() => {
    const config = aiProviderService.getLocalQwenConfig();
    setModelPath(config.modelPath);
    setContextSize(config.contextSize);
    setTemperature(config.temperature);
    setSeed(config.seed);
    setRepeatPenalty(config.repeatPenalty);
    setRepeatLastN(config.repeatLastN);
    setUseThinkingMode(config.useThinkingMode);
    setUseGpu(config.useGpu);
  }, []);

  // Update config when values change
  const updateConfig = () => {
    aiProviderService.setLocalQwenConfig({
      modelPath,
      contextSize,
      temperature,
      seed,
      repeatPenalty,
      repeatLastN,
      useThinkingMode,
      useGpu,
    });
  };

  useEffect(() => {
    updateConfig();
  }, [modelPath, contextSize, temperature, seed, repeatPenalty, repeatLastN, useThinkingMode, useGpu]);

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t("ai.localQwen.title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DirectoryInput
          label={t("ai.localQwen.modelPath")}
          value={modelPath}
          onChange={setModelPath}
          placeholder={t("ai.localQwen.modelPath")}
        />

        <FormInput
          label={t("ai.localQwen.contextSize")}
          type="number"
          value={contextSize.toString()}
          onChange={(e) => setContextSize(Number(e.target.value))}
          placeholder="4096"
        />

        <Slider
          label={t("ai.localQwen.temperature")}
          value={temperature}
          onChange={setTemperature}
          min={0}
          max={2}
          step={0.1}
        />

        <div>
          <FormInput
            label={t("ai.localQwen.seed")}
            type="number"
            value={seed.toString()}
            onChange={(e) => setSeed(Number(e.target.value))}
            placeholder="-1"
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
        />

        <FormInput
          label={t("ai.localQwen.repeatLastN")}
          type="number"
          value={repeatLastN.toString()}
          onChange={(e) => setRepeatLastN(Number(e.target.value))}
          placeholder="64"
        />

        <Switch 
          label={t("ai.localQwen.useThinkingMode")} 
          checked={useThinkingMode}
          onChange={(e) => setUseThinkingMode(e.target.checked)}
        />

        <Switch 
          label={t("ai.localQwen.useGpu")} 
          checked={useGpu}
          onChange={(e) => setUseGpu(e.target.checked)}
        />

        <div className="md:col-span-2">
          <ActiveProviderButton isActive={isActive} onSetActive={onSetActive} />
        </div>
      </div>
    </div>
  );
};

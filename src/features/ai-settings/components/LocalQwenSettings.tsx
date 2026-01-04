import { useCallback, useState } from "react";
import { useTranslation } from "@/shared/i18n";
import { DirectoryInput, FormInput, Slider, Switch, Select, FieldError } from "@/shared/ui";
import { ActiveProviderButton } from "./ActiveProviderButton";
import { useQwenModels } from "../hooks/useQwenModels";
import { useFormValidation } from "../hooks/useFormValidation";
import { localQwenConfigSchema } from "../validation";
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
  const [dismissedError, setDismissedError] = useState(false);
  const { errors } = useFormValidation(localQwenConfigSchema, config);
  const {
    availableModels,
    downloadedModels,
    isScanning,
    isDownloading,
    downloadProgress,
    error,
    downloadModel,
  } = useQwenModels(config.modelPath);

  const handleChange = useCallback(
    (field: keyof LocalQwenConfig) => (value: string | number | boolean) => {
      onChange({ [field]: value });
    },
    [onChange]
  );

  const handleDownload = useCallback(
    async (modelId: string) => {
      await downloadModel(modelId);
    },
    [downloadModel]
  );

  // Get downloaded model options for select
  const modelOptions = downloadedModels
    .filter((m) => m.is_downloaded)
    .map((m) => ({
      value: m.id,
      label: m.name,
    }));

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        {t("ai.localQwen.title")}
      </h2>
      
      {/* Base Path Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <DirectoryInput
          label={t("ai.localQwen.basePath")}
          value={config.modelPath}
          onChange={handleChange('modelPath')}
          placeholder={t("ai.localQwen.basePath")}
        />
        <FieldError error={errors.modelPath} />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
          {t("ai.localQwen.basePathHelper")}
        </p>
      </div>

      {/* Empty State - No Path Selected */}
      {!config.modelPath && (
        <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 p-8">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-blue-400 dark:text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t("ai.localQwen.selectPathFirst")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("ai.localQwen.selectPathDescription")}
            </p>
          </div>
        </div>
      )}

      {/* Model Manager Section */}
      {config.modelPath && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
              </svg>
              {t("ai.localQwen.modelManager")}
            </h3>
            {!isScanning && downloadedModels.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {downloadedModels.filter(m => m.is_downloaded).length} / {availableModels.length} {t("ai.localQwen.downloaded").toLowerCase()}
              </span>
            )}
          </div>

          {/* Scanning indicator */}
          {isScanning && (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-3 border-blue-600 dark:border-blue-400 border-t-transparent dark:border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("ai.localQwen.scanning")}
                </p>
              </div>
            </div>
          )}

          {/* Error display */}
          {error && !dismissedError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 animate-fade-in">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    {error}
                  </p>
                </div>
                <button
                  onClick={() => setDismissedError(true)}
                  className="ml-3 shrink-0 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                  aria-label="Dismiss error"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Available Models List */}
          {!isScanning && (
            <div className="space-y-3">
              {availableModels.map((model) => {
                const downloadedModel = downloadedModels.find((m) => m.id === model.id);
                const isDownloaded = downloadedModel?.is_downloaded || false;
                const isCurrentlyDownloading = isDownloading && downloadProgress !== null;

                return (
                  <div
                    key={model.id}
                    className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white mb-1">
                        {model.name}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        {isDownloaded ? (
                          <>
                            <svg className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {t("ai.localQwen.downloaded")}
                            </span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            {t("ai.localQwen.notDownloaded")}
                          </>
                        )}
                      </div>
                    </div>

                    {!isDownloaded && (
                      <button
                        onClick={() => handleDownload(model.id)}
                        disabled={isCurrentlyDownloading}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                          isCurrentlyDownloading
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        }`}
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        {isCurrentlyDownloading
                          ? t("ai.localQwen.downloading")
                          : t("ai.localQwen.downloadModel")}
                      </button>
                    )}

                    {isDownloaded && (
                      <div className="flex items-center px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {t("ai.localQwen.ready")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Download Progress */}
          {isDownloading && downloadProgress && (
            <div className="mt-4 p-4 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse mr-2" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    {t("ai.localQwen.downloadingFile", { file: downloadProgress.file })}
                  </span>
                </div>
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {downloadProgress.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-900/50 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className="bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${downloadProgress.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300">
                {t("ai.localQwen.downloadProgress", {
                  percentage: downloadProgress.percentage.toFixed(1),
                  downloaded: (downloadProgress.downloaded / 1_048_576).toFixed(2),
                  total: downloadProgress.total
                    ? (downloadProgress.total / 1_048_576).toFixed(2)
                    : "?",
                })}
              </div>
            </div>
          )}

          {/* No models message */}
          {!isScanning && availableModels.length === 0 && (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t("ai.localQwen.noModelsAvailable")}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {t("ai.localQwen.checkCatalog")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Model Selection */}
      {modelOptions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <Select
            label={t("ai.localQwen.selectedModel")}
            value={config.selectedModelId}
            onChange={(value) => value && handleChange('selectedModelId')(value)}
            options={modelOptions}
            placeholder={t("ai.localQwen.selectModel")}
          />
          <FieldError error={errors.selectedModelId} />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
            {t("ai.localQwen.selectedModelHelper")}
          </p>
        </div>
      )}

      {/* Configuration Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          {t("ai.localQwen.configuration")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormInput
              label={t("ai.localQwen.contextSize")}
              type="number"
              value={config.contextSize.toString()}
              onChange={(e) => handleChange('contextSize')(Number(e.target.value))}
              placeholder="16384"
            />
            <FieldError error={errors.contextSize} />
          </div>

          <div>
            <Slider
              label={t("ai.localQwen.temperature")}
              value={config.temperature}
              onChange={handleChange('temperature')}
              min={0}
              max={2}
              step={0.1}
            />
            <FieldError error={errors.temperature} />
          </div>

          <div>
            <FormInput
              label={t("ai.localQwen.seed")}
              type="number"
              value={config.seed.toString()}
              onChange={(e) => handleChange('seed')(Number(e.target.value))}
              placeholder="-1"
            />
            <FieldError error={errors.seed} />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
              {t("ai.localQwen.seedHelper")}
            </p>
          </div>

          <div>
            <Slider
              label={t("ai.localQwen.repeatPenalty")}
              value={config.repeatPenalty}
              onChange={handleChange('repeatPenalty')}
              min={1}
              max={2}
              step={0.1}
            />
            <FieldError error={errors.repeatPenalty} />
          </div>

          <div>
            <FormInput
              label={t("ai.localQwen.repeatLastN")}
              type="number"
              value={config.repeatLastN.toString()}
              onChange={(e) => handleChange('repeatLastN')(Number(e.target.value))}
              placeholder="64"
            />
            <FieldError error={errors.repeatLastN} />
          </div>

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
        </div>
      </div>

      {/* Active Provider Button */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <ActiveProviderButton isActive={isActive} onSetActive={onSetActive} />
      </div>
    </div>
  );
};

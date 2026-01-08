import { useCallback, useState, useMemo, useEffect } from "react";
import { useTranslation } from "@/shared/i18n";
import { DirectoryInput, FormInput, Slider, Switch, Select, FieldError } from "@/shared/ui";
import { HiDatabase, HiChevronDown, HiXCircle, HiX, HiCheckCircle, HiDownload, HiArchive, HiFolder, HiCog } from "react-icons/hi";
import { ActiveProviderButton } from "./ActiveProviderButton";
import { useQwenModels } from "../hooks/useQwenModels";
import { useFormValidation } from "../hooks/useFormValidation";
import { localQwenConfigSchema } from "../validation";
import type { LocalQwenConfig } from "../types";

interface CollapsibleModelManagerProps {
  availableModels: any[];
  downloadedModels: any[];
  isScanning: boolean;
  isDownloading: boolean;
  downloadProgress: any;
  error: string | null;
  dismissedError: boolean;
  onDismissError: () => void;
  onDownload: (modelId: string) => void;
  t: (key: string, params?: any) => string;
}

const CollapsibleModelManager = ({
  availableModels,
  downloadedModels,
  isScanning,
  isDownloading,
  downloadProgress,
  error,
  dismissedError,
  onDismissError,
  onDownload,
  t,
}: CollapsibleModelManagerProps) => {
  // Determine if any models are downloaded
  const hasDownloadedModels = useMemo(
    () => downloadedModels.some((m) => m.is_downloaded),
    [downloadedModels]
  );

  // Collapse by default if models are downloaded, expand if none are downloaded
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Set initial state once models are loaded
  useEffect(() => {
    if (!hasInitialized && downloadedModels.length > 0) {
      setIsExpanded(!hasDownloadedModels);
      setHasInitialized(true);
    }
  }, [downloadedModels, hasDownloadedModels, hasInitialized]);

  // Keep expanded if no models are downloaded
  useEffect(() => {
    if (hasInitialized && !hasDownloadedModels) {
      setIsExpanded(true);
    }
  }, [hasDownloadedModels, hasInitialized]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      {/* Header - Always visible and clickable */}
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-2 transition-all"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? t("ai.localQwen.collapseModels") : t("ai.localQwen.expandModels")}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <HiDatabase className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          {t("ai.localQwen.modelManager")}
        </h3>
        <div className="flex items-center gap-3">
          {!isScanning && downloadedModels.length > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {downloadedModels.filter(m => m.is_downloaded).length} / {availableModels.length} {t("ai.localQwen.downloaded").toLowerCase()}
            </span>
          )}
          {/* Chevron icon */}
          <HiChevronDown
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
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
              <HiXCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  {error}
                </p>
              </div>
              <button
                onClick={onDismissError}
                className="ml-3 shrink-0 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                aria-label="Dismiss error"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Available Models List */}
        {!isScanning && (
          <div className="mt-3 space-y-3">
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
                          <HiCheckCircle className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {t("ai.localQwen.downloaded")}
                          </span>
                        </>
                      ) : (
                        <>
                          <HiDownload className="w-4 h-4 mr-1" />
                          {t("ai.localQwen.notDownloaded")}
                        </>
                      )}
                    </div>
                  </div>

                  {!isDownloaded && (
                    <button
                      onClick={() => onDownload(model.id)}
                      disabled={isCurrentlyDownloading}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                        isCurrentlyDownloading
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                      }`}
                    >
                      <HiDownload className="w-4 h-4 mr-2" />
                      {isCurrentlyDownloading
                        ? t("ai.localQwen.downloading")
                        : t("ai.localQwen.downloadModel")}
                    </button>
                  )}

                  {isDownloaded && (
                    <div className="flex items-center px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                      <HiCheckCircle className="w-4 h-4 mr-1.5" />
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
            <HiArchive className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {t("ai.localQwen.noModelsAvailable")}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t("ai.localQwen.checkCatalog")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

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
            <HiFolder className="mx-auto h-12 w-12 text-blue-400 dark:text-blue-500 mb-4" />
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
        <CollapsibleModelManager
          availableModels={availableModels}
          downloadedModels={downloadedModels}
          isScanning={isScanning}
          isDownloading={isDownloading}
          downloadProgress={downloadProgress}
          error={error}
          dismissedError={dismissedError}
          onDismissError={() => setDismissedError(true)}
          onDownload={handleDownload}
          t={t}
        />
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
          <HiCog className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
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

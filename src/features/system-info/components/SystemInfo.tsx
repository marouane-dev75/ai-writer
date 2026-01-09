import { useTranslation } from "@/shared/i18n";
import { HiCpuChip, HiCircleStack, HiServerStack, HiComputerDesktop } from "react-icons/hi2";
import { useSystemInfo } from "../hooks/useSystemInfo";
import type { SystemInfoService } from "../services/system-info.service";

interface SystemInfoProps {
  service: SystemInfoService;
}

export const SystemInfo = ({ service }: SystemInfoProps) => {
  const { t } = useTranslation();
  const { systemInfo, isLoading, error } = useSystemInfo(service);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('systemInfo.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !systemInfo) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('systemInfo.title')}
        </h2>
        <p className="text-red-600 dark:text-red-400">
          {error || t('systemInfo.failedToLoad')}
        </p>
      </div>
    );
  }

  const formatMemory = (gb: number) => `${gb.toFixed(2)} GB`;
  const formatDisk = (gb: number) => `${gb.toFixed(2)} GB`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('systemInfo.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {t('systemInfo.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CPU Information */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="shrink-0">
            <HiCpuChip className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t('systemInfo.cpu')}
            </h3>
            <p className="text-sm text-gray-900 dark:text-white font-medium truncate" title={systemInfo.cpuName}>
              {systemInfo.cpuName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('systemInfo.cores', { count: systemInfo.cpuCores })}
            </p>
          </div>
        </div>

        {/* Memory Information */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="shrink-0">
            <HiCircleStack className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t('systemInfo.memory')}
            </h3>
            <p className="text-sm text-gray-900 dark:text-white font-medium">
              {formatMemory(systemInfo.totalMemoryGb)} {t('systemInfo.total')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatMemory(systemInfo.availableMemoryGb)} {t('systemInfo.available')}
            </p>
          </div>
        </div>

        {/* GPU Information */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="shrink-0">
            <HiComputerDesktop className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t('systemInfo.gpu')}
            </h3>
            {systemInfo.gpuInfo.map((gpu, index) => (
              <p 
                key={index} 
                className="text-sm text-gray-900 dark:text-white font-medium truncate" 
                title={gpu}
              >
                {gpu}
              </p>
            ))}
          </div>
        </div>

        {/* Disk Information */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="shrink-0">
            <HiServerStack className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t('systemInfo.disk')}
            </h3>
            <p className="text-sm text-gray-900 dark:text-white font-medium">
              {formatDisk(systemInfo.totalDiskGb)} {t('systemInfo.total')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDisk(systemInfo.availableDiskGb)} {t('systemInfo.available')}
            </p>
          </div>
        </div>

        {/* OS Information */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg md:col-span-2">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {t('systemInfo.os')}
              </h3>
              <p className="text-sm text-gray-900 dark:text-white font-medium">
                {systemInfo.osName} {systemInfo.osVersion} {systemInfo.architecture}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useTheme } from "../features/theme";
import { useTranslation } from "../features/i18n/contexts";

export const SettingsPage = () => {
  const { isDarkMode } = useTheme();
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

      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {t('settings.appearance')}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {t('settings.themeMode')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t('settings.currentTheme')}: {isDarkMode ? t('settings.dark') : t('settings.light')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {t('settings.useToggle')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {t('settings.actions')}
        </h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
            {t('settings.saveSettings')}
          </button>
          <button className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200">
            {t('settings.resetDefaults')}
          </button>
          <button className="px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
            {t('settings.clearData')}
          </button>
        </div>
      </div>
    </>
  );
};

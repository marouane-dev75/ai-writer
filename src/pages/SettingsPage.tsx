import { useTheme } from "../theme";

export const SettingsPage = () => {
  const { isDarkMode } = useTheme();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Configure your application preferences
        </p>
      </div>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Appearance
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Theme Mode
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Current theme: {isDarkMode ? "Dark" : "Light"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Use the toggle in the navigation bar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Application Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Application
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">
              Language
            </label>
            <select className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              <option selected>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Save Settings
          </button>
          <button className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200">
            Reset to Defaults
          </button>
          <button className="px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
            Clear All Data
          </button>
        </div>
      </div>
    </>
  );
};

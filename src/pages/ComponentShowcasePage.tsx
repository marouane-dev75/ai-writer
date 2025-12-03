import { useTranslation } from "@/shared/i18n";
import { LoadingSpinner } from "@/shared/ui";

export const ComponentShowcasePage = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Card 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-xl font-bold">1</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {t("showcase.card1.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t("showcase.card1.description")}
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-xl font-bold">2</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {t("showcase.card2.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t("showcase.card2.description")}
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-xl font-bold">3</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {t("showcase.card3.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t("showcase.card3.description")}
          </p>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {t("showcase.buttons.title")}
        </h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
            {t("showcase.buttons.primary")}
          </button>
          <button className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200">
            {t("showcase.buttons.secondary")}
          </button>
          <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200">
            {t("showcase.buttons.success")}
          </button>
          <button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200">
            {t("showcase.buttons.danger")}
          </button>
          <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200">
            {t("showcase.buttons.outline")}
          </button>
        </div>
      </div>

      {/* Typography Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {t("showcase.typography.title")}
        </h2>
        <div className="space-y-4">
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {t("showcase.typography.extraLarge")}
          </p>
          <p className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
            {t("showcase.typography.large")}
          </p>
          <p className="text-2xl font-medium text-gray-700 dark:text-gray-200">
            {t("showcase.typography.medium")}
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("showcase.typography.regular")}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("showcase.typography.small")}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t("showcase.typography.extraSmall")}
          </p>
        </div>
      </div>

      {/* Badges and Tags */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {t("showcase.badges.title")}
        </h2>
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            {t("showcase.badges.primary")}
          </span>
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            {t("showcase.badges.success")}
          </span>
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
            {t("showcase.badges.warning")}
          </span>
          <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
            {t("showcase.badges.danger")}
          </span>
          <span className="px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full text-sm font-semibold">
            {t("showcase.badges.info")}
          </span>
          <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
            {t("showcase.badges.secondary")}
          </span>
        </div>
      </div>

      {/* Loading Spinners */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {t("showcase.loading.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t("showcase.loading.description")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Small Spinner */}
          <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <LoadingSpinner size="small" className="min-h-0" />
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
              {t("showcase.loading.small")}
            </p>
          </div>

          {/* Medium Spinner */}
          <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <LoadingSpinner size="medium" className="min-h-0" />
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
              {t("showcase.loading.medium")}
            </p>
          </div>

          {/* Large Spinner */}
          <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <LoadingSpinner size="large" className="min-h-0" />
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
              {t("showcase.loading.large")}
            </p>
          </div>

          {/* Spinner with Text */}
          <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <LoadingSpinner
              size="medium"
              text={t("showcase.loading.withText")}
              className="min-h-0"
            />
          </div>
        </div>
      </div>
    </>
  );
};

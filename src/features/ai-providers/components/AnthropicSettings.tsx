import { useTranslation } from "@/shared/i18n";

export const AnthropicSettings = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t('ai.anthropic.title')}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('ai.anthropic.apiKey')}
          </label>
          <input
            type="password"
            disabled
            placeholder={t('ai.comingSoon')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('ai.anthropic.model')}
          </label>
          <input
            type="text"
            disabled
            placeholder={t('ai.comingSoon')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('ai.anthropic.maxTokens')}
          </label>
          <input
            type="number"
            disabled
            placeholder={t('ai.comingSoon')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

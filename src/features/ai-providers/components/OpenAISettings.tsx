import { useTranslation } from "@/shared/i18n";
import { FormInput } from "@/shared/ui";

export const OpenAISettings = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8 relative animate-fade-in">
      {/* Coming Soon Badge */}
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {t('ai.comingSoon')}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t('ai.openai.title')}
      </h2>
      <div className="space-y-4">
        <FormInput
          label={t('ai.openai.apiKey')}
          type="password"
          disabled
          placeholder={t('ai.comingSoon')}
        />
        <FormInput
          label={t('ai.openai.model')}
          type="text"
          disabled
          placeholder={t('ai.comingSoon')}
        />
        <FormInput
          label={t('ai.openai.temperature')}
          type="number"
          disabled
          placeholder={t('ai.comingSoon')}
          step="0.1"
        />
        <FormInput
          label={t('ai.openai.maxTokens')}
          type="number"
          disabled
          placeholder={t('ai.comingSoon')}
        />
      </div>
    </div>
  );
};

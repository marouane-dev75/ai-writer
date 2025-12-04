import { useTranslation } from "@/shared/i18n";
import { FormInput } from "@/shared/ui";

export const LocalQwenSettings = () => {
  const { t } = useTranslation();

  return (
    <div className="relative animate-fade-in">
      {/* Coming Soon Badge */}
      <div className="absolute top-0 right-0">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {t('ai.comingSoon')}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t('ai.localQwen.title')}
      </h2>
      <div className="space-y-4">
        <FormInput
          label={t('ai.localQwen.modelPath')}
          type="text"
          disabled
          placeholder={t('ai.comingSoon')}
        />
        <FormInput
          label={t('ai.localQwen.contextSize')}
          type="number"
          disabled
          placeholder={t('ai.comingSoon')}
        />
        <FormInput
          label={t('ai.localQwen.temperature')}
          type="number"
          disabled
          placeholder={t('ai.comingSoon')}
          step="0.1"
        />
      </div>
    </div>
  );
};

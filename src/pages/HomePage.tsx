import { useTranslation } from "@/common/i18n";

export const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {t('home.welcome')}
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('home.description')}
      </p>
    </div>
  );
};

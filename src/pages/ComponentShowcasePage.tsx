import { useTranslation } from "@/shared/i18n";
import { Button, LoadingSpinner } from "@/shared/ui";

export const ComponentShowcasePage = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Buttons Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {t("showcase.buttons.title")}
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">
            {t("showcase.buttons.primary")}
          </Button>
          <Button variant="secondary">
            {t("showcase.buttons.secondary")}
          </Button>
          <Button variant="success">
            {t("showcase.buttons.success")}
          </Button>
          <Button variant="danger">
            {t("showcase.buttons.danger")}
          </Button>
          <Button variant="outline">
            {t("showcase.buttons.outline")}
          </Button>
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

import { Link } from "react-router";
import { useTranslation } from "@/shared/i18n";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="text-center space-y-3">
          <p className="text-gray-300 text-lg font-medium">
            {t('footer.description')}
          </p>
          <p className="text-gray-400 text-sm">
            {t('footer.techStack')}
          </p>
          <p className="text-gray-500 text-sm">
            {t('footer.copyright')}
          </p>
        </div>

        {/* Developer Tools Link */}
        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
          <Link
            to="/showcase"
            className="text-gray-500 hover:text-gray-300 text-xs transition-colors duration-200 inline-block"
          >
            {t('footer.developerTools')}
          </Link>
        </div>
      </div>
    </footer>
  );
};

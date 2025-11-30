import { NavLink } from "../../../common/ui";
import { useTheme } from "..";
import { useTranslation } from "../../i18n/contexts";
import { LanguageSelector } from "../../i18n/LanguageSelector";
import { DarkModeToggle } from "../DarkModeToggle";

export const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('app.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {t('app.subtitle')}
            </p>
          </div>
          
          <nav className="flex items-center gap-6">
            <NavLink to="/">{t('nav.home')}</NavLink>
            <NavLink to="/showcase">{t('nav.components')}</NavLink>
            <NavLink to="/settings">{t('nav.settings')}</NavLink>
            <NavLink to="/logs">{t('nav.logs')}</NavLink>
            <LanguageSelector />
            <DarkModeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </nav>
        </div>
      </div>
    </header>
  );
};

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { configLocaleStorage } from '../ConfigLocaleStorage';

interface I18nContextType {
  language: string;
  changeLanguage: (lng: string) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const { t, i18n } = useI18nTranslation();
  const [isInitialized, setIsInitialized] = useState(false);

  // Load language from backend on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const locale = await configLocaleStorage.loadLocale();
        await i18n.changeLanguage(locale.language);
      } catch (error) {
        console.error('Failed to load language from backend:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadLanguage();
  }, [i18n]);

  const changeLanguage = useCallback(async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      await configLocaleStorage.saveLocale({ language: lng });
    } catch (error) {
      console.error('Failed to save language to backend:', error);
    }
  }, [i18n]);

  const value = {
    language: i18n.language,
    changeLanguage,
    t,
  };

  // Don't render children until language is loaded from backend
  if (!isInitialized) {
    return null;
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

I18nProvider.displayName = 'I18nProvider';

export const useTranslation = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};

import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import type { LocaleStorage } from '../types';

interface I18nContextType {
  language: string;
  changeLanguage: (lng: string) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
  storage: LocaleStorage; // Dependency injection (DIP)
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children, storage }) => {
  const { t, i18n } = useI18nTranslation();

  // Load saved language on mount
  useEffect(() => {
    storage.loadLocale()
      .then(locale => i18n.changeLanguage(locale.language))
      .catch(error => console.error('Failed to load language:', error));
  }, [i18n, storage]);

  const changeLanguage = useCallback((lng: string) => {
    i18n.changeLanguage(lng);
    storage.saveLocale({ language: lng })
      .catch(error => console.error('Failed to save language:', error));
  }, [i18n, storage]);

  const value = {
    language: i18n.language,
    changeLanguage,
    t,
  };

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

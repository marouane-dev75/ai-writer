import React, { createContext, useContext, useCallback } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';

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

  const changeLanguage = useCallback((lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  }, [i18n]);

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

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en';
import frTranslation from './locales/fr';

const resources = {
  en: {
    translation: enTranslation,
  },
  fr: {
    translation: frTranslation,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language, will be updated by I18nProvider from backend
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

// Export context and hooks
export { I18nProvider, useTranslation } from './contexts';

// Export UI components
export { LanguageSelector } from './ui/LanguageSelector';

// Export interfaces and types (for DIP compliance)
export type { LocaleStorage } from './LocaleStorage.interface';
export type { LocaleConfig } from './types';

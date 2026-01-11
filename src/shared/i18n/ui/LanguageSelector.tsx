import React, { useState, useRef, useEffect } from 'react';
import { IoChevronDown, IoCheckmark } from 'react-icons/io5';
import Flag from 'react-country-flag';
import { useTranslation } from '../contexts';

interface Language {
  code: string;
  label: string;
  countryCode: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', label: 'English', countryCode: 'GB' },
  { code: 'fr', label: 'Français', countryCode: 'FR' },
];

export const LanguageSelector: React.FC = () => {
  const { language, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = LANGUAGES.find((lang) => lang.code === language) || LANGUAGES[0];

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLanguageSelect = (langCode: string) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  const buttonClass = "flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500";
  const menuClass = "absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50";

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={buttonClass} aria-expanded={isOpen}>
        <Flag countryCode={currentLanguage.countryCode} style={{ width: '1.25rem', height: '1.25rem' }} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {currentLanguage.label}
        </span>
        <IoChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={menuClass}>
          <div className="py-1">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              const itemClass = `w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`;

              return (
                <button key={lang.code} onClick={() => handleLanguageSelect(lang.code)} className={itemClass}>
                  <Flag countryCode={lang.countryCode} style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span className="font-medium">{lang.label}</span>
                  {isSelected && <IoCheckmark className="ml-auto w-4 h-4 text-blue-600 dark:text-blue-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

LanguageSelector.displayName = 'LanguageSelector';

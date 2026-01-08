import React from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { useTranslation } from '@/shared/i18n';

interface DirectoryInputProps {
  label: string;
  value?: string;
  onChange?: (path: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const DirectoryInput: React.FC<DirectoryInputProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  placeholder,
  className = '',
}) => {
  const { t } = useTranslation();

  const handleBrowse = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: label,
      });

      if (selected && typeof selected === 'string') {
        onChange?.(selected);
      }
    } catch (error) {
      console.error('Failed to open directory dialog:', error);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value || ''}
          readOnly
          disabled={disabled}
          placeholder={placeholder}
          className={`flex-1 px-4 py-2 border rounded-lg transition-colors duration-200 ${
            disabled
              ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-default'
          }`}
        />
        <button
          type="button"
          onClick={handleBrowse}
          disabled={disabled}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            disabled
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {t('common.browse')}
        </button>
      </div>
    </div>
  );
};

DirectoryInput.displayName = 'DirectoryInput';

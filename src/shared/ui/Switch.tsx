import React from 'react';

interface SwitchProps {
  label: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  helperText?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  helperText,
}) => {
  return (
    <div className={className}>
      <label className="flex items-center justify-between cursor-pointer">
        <span className={`text-sm font-medium ${
          disabled
            ? 'text-gray-500 dark:text-gray-400'
            : 'text-gray-700 dark:text-gray-300'
        }`}>
          {label}
        </span>
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
          />
          <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
            disabled
              ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
              : checked
                ? 'bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500'
                : 'bg-gray-300 dark:bg-gray-600 peer-focus:ring-2 peer-focus:ring-gray-400'
          }`}>
            <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform duration-200 ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </div>
        </div>
      </label>
      {helperText && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

Switch.displayName = 'Switch';

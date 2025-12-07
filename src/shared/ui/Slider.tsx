import React from 'react';

interface SliderProps {
  label: string;
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  showValue?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 0.1,
  disabled = false,
  className = '',
  showValue = true,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange?.(newValue);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <label className={`block text-sm font-medium ${
          disabled
            ? 'text-gray-500 dark:text-gray-400'
            : 'text-gray-700 dark:text-gray-300'
        }`}>
          {label}
        </label>
        {showValue && (
          <span className={`text-sm font-medium ${
            disabled
              ? 'text-gray-500 dark:text-gray-400'
              : 'text-gray-900 dark:text-white'
          }`}>
            {value.toFixed(step < 1 ? 1 : 0)}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-opacity duration-200 ${
          disabled
            ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50'
            : 'bg-gray-300 dark:bg-gray-600'
        } 
        [&::-webkit-slider-thumb]:appearance-none 
        [&::-webkit-slider-thumb]:w-4 
        [&::-webkit-slider-thumb]:h-4 
        [&::-webkit-slider-thumb]:rounded-full 
        [&::-webkit-slider-thumb]:bg-blue-600 
        [&::-webkit-slider-thumb]:cursor-pointer
        ${!disabled ? '[&::-webkit-slider-thumb]:hover:bg-blue-700' : '[&::-webkit-slider-thumb]:cursor-not-allowed'}
        [&::-moz-range-thumb]:w-4 
        [&::-moz-range-thumb]:h-4 
        [&::-moz-range-thumb]:rounded-full 
        [&::-moz-range-thumb]:bg-blue-600 
        [&::-moz-range-thumb]:border-0
        [&::-moz-range-thumb]:cursor-pointer
        ${!disabled ? '[&::-moz-range-thumb]:hover:bg-blue-700' : '[&::-moz-range-thumb]:cursor-not-allowed'}
        `}
      />
    </div>
  );
};

Slider.displayName = 'Slider';

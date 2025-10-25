import React, {SelectHTMLAttributes} from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    error?: string;
}

export const Select: React.FC<SelectProps> = ({
                                                  label,
                                                  options,
                                                  error,
                                                  className = '',
                                                  ...props
                                              }) => {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <select
                className={`
          px-4 py-3 rounded-xl
          bg-white dark:bg-gray-800
          border-2 border-gray-200 dark:border-gray-700
          text-gray-900 dark:text-white
          focus:border-primary focus:ring-2 focus:ring-primary/20
          transition-all duration-200
          cursor-pointer
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <span className="text-sm text-red-500">{error}</span>
            )}
        </div>
    );
};

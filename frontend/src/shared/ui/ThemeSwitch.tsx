import React from 'react';
import {useTheme} from '@/theme/ThemeProvider';

type Theme = 'system' | 'light' | 'dark';

interface ThemeOption {
    value: Theme;
    label: string;
    icon: React.ReactNode;
}

export const ThemeSwitch: React.FC = () => {
    const {theme, setTheme} = useTheme();

    const themes: ThemeOption[] = [
        {
            value: 'light',
            label: 'Светлая',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
            ),
        },
        {
            value: 'system',
            label: 'Системная',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
        {
            value: 'dark',
            label: 'Темная',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <div
            className="inline-flex items-center bg-surface-light dark:bg-surface-dark rounded-xl p-1 shadow-md border border-gray-200 dark:border-gray-700">
            {themes.map((themeOption) => (
                <button
                    key={themeOption.value}
                    onClick={() => setTheme(themeOption.value)}
                    className={`
            relative px-4 py-2 rounded-lg transition-all duration-300 ease-in-out
            flex items-center gap-2 text-sm font-medium
            ${theme === themeOption.value
                        ? 'bg-primary-500 text-white shadow-lg scale-105'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
          `}
                    aria-label={`Переключить на ${themeOption.label} тему`}
                    title={themeOption.label}
                >
                    {themeOption.icon}
                    <span className="hidden sm:inline">{themeOption.label}</span>

                    {theme === themeOption.value && (
                        <span className="absolute inset-0 rounded-lg bg-primary-500 opacity-20 animate-pulse-slow"/>
                    )}
                </button>
            ))}
        </div>
    );
};

import React, {createContext, useContext, useEffect, useState} from 'react';

type Theme = 'system' | 'light' | 'dark';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const stored = localStorage.getItem('textropy-theme') as Theme;
        return stored || 'system';
    });

    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

    // Определяем системную тему
    const getSystemTheme = (): ResolvedTheme => {
        if (typeof window === 'undefined') return 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Обновляем resolved theme
    useEffect(() => {
        const updateResolvedTheme = () => {
            const newResolvedTheme = theme === 'system' ? getSystemTheme() : theme;
            setResolvedTheme(newResolvedTheme);

            // Применяем класс к документу
            const root = document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(newResolvedTheme);
        };

        updateResolvedTheme();

        // Слушаем изменения системной темы
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = () => updateResolvedTheme();

            // Современный способ
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        }
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('textropy-theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{theme, resolvedTheme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getAutomaticTheme = (): Theme => {
    const hour = new Date().getHours();

    // Dark mode from 6:00 PM until 5:59 AM
    return hour >= 18 || hour < 6 ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('society_theme');
        const manualOverride = localStorage.getItem('society_theme_manual');

        // If the user has manually selected a theme,
        // respect that choice.
        if (
            manualOverride === 'true' &&
            (savedTheme === 'light' || savedTheme === 'dark')
        ) {
            return savedTheme;
        }

        // Otherwise use automatic time-based theme.
        return getAutomaticTheme();
    });

    useEffect(() => {
        const root = window.document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        localStorage.setItem('society_theme', theme);
    }, [theme]);

    // Check the time periodically so the theme can automatically
    // change when 6 PM or 6 AM is reached.
    useEffect(() => {
        const checkAutomaticTheme = () => {
            const manualOverride =
                localStorage.getItem('society_theme_manual');

            // Don't automatically change the theme if
            // the user has manually selected one.
            if (manualOverride === 'true') {
                return;
            }

            const automaticTheme = getAutomaticTheme();

            setThemeState((currentTheme) => {
                if (currentTheme !== automaticTheme) {
                    return automaticTheme;
                }

                return currentTheme;
            });
        };

        // Check every minute.
        const interval = window.setInterval(
            checkAutomaticTheme,
            60 * 1000
        );

        return () => {
            window.clearInterval(interval);
        };
    }, []);

    const toggleTheme = () => {
        setThemeState((previousTheme) => {
            const newTheme =
                previousTheme === 'light' ? 'dark' : 'light';

            // User manually selected a theme.
            localStorage.setItem('society_theme_manual', 'true');

            return newTheme;
        });
    };

    const setTheme = (newTheme: Theme) => {
        // Explicitly setting the theme is also considered
        // a manual choice.
        localStorage.setItem('society_theme_manual', 'true');
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                setTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            'useTheme must be used within a ThemeProvider'
        );
    }

    return context;
};
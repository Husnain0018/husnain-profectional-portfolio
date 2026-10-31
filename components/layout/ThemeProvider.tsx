'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const queryTheme = params?.get('theme') as Theme | null;
    const saved = typeof window !== 'undefined' ? localStorage.getItem('ali_portfolio_theme') as Theme | null : null;
    const initial = (queryTheme === 'light' || queryTheme === 'dark')
      ? queryTheme
      : (saved === 'light' || saved === 'dark' ? saved : defaultTheme);
    setThemeState(initial);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, [defaultTheme]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    localStorage.setItem('ali_portfolio_theme', next);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

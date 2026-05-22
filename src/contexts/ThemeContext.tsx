'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeColor = 'green' | 'red' | 'yellow' | 'blue' | 'orange';

interface ThemeContextType {
  currentTheme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  getThemeColor: (theme: ThemeColor) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const getThemeColor = (theme: ThemeColor) => {
  return 'var(--primary)';
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>('red');

  useEffect(() => {
    const handleThemeChange = (event: CustomEvent<ThemeColor>) => {
      setCurrentTheme(event.detail);
    };

    window.addEventListener('themeChange', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('themeChange', handleThemeChange as EventListener);
    };
  }, []);

  const setTheme = (theme: ThemeColor) => {
    setCurrentTheme(theme);
    window.dispatchEvent(new CustomEvent('themeChange', { detail: theme }));
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        getThemeColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}; 
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
  switch (theme) {
    case 'green':
      return '#22c55e';
    case 'red':
      return '#ef4444';
    case 'yellow':
      return '#eab308';
    case 'blue':
      return '#3b82f6';
    case 'orange':
      return '#f97316';
    default:
      return '#22c55e';
  }
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>('green');

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
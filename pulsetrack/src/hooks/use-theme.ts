import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast";

type ThemeType = 'green' | 'red' | 'orange';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('orange');

  const changeTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
    
    // Here you could potentially save the theme preference to localStorage
    localStorage.setItem('pulsetrack-theme', theme);
    
    // Notify user about theme change
    toast({
      title: "Theme Changed",
      description: `Theme switched to ${theme}`,
      duration: 2000,
    });
  };

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('pulsetrack-theme') as ThemeType | null;
    if (savedTheme && ['green', 'red', 'orange'].includes(savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  return { currentTheme, changeTheme };
};
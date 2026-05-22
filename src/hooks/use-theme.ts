import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import storage from '@/lib/storage';

type ThemeType = 'green' | 'red' | 'orange';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('orange');

  const changeTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
    storage.setItem('apex-theme', theme);
    toast({
      title: "Theme Changed",
      description: `Theme switched to ${theme}`,
      duration: 2000,
    });
  };

  useEffect(() => {
    const savedTheme = storage.getItem('apex-theme') as ThemeType | null;
    if (savedTheme && ['green', 'red', 'orange'].includes(savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  return { currentTheme, changeTheme };
};
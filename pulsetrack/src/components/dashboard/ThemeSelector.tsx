import React from 'react';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

type ThemeColor = 'green' | 'red' | 'yellow' | 'blue' | 'orange';

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = React.useState<ThemeColor>('green');

  const handleThemeChange = (theme: ThemeColor) => {
    setCurrentTheme(theme);
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themeChange', { detail: theme }));
  };

  const getThemeColor = (theme: ThemeColor) => {
    switch (theme) {
      case 'green':
        return 'bg-green-500';
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-yellow-400';
      case 'blue':
        return 'bg-blue-500';
      case 'orange':
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <Palette className="w-6 h-6" />
        <span className='text-md font-semibold'>Themes</span>
      </div>
      <div className="flex gap-3">
        <Button
          className={`theme-button w-10 h-10 p-0 hover:bg-gray-100 ${currentTheme === 'green' ? 'bg-gray-100' : ''}`}
          variant="outline"
          onClick={() => handleThemeChange('green')}
        >
          <div className="w-6 h-6 rounded-full bg-green-500" />
        </Button>
        <Button 
          className={`theme-button w-10 h-10 p-0 hover:bg-gray-100 ${currentTheme === 'red' ? 'bg-gray-100' : ''}`}
          variant="outline"
          onClick={() => handleThemeChange('red')}
        >
          <div className="w-6 h-6 rounded-full bg-red-500" />
        </Button>
        <Button
          className={`theme-button w-10 h-10 p-0 hover:bg-gray-100 ${currentTheme === 'orange' ? 'bg-gray-100' : ''}`}
          variant="outline"
          onClick={() => handleThemeChange('orange')}
        >
          <div className="w-6 h-6 rounded-full bg-orange-500" />
        </Button>
        <Button
          className={`theme-button w-10 h-10 p-0 hover:bg-gray-100 ${currentTheme === 'blue' ? 'bg-gray-100' : ''}`}
          variant="outline"
          onClick={() => handleThemeChange('blue')}
        >
          <div className="w-6 h-6 rounded-full bg-blue-500" />
        </Button>
        <Button
          className={`theme-button w-10 h-10 p-0 hover:bg-gray-100 ${currentTheme === 'yellow' ? 'bg-gray-100' : ''}`}
          variant="outline"
          onClick={() => handleThemeChange('yellow')}
        >
          <div className="w-6 h-6 rounded-full bg-yellow-400" />
        </Button>
      </div>
    </div>
  );
}
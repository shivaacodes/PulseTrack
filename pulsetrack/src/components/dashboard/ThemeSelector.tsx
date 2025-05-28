import React from 'react';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

type ThemeColor = 'green' | 'red' | 'yellow' | 'blue' | 'orange';

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = React.useState<ThemeColor>('green');

  const handleThemeChange = (theme: ThemeColor) => {
    setCurrentTheme(theme);
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
    <div className="flex items-center gap-1 md:gap-4">
      <div className="text-sm text-muted-foreground flex items-center gap-1 md:gap-2">
        <Palette className="w-5 h-5 md:w-6 md:h-6" />
        <span className='hidden md:inline text-md font-semibold'>Themes</span>
      </div>
      <div className="flex gap-1.5 md:gap-3">
        <Button
          className={`theme-button w-8 h-8 md:w-10 md:h-10 p-0 hover:bg-muted ${currentTheme === 'green' ? 'bg-muted' : ''}`}
          variant="outline"
          onClick={() => handleThemeChange('green')}
        >
          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-500" />
        </Button>
        <Button 
          className={`theme-button w-8 h-8 md:w-10 md:h-10 p-0 hover:bg-muted ${currentTheme === 'red' ? 'bg-muted' : ''}`}
          variant="outline"
          onClick={() => handleThemeChange('red')}
        >
          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500" />
        </Button>
        <Button
          className={`theme-button w-8 h-8 md:w-10 md:h-10 p-0 hover:bg-muted ${currentTheme === 'blue' ? 'bg-muted' : ''}`}
          variant="outline"
          onClick={() => handleThemeChange('blue')}
        >
          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-500" />
        </Button>
        <Button
          className={`hidden md:flex theme-button w-10 h-10 p-0 hover:bg-muted ${currentTheme === 'orange' ? 'bg-muted' : ''}`}
          variant="outline"
          onClick={() => handleThemeChange('orange')}
        >
          <div className="w-6 h-6 rounded-full bg-orange-500" />
        </Button>
        <Button
          className={`hidden md:flex theme-button w-10 h-10 p-0 hover:bg-muted ${currentTheme === 'yellow' ? 'bg-muted' : ''}`}
          variant="outline"
          onClick={() => handleThemeChange('yellow')}
        >
          <div className="w-6 h-6 rounded-full bg-yellow-400" />
        </Button>
      </div>
    </div>
  );
}
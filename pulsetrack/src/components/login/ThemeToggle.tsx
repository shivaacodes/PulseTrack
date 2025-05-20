"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // In a real app, you would implement actual theme switching here
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // This is just a placeholder for demonstration
    // In a real app, you'd update document.documentElement.classList or use a theme context
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={toggleTheme}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-yellow-300" />
      ) : (
        <Moon className="h-5 w-5 text-blue-300" />
      )}
    </Button>
  );
};

export default ThemeToggle;

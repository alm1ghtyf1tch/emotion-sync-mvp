import React, { createContext, useContext, useEffect, useState } from 'react';

export type MoodTheme = 'default' | 'great' | 'good' | 'okay' | 'low' | 'struggling';

interface ThemeContextType {
  currentTheme: MoodTheme;
  setTheme: (theme: MoodTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<MoodTheme>('default');

  const setTheme = (theme: MoodTheme) => {
    setCurrentTheme(theme);
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  };

  useEffect(() => {
    // Apply initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const value = {
    currentTheme,
    setTheme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
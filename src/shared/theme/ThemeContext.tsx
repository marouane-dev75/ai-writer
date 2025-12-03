import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ThemeStorage } from './service/ThemeStorage.interface';
import "./theme.css";
import { LoadingSpinner } from '@/shared/ui';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  storage: ThemeStorage; // Dependency injection (DIP)
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, storage }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await storage.loadTheme();
        setIsDarkMode(theme.dark_mode);
      } catch (error) {
        console.error('Failed to load theme:', error);
        // Use default value on error
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [storage]);

  // Apply theme to DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    try {
      await storage.saveTheme({ dark_mode: newMode });
    } catch (error) {
      console.error('Failed to save theme:', error);
      // Revert on error
      setIsDarkMode(!newMode);
    }
  };

  const value: ThemeContextType = {
    isDarkMode,
    toggleTheme,
  };

  // Don't render children until theme is loaded
  if (isLoading) {
    return <LoadingSpinner text="Loading theme..." />;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.displayName = 'ThemeProvider';

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

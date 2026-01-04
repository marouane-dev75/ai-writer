import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { AppRestartService } from '../types';

interface AppRestartContextType {
  showRestartPrompt: boolean;
  setShowRestartPrompt: (show: boolean) => void;
  service: AppRestartService;
}

const AppRestartContext = createContext<AppRestartContextType | undefined>(undefined);

interface AppRestartProviderProps {
  children: ReactNode;
  service: AppRestartService; // Dependency injection (DIP)
}

export const AppRestartProvider: React.FC<AppRestartProviderProps> = ({ children, service }) => {
  const [showRestartPrompt, setShowRestartPrompt] = useState(false);

  const value: AppRestartContextType = {
    showRestartPrompt,
    setShowRestartPrompt,
    service,
  };

  return (
    <AppRestartContext.Provider value={value}>
      {children}
    </AppRestartContext.Provider>
  );
};

AppRestartProvider.displayName = 'AppRestartProvider';

/**
 * Hook to control the restart prompt visibility
 * Use this in any component to show/hide the restart prompt
 */
export const useAppRestartPrompt = (): Omit<AppRestartContextType, 'service'> => {
  const context = useContext(AppRestartContext);
  if (context === undefined) {
    throw new Error('useAppRestartPrompt must be used within an AppRestartProvider');
  }
  
  return {
    showRestartPrompt: context.showRestartPrompt,
    setShowRestartPrompt: context.setShowRestartPrompt,
  };
};

/**
 * Internal hook to access the full context including the service
 * Used internally by the RestartPrompt component
 */
export const useAppRestartContext = (): AppRestartContextType => {
  const context = useContext(AppRestartContext);
  if (context === undefined) {
    throw new Error('useAppRestartContext must be used within an AppRestartProvider');
  }
  return context;
};

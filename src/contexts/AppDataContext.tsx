import React, { createContext, useContext, ReactNode } from 'react';
import { useAppData } from '@/hooks/useAppData';

// Infer the return type from the hook
type AppDataContextType = ReturnType<typeof useAppData>;

const AppDataContext = createContext<AppDataContextType | null>(null);

interface AppDataProviderProps {
  children: ReactNode;
}

/**
 * Provider component for AppData context
 * Wraps the application and provides access to all app data and actions
 */
export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const appData = useAppData();
  
  return (
    <AppDataContext.Provider value={appData}>
      {children}
    </AppDataContext.Provider>
  );
};

/**
 * Hook to access AppData context
 * Must be used within AppDataProvider
 * 
 * @example
 * const { data, addAquarium, updateAquarium } = useAppDataContext();
 */
export const useAppDataContext = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  
  if (!context) {
    throw new Error('useAppDataContext must be used within an AppDataProvider');
  }
  
  return context;
};

// Re-export for convenience
export type { AppDataContextType };

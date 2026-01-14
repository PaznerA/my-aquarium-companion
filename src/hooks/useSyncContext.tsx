import React, { createContext, useContext, ReactNode, useCallback, useRef, useEffect } from 'react';
import { useS3Sync } from './useS3Sync';

interface SyncContextType {
  isS3Connected: boolean;
  triggerSync: () => void;
}

const SyncContext = createContext<SyncContextType | null>(null);

export const SyncProvider = ({ children }: { children: ReactNode }) => {
  const s3Sync = useS3Sync();
  
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const triggerSync = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    syncTimeoutRef.current = setTimeout(async () => {
      if (s3Sync.isConnected && s3Sync.autoSyncEnabled) {
        await s3Sync.triggerSync();
      }
    }, 2000);
  }, [s3Sync.isConnected, s3Sync.autoSyncEnabled, s3Sync.triggerSync]);
  
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <SyncContext.Provider value={{
      isS3Connected: s3Sync.isConnected,
      triggerSync,
    }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSyncTrigger = () => {
  const context = useContext(SyncContext);
  if (!context) {
    return { triggerSync: () => {} };
  }
  return { triggerSync: context.triggerSync };
};

import { useState, useEffect, useCallback, useRef } from 'react';
import { exportData, importData } from '@/lib/storage';
import { toast } from 'sonner';

// Extend Window and FileSystemDirectoryHandle interfaces for File System Access API
declare global {
  interface Window {
    showDirectoryPicker?: (options?: {
      mode?: 'read' | 'readwrite';
      startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';
    }) => Promise<FileSystemDirectoryHandle>;
  }
  
  interface FileSystemDirectoryHandle {
    queryPermission(options?: { mode?: 'read' | 'readwrite' }): Promise<PermissionState>;
    requestPermission(options?: { mode?: 'read' | 'readwrite' }): Promise<PermissionState>;
  }
}

const SYNC_INTERVAL = 30000; // 30 seconds
const BACKUP_FILENAME = 'aquarium-journal-backup.json';
const STORAGE_KEY = 'aquarium-journal-sync-settings';

interface FileSyncState {
  isSupported: boolean;
  directoryHandle: FileSystemDirectoryHandle | null;
  lastSyncTime: Date | null;
  isSyncing: boolean;
  autoSyncEnabled: boolean;
  error: string | null;
  permissionState: 'granted' | 'denied' | 'prompt' | null;
}

interface SyncSettings {
  autoSyncEnabled: boolean;
}

const loadSyncSettings = (): SyncSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load sync settings:', e);
  }
  return { autoSyncEnabled: false };
};

const saveSyncSettings = (settings: SyncSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save sync settings:', e);
  }
};

// Check if File System Access API is truly available
const checkFSASupport = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (!('showDirectoryPicker' in window)) return false;
  
  // Check if we're in a secure context (required for FSA)
  if (!window.isSecureContext) {
    console.warn('File System Access API requires secure context (HTTPS)');
    return false;
  }
  
  return true;
};

export const useFileSync = () => {
  const settings = loadSyncSettings();
  
  const [state, setState] = useState<FileSyncState>({
    isSupported: checkFSASupport(),
    directoryHandle: null,
    lastSyncTime: null,
    isSyncing: false,
    autoSyncEnabled: settings.autoSyncEnabled,
    error: null,
    permissionState: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const directoryHandleRef = useRef<FileSystemDirectoryHandle | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    directoryHandleRef.current = state.directoryHandle;
  }, [state.directoryHandle]);

  // Check and request permission for a handle
  const verifyPermission = useCallback(async (
    handle: FileSystemDirectoryHandle, 
    readWrite: boolean = true
  ): Promise<boolean> => {
    const options: { mode: 'read' | 'readwrite' } = { mode: readWrite ? 'readwrite' : 'read' };
    
    try {
      // Check current permission
      const permission = await handle.queryPermission(options);
      
      if (permission === 'granted') {
        setState(prev => ({ ...prev, permissionState: 'granted', error: null }));
        return true;
      }
      
      if (permission === 'prompt') {
        // Request permission
        const result = await handle.requestPermission(options);
        const granted = result === 'granted';
        setState(prev => ({ 
          ...prev, 
          permissionState: granted ? 'granted' : 'denied',
          error: granted ? null : 'Přístup ke složce byl zamítnut'
        }));
        return granted;
      }
      
      setState(prev => ({ 
        ...prev, 
        permissionState: 'denied',
        error: 'Přístup ke složce byl zamítnut'
      }));
      return false;
    } catch (error) {
      console.error('Permission check failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: `Chyba při ověřování oprávnění: ${(error as Error).message}`
      }));
      return false;
    }
  }, []);

  const saveToDirectory = useCallback(async (handle: FileSystemDirectoryHandle): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isSyncing: true, error: null }));
      
      // Verify we still have permission
      const hasPermission = await verifyPermission(handle);
      if (!hasPermission) {
        setState(prev => ({ 
          ...prev, 
          isSyncing: false,
          error: 'Ztraceno oprávnění k zápisu. Vyberte složku znovu.',
          directoryHandle: null
        }));
        return false;
      }
      
      const fileHandle = await handle.getFileHandle(BACKUP_FILENAME, { create: true });
      const writable = await fileHandle.createWritable();
      const dataStr = exportData();
      await writable.write(dataStr);
      await writable.close();
      
      const now = new Date();
      setState(prev => ({ 
        ...prev, 
        isSyncing: false, 
        lastSyncTime: now,
        error: null
      }));
      
      return true;
    } catch (error) {
      const errorMessage = (error as Error).message || 'Neznámá chyba';
      console.error('Error saving to directory:', error);
      
      let userMessage = 'Nepodařilo se uložit data';
      
      // Handle specific error cases
      if (errorMessage.includes('NotAllowedError') || errorMessage.includes('permission')) {
        userMessage = 'Přístup zamítnut. Vyberte složku znovu.';
        setState(prev => ({ 
          ...prev, 
          isSyncing: false, 
          error: userMessage,
          directoryHandle: null,
          permissionState: 'denied'
        }));
      } else if (errorMessage.includes('NotFoundError')) {
        userMessage = 'Složka nebyla nalezena. Možná byla odstraněna nebo odpojeno síťové úložiště.';
        setState(prev => ({ ...prev, isSyncing: false, error: userMessage }));
      } else if (errorMessage.includes('NetworkError') || errorMessage.includes('AbortError')) {
        userMessage = 'Síťová chyba. Zkontrolujte připojení k síťovému disku.';
        setState(prev => ({ ...prev, isSyncing: false, error: userMessage }));
      } else {
        setState(prev => ({ ...prev, isSyncing: false, error: errorMessage }));
      }
      
      return false;
    }
  }, [verifyPermission]);

  const loadFromDirectory = useCallback(async (handle: FileSystemDirectoryHandle): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isSyncing: true, error: null }));
      
      // Verify we still have permission
      const hasPermission = await verifyPermission(handle, false);
      if (!hasPermission) {
        setState(prev => ({ 
          ...prev, 
          isSyncing: false,
          error: 'Ztraceno oprávnění ke čtení. Vyberte složku znovu.'
        }));
        return false;
      }
      
      const fileHandle = await handle.getFileHandle(BACKUP_FILENAME);
      const file = await fileHandle.getFile();
      const content = await file.text();
      
      if (importData(content)) {
        setState(prev => ({ 
          ...prev, 
          isSyncing: false,
          lastSyncTime: new Date(),
          error: null
        }));
        return true;
      }
      
      setState(prev => ({ 
        ...prev, 
        isSyncing: false,
        error: 'Soubor obsahuje neplatná data'
      }));
      return false;
    } catch (error) {
      const errorMessage = (error as Error).message || 'Neznámá chyba';
      console.error('Error loading from directory:', error);
      
      let userMessage = 'Nepodařilo se načíst data';
      
      if (errorMessage.includes('NotFoundError')) {
        userMessage = 'Záložní soubor nebyl nalezen ve vybrané složce';
      } else if (errorMessage.includes('NotAllowedError')) {
        userMessage = 'Přístup ke čtení byl zamítnut';
      }
      
      setState(prev => ({ ...prev, isSyncing: false, error: userMessage }));
      return false;
    }
  }, [verifyPermission]);

  const selectDirectory = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported || !window.showDirectoryPicker) {
      const reason = !window.isSecureContext 
        ? 'Funkce vyžaduje HTTPS připojení'
        : 'Váš prohlížeč nepodporuje přístup k souborovému systému';
      toast.error(reason);
      setState(prev => ({ ...prev, error: reason }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, error: null }));
      
      const handle = await window.showDirectoryPicker({
        mode: 'readwrite',
        startIn: 'documents',
      });
      
      // Verify permission immediately
      const hasPermission = await verifyPermission(handle);
      if (!hasPermission) {
        toast.error('Přístup ke složce byl zamítnut');
        return false;
      }
      
      setState(prev => ({ 
        ...prev, 
        directoryHandle: handle,
        autoSyncEnabled: true,
        error: null,
        permissionState: 'granted'
      }));
      
      saveSyncSettings({ autoSyncEnabled: true });
      
      // Initial save
      const saved = await saveToDirectory(handle);
      if (saved) {
        toast.success('Složka vybrána a data uložena');
      } else {
        toast.error('Složka vybrána, ale nepodařilo se uložit data');
      }
      
      return saved;
    } catch (error) {
      const errorName = (error as Error).name;
      const errorMessage = (error as Error).message;
      
      if (errorName === 'AbortError') {
        // User cancelled - not an error
        return false;
      }
      
      if (errorName === 'SecurityError') {
        const msg = 'Bezpečnostní omezení prohlížeče blokuje přístup k souborům';
        toast.error(msg);
        setState(prev => ({ ...prev, error: msg }));
        return false;
      }
      
      console.error('Error selecting directory:', error);
      toast.error(`Nepodařilo se vybrat složku: ${errorMessage}`);
      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, [state.isSupported, saveToDirectory, verifyPermission]);

  const manualSave = useCallback(async (): Promise<boolean> => {
    if (!state.directoryHandle) {
      toast.error('Nejprve vyberte složku pro synchronizaci');
      return false;
    }

    const saved = await saveToDirectory(state.directoryHandle);
    if (saved) {
      toast.success('Data byla uložena');
    } else {
      toast.error(state.error || 'Nepodařilo se uložit data');
    }
    return saved;
  }, [state.directoryHandle, state.error, saveToDirectory]);

  const manualLoad = useCallback(async (): Promise<boolean> => {
    if (!state.directoryHandle) {
      toast.error('Nejprve vyberte složku pro synchronizaci');
      return false;
    }

    const loaded = await loadFromDirectory(state.directoryHandle);
    if (loaded) {
      toast.success('Data byla načtena');
      window.location.reload();
    } else {
      toast.error(state.error || 'Nepodařilo se načíst data');
    }
    return loaded;
  }, [state.directoryHandle, state.error, loadFromDirectory]);

  const disconnect = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prev => ({ 
      ...prev, 
      directoryHandle: null, 
      autoSyncEnabled: false,
      lastSyncTime: null,
      error: null,
      permissionState: null
    }));
    saveSyncSettings({ autoSyncEnabled: false });
    toast.success('Synchronizace odpojena');
  }, []);

  const toggleAutoSync = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, autoSyncEnabled: enabled }));
    saveSyncSettings({ autoSyncEnabled: enabled });
    if (enabled) {
      toast.success('Automatická synchronizace zapnuta');
    } else {
      toast.info('Automatická synchronizace vypnuta');
    }
  }, []);

  // Auto-save interval
  useEffect(() => {
    if (state.directoryHandle && state.autoSyncEnabled) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(async () => {
        if (directoryHandleRef.current) {
          const success = await saveToDirectory(directoryHandleRef.current);
          if (!success) {
            // Stop auto-sync on persistent failures
            console.warn('Auto-sync failed, stopping interval');
          }
        }
      }, SYNC_INTERVAL);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [state.directoryHandle, state.autoSyncEnabled, saveToDirectory]);

  return {
    ...state,
    selectDirectory,
    manualSave,
    manualLoad,
    disconnect,
    toggleAutoSync,
  };
};

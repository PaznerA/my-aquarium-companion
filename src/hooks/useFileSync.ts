import { useState, useEffect, useCallback, useRef } from 'react';
import { exportData, importData } from '@/lib/storage';
import { toast } from 'sonner';

// Extend Window interface for File System Access API
declare global {
  interface Window {
    showDirectoryPicker: (options?: {
      mode?: 'read' | 'readwrite';
      startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';
    }) => Promise<FileSystemDirectoryHandle>;
  }
}

const SYNC_INTERVAL = 30000; // 30 seconds
const BACKUP_FILENAME = 'aquarium-journal-backup.json';

interface FileSyncState {
  isSupported: boolean;
  directoryHandle: FileSystemDirectoryHandle | null;
  lastSyncTime: Date | null;
  isSyncing: boolean;
  autoSyncEnabled: boolean;
}

export const useFileSync = () => {
  const [state, setState] = useState<FileSyncState>({
    isSupported: typeof window !== 'undefined' && 'showDirectoryPicker' in window,
    directoryHandle: null,
    lastSyncTime: null,
    isSyncing: false,
    autoSyncEnabled: false,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const directoryHandleRef = useRef<FileSystemDirectoryHandle | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    directoryHandleRef.current = state.directoryHandle;
  }, [state.directoryHandle]);

  const saveToDirectory = useCallback(async (handle: FileSystemDirectoryHandle) => {
    try {
      setState(prev => ({ ...prev, isSyncing: true }));
      
      const fileHandle = await handle.getFileHandle(BACKUP_FILENAME, { create: true });
      const writable = await fileHandle.createWritable();
      const dataStr = exportData();
      await writable.write(dataStr);
      await writable.close();
      
      const now = new Date();
      setState(prev => ({ 
        ...prev, 
        isSyncing: false, 
        lastSyncTime: now 
      }));
      
      return true;
    } catch (error) {
      console.error('Error saving to directory:', error);
      setState(prev => ({ ...prev, isSyncing: false }));
      return false;
    }
  }, []);

  const loadFromDirectory = useCallback(async (handle: FileSystemDirectoryHandle) => {
    try {
      setState(prev => ({ ...prev, isSyncing: true }));
      
      const fileHandle = await handle.getFileHandle(BACKUP_FILENAME);
      const file = await fileHandle.getFile();
      const content = await file.text();
      
      if (importData(content)) {
        setState(prev => ({ 
          ...prev, 
          isSyncing: false,
          lastSyncTime: new Date()
        }));
        return true;
      }
      
      setState(prev => ({ ...prev, isSyncing: false }));
      return false;
    } catch (error) {
      console.error('Error loading from directory:', error);
      setState(prev => ({ ...prev, isSyncing: false }));
      return false;
    }
  }, []);

  const selectDirectory = useCallback(async () => {
    if (!state.isSupported) {
      toast.error('Váš prohlížeč nepodporuje přístup k souborovému systému');
      return false;
    }

    try {
      const handle = await window.showDirectoryPicker({
        mode: 'readwrite',
        startIn: 'documents',
      });
      
      setState(prev => ({ 
        ...prev, 
        directoryHandle: handle,
        autoSyncEnabled: true 
      }));
      
      // Initial save
      const saved = await saveToDirectory(handle);
      if (saved) {
        toast.success('Složka vybrána a data uložena');
      }
      
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error selecting directory:', error);
        toast.error('Nepodařilo se vybrat složku');
      }
      return false;
    }
  }, [state.isSupported, saveToDirectory]);

  const manualSave = useCallback(async () => {
    if (!state.directoryHandle) {
      toast.error('Nejprve vyberte složku pro synchronizaci');
      return false;
    }

    const saved = await saveToDirectory(state.directoryHandle);
    if (saved) {
      toast.success('Data byla uložena');
    } else {
      toast.error('Nepodařilo se uložit data');
    }
    return saved;
  }, [state.directoryHandle, saveToDirectory]);

  const manualLoad = useCallback(async () => {
    if (!state.directoryHandle) {
      toast.error('Nejprve vyberte složku pro synchronizaci');
      return false;
    }

    const loaded = await loadFromDirectory(state.directoryHandle);
    if (loaded) {
      toast.success('Data byla načtena');
      window.location.reload();
    } else {
      toast.error('Nepodařilo se načíst data (soubor možná neexistuje)');
    }
    return loaded;
  }, [state.directoryHandle, loadFromDirectory]);

  const disconnect = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prev => ({ 
      ...prev, 
      directoryHandle: null, 
      autoSyncEnabled: false,
      lastSyncTime: null 
    }));
    toast.success('Synchronizace odpojena');
  }, []);

  const toggleAutoSync = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, autoSyncEnabled: enabled }));
    if (enabled) {
      toast.success('Automatická synchronizace zapnuta');
    } else {
      toast.info('Automatická synchronizace vypnuta');
    }
  }, []);

  // Auto-save interval
  useEffect(() => {
    if (state.directoryHandle && state.autoSyncEnabled) {
      intervalRef.current = setInterval(() => {
        if (directoryHandleRef.current) {
          saveToDirectory(directoryHandleRef.current);
        }
      }, SYNC_INTERVAL);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
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

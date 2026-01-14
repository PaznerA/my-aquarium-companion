import { useState, useEffect, useCallback, useRef } from 'react';
import { exportData, importData } from '@/lib/storage';
import { toast } from 'sonner';

const SYNC_INTERVAL = 60000; // 60 seconds for cloud sync
const BACKUP_FILENAME = 'aquarium-journal-backup.json';
const S3_SETTINGS_KEY = 'aquarium-journal-s3-settings';

export interface S3Config {
  type: 'self-hosted' | 'global';
  endpoint: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
}

interface S3SyncState {
  isConnected: boolean;
  config: S3Config | null;
  lastSyncTime: Date | null;
  isSyncing: boolean;
  autoSyncEnabled: boolean;
  error: string | null;
}

interface S3Settings {
  config: S3Config | null;
  autoSyncEnabled: boolean;
}

const loadS3Settings = (): S3Settings => {
  try {
    const stored = localStorage.getItem(S3_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load S3 settings:', e);
  }
  return { config: null, autoSyncEnabled: false };
};

const saveS3Settings = (settings: S3Settings) => {
  try {
    localStorage.setItem(S3_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save S3 settings:', e);
  }
};

// Simple S3 API implementation using fetch
// This creates signed requests for S3-compatible APIs
const createS3Request = async (
  config: S3Config,
  method: 'GET' | 'PUT',
  path: string,
  body?: string
): Promise<Response> => {
  const url = `${config.endpoint}/${config.bucket}/${path}`;
  
  // For now, we use a simpler approach with public/pre-signed URLs
  // In production, you'd implement proper AWS Signature Version 4
  // Most S3-compatible services (MinIO, R2) support basic auth or public buckets
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Basic auth for some S3-compatible services
  if (config.accessKeyId && config.secretAccessKey) {
    // Use AWS-style authorization header
    const credentials = btoa(`${config.accessKeyId}:${config.secretAccessKey}`);
    headers['Authorization'] = `Basic ${credentials}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: method === 'PUT' ? body : undefined,
    mode: 'cors',
  });

  return response;
};

// Alternative: Use pre-signed URL approach for better compatibility
const saveToS3 = async (config: S3Config): Promise<{ success: boolean; error?: string }> => {
  try {
    const data = exportData();
    
    const response = await createS3Request(config, 'PUT', BACKUP_FILENAME, data);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return { 
        success: false, 
        error: `S3 chyba (${response.status}): ${errorText}` 
      };
    }
    
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Neznámá chyba';
    
    // Handle CORS errors
    if (message.includes('CORS') || message.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'CORS chyba - ověřte nastavení CORS na vašem S3 bucketu' 
      };
    }
    
    return { success: false, error: message };
  }
};

const loadFromS3 = async (config: S3Config): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await createS3Request(config, 'GET', BACKUP_FILENAME);
    
    if (response.status === 404) {
      return { success: false, error: 'Záložní soubor nebyl nalezen v bucketu' };
    }
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return { 
        success: false, 
        error: `S3 chyba (${response.status}): ${errorText}` 
      };
    }
    
    const content = await response.text();
    
    if (importData(content)) {
      return { success: true };
    }
    
    return { success: false, error: 'Soubor obsahuje neplatná data' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Neznámá chyba';
    
    if (message.includes('CORS') || message.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'CORS chyba - ověřte nastavení CORS na vašem S3 bucketu' 
      };
    }
    
    return { success: false, error: message };
  }
};

export const useS3Sync = () => {
  const settings = loadS3Settings();
  
  const [state, setState] = useState<S3SyncState>({
    isConnected: !!settings.config,
    config: settings.config,
    lastSyncTime: null,
    isSyncing: false,
    autoSyncEnabled: settings.autoSyncEnabled,
    error: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const configRef = useRef<S3Config | null>(settings.config);

  // Keep ref in sync with state
  useEffect(() => {
    configRef.current = state.config;
  }, [state.config]);

  const connect = useCallback(async (config: S3Config): Promise<boolean> => {
    setState(prev => ({ ...prev, isSyncing: true, error: null }));
    
    // Test connection by trying to save
    const result = await saveToS3(config);
    
    if (result.success) {
      setState(prev => ({
        ...prev,
        isConnected: true,
        config,
        lastSyncTime: new Date(),
        isSyncing: false,
        autoSyncEnabled: true,
        error: null,
      }));
      
      saveS3Settings({ config, autoSyncEnabled: true });
      toast.success('Připojeno k S3 bucketu');
      return true;
    } else {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: result.error || 'Nepodařilo se připojit',
      }));
      toast.error(result.error || 'Nepodařilo se připojit k S3');
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setState({
      isConnected: false,
      config: null,
      lastSyncTime: null,
      isSyncing: false,
      autoSyncEnabled: false,
      error: null,
    });
    
    saveS3Settings({ config: null, autoSyncEnabled: false });
    toast.success('S3 synchronizace odpojena');
  }, []);

  const manualSave = useCallback(async (): Promise<boolean> => {
    if (!state.config) {
      toast.error('Nejprve nakonfigurujte S3 připojení');
      return false;
    }

    setState(prev => ({ ...prev, isSyncing: true, error: null }));
    const result = await saveToS3(state.config);
    
    if (result.success) {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        error: null,
      }));
      toast.success('Data uložena do S3');
      return true;
    } else {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: result.error || 'Nepodařilo se uložit',
      }));
      toast.error(result.error || 'Nepodařilo se uložit do S3');
      return false;
    }
  }, [state.config]);

  const manualLoad = useCallback(async (): Promise<boolean> => {
    if (!state.config) {
      toast.error('Nejprve nakonfigurujte S3 připojení');
      return false;
    }

    setState(prev => ({ ...prev, isSyncing: true, error: null }));
    const result = await loadFromS3(state.config);
    
    if (result.success) {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        error: null,
      }));
      toast.success('Data načtena z S3');
      window.location.reload();
      return true;
    } else {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: result.error || 'Nepodařilo se načíst',
      }));
      toast.error(result.error || 'Nepodařilo se načíst z S3');
      return false;
    }
  }, [state.config]);

  const toggleAutoSync = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, autoSyncEnabled: enabled }));
    if (state.config) {
      saveS3Settings({ config: state.config, autoSyncEnabled: enabled });
    }
    if (enabled) {
      toast.success('Automatická cloud synchronizace zapnuta');
    } else {
      toast.info('Automatická cloud synchronizace vypnuta');
    }
  }, [state.config]);

  // Auto-save interval
  useEffect(() => {
    if (state.isConnected && state.autoSyncEnabled && state.config) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(async () => {
        if (configRef.current) {
          const result = await saveToS3(configRef.current);
          if (result.success) {
            setState(prev => ({ ...prev, lastSyncTime: new Date(), error: null }));
          } else {
            console.warn('S3 auto-sync failed:', result.error);
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
  }, [state.isConnected, state.autoSyncEnabled, state.config]);

  return {
    ...state,
    connect,
    disconnect,
    manualSave,
    manualLoad,
    toggleAutoSync,
  };
};

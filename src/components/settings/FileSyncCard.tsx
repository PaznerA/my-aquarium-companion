import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useFileSync } from '@/hooks/useFileSync';
import { useI18n } from '@/lib/i18n';
import { 
  FolderSync, 
  FolderOpen, 
  Save, 
  Download, 
  Unplug,
  Clock,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

export const FileSyncCard = () => {
  const { t } = useI18n();
  const {
    isSupported,
    directoryHandle,
    lastSyncTime,
    isSyncing,
    autoSyncEnabled,
    error,
    permissionState,
    selectDirectory,
    manualSave,
    manualLoad,
    disconnect,
    toggleAutoSync,
  } = useFileSync();

  const renderNotSupportedReason = () => {
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      return 'Vyžaduje HTTPS připojení. Funkce není dostupná přes HTTP.';
    }
    return t.settings.notSupported;
  };

  if (!isSupported) {
    return (
      <Card className="p-6 border-2 space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h2 className="font-bold">{t.settings.fileSync}</h2>
            <p className="text-sm text-muted-foreground">{renderNotSupportedReason()}</p>
          </div>
        </div>
        
      </Card>
    );
  }

  return (
    <Card className="p-6 border-2 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderSync className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-bold">Synchronizace se složkou</h2>
            <p className="text-sm text-muted-foreground">
              Automatické ukládání do lokální složky každých 30s
            </p>
          </div>
        </div>
        {directoryHandle && (
          <Badge 
            variant={permissionState === 'granted' ? 'outline' : 'destructive'} 
            className="gap-1"
          >
            {permissionState === 'granted' ? (
              <>
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Připojeno
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3" />
                Chyba oprávnění
              </>
            )}
          </Badge>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Chyba synchronizace</p>
            <p className="text-xs opacity-90">{error}</p>
          </div>
        </div>
      )}

      {!directoryHandle ? (
        <div className="space-y-4">
          <Button onClick={selectDirectory} className="gap-2 w-full sm:w-auto">
            <FolderOpen className="h-4 w-4" />
            Vybrat složku pro synchronizaci
          </Button>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>💡 <strong>Tip:</strong> Vyberte složku na lokálním disku pro nejlepší kompatibilitu.</p>
            <p>⚠️ Síťové disky (NAS, OneDrive, Dropbox) mohou mít omezení.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Status */}
          {lastSyncTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {t.settings.lastSync}: {format(lastSyncTime, 'HH:mm:ss')}
              </span>
            </div>
          )}

          {/* Auto-sync toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Automatické ukládání</p>
              <p className="text-xs text-muted-foreground">Ukládat každých 30 sekund</p>
            </div>
            <Switch
              checked={autoSyncEnabled}
              onCheckedChange={toggleAutoSync}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={manualSave} 
              disabled={isSyncing}
              className="gap-2 border-2"
            >
              <Save className="h-4 w-4" />
              {isSyncing ? 'Ukládám...' : 'Uložit nyní'}
            </Button>
            <Button 
              variant="outline" 
              onClick={manualLoad} 
              disabled={isSyncing}
              className="gap-2 border-2"
            >
              <Download className="h-4 w-4" />
              Načíst ze složky
            </Button>
            <Button 
              variant="ghost" 
              onClick={disconnect}
              className="gap-2 text-muted-foreground hover:text-destructive"
            >
              <Unplug className="h-4 w-4" />
              Odpojit
            </Button>
          </div>

          {/* Change folder */}
          <Button 
            variant="link" 
            onClick={selectDirectory} 
            className="p-0 h-auto text-xs"
          >
            Změnit složku
          </Button>
        </div>
      )}
      
    </Card>
  );
};
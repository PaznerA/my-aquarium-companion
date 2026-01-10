import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useFileSync } from '@/hooks/useFileSync';
import { 
  FolderSync, 
  FolderOpen, 
  Save, 
  Download, 
  Unplug,
  Clock,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

export const FileSyncCard = () => {
  const {
    isSupported,
    directoryHandle,
    lastSyncTime,
    isSyncing,
    autoSyncEnabled,
    selectDirectory,
    manualSave,
    manualLoad,
    disconnect,
    toggleAutoSync,
  } = useFileSync();

  if (!isSupported) {
    return (
      <Card className="p-6 border-2 space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h2 className="font-bold">Synchronizace se složkou</h2>
            <p className="text-sm text-muted-foreground">
              Váš prohlížeč nepodporuje File System Access API. 
              Použijte Chrome, Edge nebo jiný Chromium prohlížeč pro tuto funkci.
            </p>
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
          <Badge variant="outline" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Připojeno
          </Badge>
        )}
      </div>

      {!directoryHandle ? (
        <Button onClick={selectDirectory} className="gap-2 w-full sm:w-auto">
          <FolderOpen className="h-4 w-4" />
          Vybrat složku pro synchronizaci
        </Button>
      ) : (
        <div className="space-y-4">
          {/* Status */}
          {lastSyncTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Poslední synchronizace: {format(lastSyncTime, 'HH:mm:ss', { locale: cs })}
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

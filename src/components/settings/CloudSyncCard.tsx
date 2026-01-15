import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useS3Sync } from '@/hooks/useS3Sync';
import { S3ConfigDialog } from './S3ConfigDialog';
import { GlobalSyncDialog } from './GlobalSyncDialog';
import { 
  Cloud, 
  Server, 
  Save, 
  Download, 
  Unplug,
  Clock,
  AlertCircle,
  CheckCircle2,
  Settings2,
  FolderOpen
} from 'lucide-react';
import { format } from 'date-fns';

export const CloudSyncCard = () => {
  const [s3DialogOpen, setS3DialogOpen] = useState(false);
  const [globalDialogOpen, setGlobalDialogOpen] = useState(false);
  
  const s3Sync = useS3Sync();

  return (
    <>
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Cloud className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-bold">Cloud synchronizace</h2>
            <p className="text-sm text-muted-foreground">
              Synchronizujte data do cloudu pro přístup z více zařízení
            </p>
          </div>
        </div>

        {/* Error display */}
        {s3Sync.error && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Chyba synchronizace</p>
              <p className="text-xs opacity-90">{s3Sync.error}</p>
            </div>
          </div>
        )}

        {!s3Sync.isConnected ? (
          // Not connected - show options
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => setS3DialogOpen(true)}
            >
              <div className="flex items-center gap-2 w-full">
                <Server className="h-4 w-4" />
                <span className="font-medium">Self Hosted</span>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                Vlastní S3 bucket (MinIO, R2, B2)
              </p>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => setGlobalDialogOpen(true)}
            >
              <div className="flex items-center gap-2 w-full">
                <Cloud className="h-4 w-4" />
                <span className="font-medium">Global</span>
                <Badge variant="secondary" className="text-xs ml-auto">Brzy</Badge>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                Naše cloud řešení se sdílením
              </p>
            </Button>
          </div>
        ) : (
          // Connected - show status and controls
          <div className="space-y-4">
            {/* Connection status */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                {s3Sync.config?.type === 'self-hosted' ? 'Self Hosted S3' : 'Global Cloud'}
              </Badge>
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {s3Sync.config?.endpoint}
              </span>
            </div>

            {/* Media path display */}
            {s3Sync.config?.mediaPath && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FolderOpen className="h-4 w-4" />
                <span>Média: /{s3Sync.config.mediaPath}/</span>
              </div>
            )}

            {/* Last sync time */}
            {s3Sync.lastSyncTime && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Poslední sync: {format(s3Sync.lastSyncTime, 'HH:mm:ss')}
                </span>
              </div>
            )}

            {/* Auto-sync toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Automatická synchronizace</p>
                <p className="text-xs text-muted-foreground">Každou minutu</p>
              </div>
              <Switch
                checked={s3Sync.autoSyncEnabled}
                onCheckedChange={s3Sync.toggleAutoSync}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                onClick={s3Sync.manualSave} 
                disabled={s3Sync.isSyncing}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {s3Sync.isSyncing ? 'Ukládám...' : 'Uložit nyní'}
              </Button>
              <Button 
                variant="outline" 
                onClick={s3Sync.manualLoad} 
                disabled={s3Sync.isSyncing}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Načíst z cloudu
              </Button>
              <Button 
                variant="ghost" 
                onClick={s3Sync.disconnect}
                className="gap-2 text-muted-foreground hover:text-destructive"
              >
                <Unplug className="h-4 w-4" />
                Odpojit
              </Button>
            </div>

            {/* Reconfigure button */}
            <Button 
              variant="link" 
              onClick={() => setS3DialogOpen(true)} 
              className="p-0 h-auto text-xs gap-1"
            >
              <Settings2 className="h-3 w-3" />
              Změnit nastavení
            </Button>

            {/* Global sync teaser when using self-hosted */}
            {s3Sync.config?.type === 'self-hosted' && (
              <div className="pt-2 border-t">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setGlobalDialogOpen(true)}
                  className="text-muted-foreground text-xs gap-2 w-full justify-start"
                >
                  <Cloud className="h-3 w-3" />
                  Přejít na Global cloud s možností sdílení
                  <Badge variant="secondary" className="text-xs ml-auto">Brzy</Badge>
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      <S3ConfigDialog
        open={s3DialogOpen}
        onOpenChange={setS3DialogOpen}
        onConnect={s3Sync.connect}
        isConnecting={s3Sync.isSyncing}
      />

      <GlobalSyncDialog
        open={globalDialogOpen}
        onOpenChange={setGlobalDialogOpen}
        sharingSettings={s3Sync.sharingSettings}
        onSharingSettingsChange={s3Sync.updateSharingSettings}
        isConnected={s3Sync.isConnected && s3Sync.config?.type === 'global'}
      />
    </>
  );
};

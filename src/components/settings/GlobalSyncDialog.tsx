import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cloud, Lock, Share2, Zap, Calendar, BookOpen, Droplets, Wrench, Paperclip } from 'lucide-react';
import { SharingSettings } from '@/hooks/useS3Sync';

interface GlobalSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sharingSettings?: SharingSettings;
  onSharingSettingsChange?: (settings: Partial<SharingSettings>) => void;
  isConnected?: boolean;
}

export const GlobalSyncDialog = ({
  open,
  onOpenChange,
  sharingSettings,
  onSharingSettingsChange,
  isConnected = false,
}: GlobalSyncDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            <DialogTitle>Cloud Sync - Global</DialogTitle>
            <Badge variant="secondary">Brzy</Badge>
          </div>
          <DialogDescription>
            Naše cloudové řešení s pokročilými funkcemi.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Bez konfigurace</h4>
              <p className="text-sm text-muted-foreground">
                Žádné nastavování S3 bucketů nebo credentials. Prostě to funguje.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Share2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Sdílení dat</h4>
              <p className="text-sm text-muted-foreground">
                Sdílejte svá akvária s přáteli pomocí odkazu nebo QR kódu.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Bezpečné šifrování</h4>
              <p className="text-sm text-muted-foreground">
                Vaše data jsou end-to-end šifrována.
              </p>
            </div>
          </div>

          {/* Sharing options - preview of future functionality */}
          <div className="rounded-md border p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium text-sm">Možnosti sdílení</h4>
              <Badge variant="outline" className="text-xs">Preview</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="share-journal" className="text-sm">Deník</Label>
                </div>
                <Switch 
                  id="share-journal"
                  checked={sharingSettings?.shareJournal ?? true}
                  onCheckedChange={(checked) => onSharingSettingsChange?.({ shareJournal: checked })}
                  disabled={!isConnected}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="share-calendar" className="text-sm">Kalendář</Label>
                </div>
                <Switch 
                  id="share-calendar"
                  checked={sharingSettings?.shareCalendar ?? true}
                  onCheckedChange={(checked) => onSharingSettingsChange?.({ shareCalendar: checked })}
                  disabled={!isConnected}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="share-aquariums" className="text-sm">Akvária</Label>
                </div>
                <Switch 
                  id="share-aquariums"
                  checked={sharingSettings?.shareAquariums ?? true}
                  onCheckedChange={(checked) => onSharingSettingsChange?.({ shareAquariums: checked })}
                  disabled={!isConnected}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="share-equipment" className="text-sm">Vybavení</Label>
                </div>
                <Switch 
                  id="share-equipment"
                  checked={sharingSettings?.shareEquipment ?? false}
                  onCheckedChange={(checked) => onSharingSettingsChange?.({ shareEquipment: checked })}
                  disabled={!isConnected}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="share-attachments" className="text-sm">Přílohy (fotky, dokumenty)</Label>
                </div>
                <Switch 
                  id="share-attachments"
                  checked={sharingSettings?.shareAttachments ?? true}
                  onCheckedChange={(checked) => onSharingSettingsChange?.({ shareAttachments: checked })}
                  disabled={!isConnected}
                />
              </div>
            </div>

            {!isConnected && (
              <p className="text-xs text-muted-foreground">
                Připojte se k Global cloudu pro aktivaci sdílení
              </p>
            )}
          </div>

          <div className="rounded-md border-2 border-dashed p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Tato funkce je ve vývoji. Brzy bude k dispozici!
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Mezitím můžete použít vlastní S3 bucket.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Zavřít
          </Button>
          <Button disabled>
            Přihlásit se
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

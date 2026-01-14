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
import { Cloud, Lock, Share2, Zap } from 'lucide-react';

interface GlobalSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSyncDialog = ({
  open,
  onOpenChange,
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

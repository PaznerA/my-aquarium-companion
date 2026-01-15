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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { S3Config, testS3Connection } from '@/hooks/useS3Sync';
import { Server, Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface S3ConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (config: S3Config) => Promise<boolean>;
  isConnecting: boolean;
}

export const S3ConfigDialog = ({
  open,
  onOpenChange,
  onConnect,
  isConnecting,
}: S3ConfigDialogProps) => {
  const [endpoint, setEndpoint] = useState('');
  const [bucket, setBucket] = useState('');
  const [accessKeyId, setAccessKeyId] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [region, setRegion] = useState('');
  const [mediaPath, setMediaPath] = useState('media');
  const [showSecret, setShowSecret] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testError, setTestError] = useState<string | null>(null);

  const getConfig = (): S3Config => ({
    type: 'self-hosted',
    endpoint: endpoint.replace(/\/$/, ''),
    bucket,
    accessKeyId,
    secretAccessKey,
    region: region || 'auto',
    mediaPath,
  });

  const handleTest = async () => {
    if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
      setTestError('Vyplňte všechna povinná pole');
      setTestStatus('error');
      return;
    }

    setTestStatus('testing');
    setTestError(null);

    const result = await testS3Connection(getConfig());
    
    if (result.success) {
      setTestStatus('success');
      setTestError(null);
    } else {
      setTestStatus('error');
      setTestError(result.error || 'Test selhal');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const config = getConfig();
    
    const success = await onConnect(config);
    if (success) {
      onOpenChange(false);
      // Reset form
      setEndpoint('');
      setBucket('');
      setAccessKeyId('');
      setSecretAccessKey('');
      setRegion('');
      setMediaPath('media');
      setTestStatus('idle');
      setTestError(null);
    }
  };

  const isValid = endpoint && bucket && accessKeyId && secretAccessKey;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <DialogTitle>S3 Cloud Sync - Self Hosted</DialogTitle>
          </div>
          <DialogDescription>
            Připojte vlastní S3-compatible storage (MinIO, Backblaze B2, Cloudflare R2, AWS S3).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endpoint">Endpoint URL</Label>
            <Input
              id="endpoint"
              placeholder="https://s3.eu-central-1.amazonaws.com"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Pro MinIO: http://localhost:9000, R2: https://xxx.r2.cloudflarestorage.com
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bucket">Název bucketu</Label>
            <Input
              id="bucket"
              placeholder="aquarium-backup"
              value={bucket}
              onChange={(e) => setBucket(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessKeyId">Access Key ID</Label>
            <Input
              id="accessKeyId"
              placeholder="AKIAIOSFODNN7EXAMPLE"
              value={accessKeyId}
              onChange={(e) => setAccessKeyId(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secretAccessKey">Secret Access Key</Label>
            <div className="relative">
              <Input
                id="secretAccessKey"
                type={showSecret ? 'text' : 'password'}
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                value={secretAccessKey}
                onChange={(e) => setSecretAccessKey(e.target.value)}
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="region">Region (volitelné)</Label>
              <Input
                id="region"
                placeholder="auto"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mediaPath">Cesta pro média</Label>
              <Input
                id="mediaPath"
                placeholder="media"
                value={mediaPath}
                onChange={(e) => setMediaPath(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Složka pro fotky a přílohy
              </p>
            </div>
          </div>

          {/* Test connection section */}
          <div className="rounded-md border p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Otestovat připojení</p>
                <p className="text-xs text-muted-foreground">
                  Ověřte přístup před uložením
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTest}
                disabled={!isValid || testStatus === 'testing'}
                className="gap-2"
              >
                {testStatus === 'testing' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Testuji...
                  </>
                ) : testStatus === 'success' ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Úspěch
                  </>
                ) : testStatus === 'error' ? (
                  <>
                    <XCircle className="h-4 w-4 text-destructive" />
                    Chyba
                  </>
                ) : (
                  'Otestovat'
                )}
              </Button>
            </div>
            
            {testStatus === 'success' && (
              <p className="text-sm text-primary">
                ✓ Připojení k S3 bucketu funguje správně
              </p>
            )}
            
            {testError && (
              <p className="text-sm text-destructive">
                {testError}
              </p>
            )}
          </div>

          <div className="rounded-md bg-muted p-3 text-sm space-y-1">
            <p className="font-medium">⚠️ Nastavení CORS</p>
            <p className="text-muted-foreground text-xs">
              Váš bucket musí mít povolené CORS pro tuto doménu. Přidejte origin této aplikace do CORS pravidel.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isConnecting}
            >
              Zrušit
            </Button>
            <Button type="submit" disabled={!isValid || isConnecting}>
              {isConnecting ? 'Připojuji...' : 'Připojit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

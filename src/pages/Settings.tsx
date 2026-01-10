import { useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { exportData, importData, loadData } from '@/lib/storage';
import { Download, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquarium-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data byla exportována');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (importData(content)) {
          toast.success('Data byla importována');
          window.location.reload();
        } else {
          toast.error('Nepodařilo se importovat data');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (confirm('Opravdu chcete smazat všechna data? Tato akce je nevratná.')) {
      localStorage.clear();
      toast.success('Data byla smazána');
      window.location.reload();
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nastavení</h1>
          <p className="text-muted-foreground">Správa aplikace a dat</p>
        </div>

        {/* Theme */}
        <Card className="p-6 border-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold">Vzhled</h2>
              <p className="text-sm text-muted-foreground">Přepnout mezi světlým a tmavým režimem</p>
            </div>
            <ThemeToggle />
          </div>
        </Card>

        {/* Export/Import */}
        <Card className="p-6 border-2 space-y-4">
          <div>
            <h2 className="font-bold">Zálohování dat</h2>
            <p className="text-sm text-muted-foreground">Exportujte nebo importujte vaše data</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Exportovat data
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Importovat data
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-2 border-destructive space-y-4">
          <div>
            <h2 className="font-bold text-destructive">Nebezpečná zóna</h2>
            <p className="text-sm text-muted-foreground">Tyto akce jsou nevratné</p>
          </div>
          <Button variant="destructive" onClick={handleClearData} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Smazat všechna data
          </Button>
        </Card>

        {/* About */}
        <Card className="p-6 border-2">
          <h2 className="font-bold">O aplikaci</h2>
          <p className="text-sm text-muted-foreground mt-2">
            AquariumJournal je offline-first aplikace pro správu akvárií.
            Všechna data jsou uložena lokálně ve vašem prohlížeči.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Verze 1.0.0 • PWA Ready
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;

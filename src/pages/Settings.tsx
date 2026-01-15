import { useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserSwitcher } from '@/components/settings/UserSwitcher';
import { FileSyncCard } from '@/components/settings/FileSyncCard';
import { CloudSyncCard } from '@/components/settings/CloudSyncCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppData } from '@/hooks/useAppData';
import { useI18n } from '@/lib/i18n';
import { exportData, importData } from '@/lib/storage';
import { generateMockData } from '@/lib/mockData';
import { Download, Upload, Trash2, Database, Globe, Ruler } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Settings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, addUser, switchUser, updateUser, deleteUser } = useAppData();
  const { t, language, setLanguage, unitSystem, setUnitSystem } = useI18n();

  const handleExport = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquarium-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t.common.dataExported);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (importData(content)) {
          toast.success(t.common.dataImported);
          window.location.reload();
        } else {
          toast.error(t.common.importFailed);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (confirm(t.settings.deleteConfirm)) {
      localStorage.clear();
      toast.success(t.common.dataDeleted);
      window.location.reload();
    }
  };

  const handleLoadMockData = () => {
    if (confirm(t.settings.mockDataConfirm)) {
      generateMockData();
      toast.success(t.common.mockDataLoaded);
      window.location.reload();
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.settings.title}</h1>
          <p className="text-muted-foreground">{t.settings.subtitle}</p>
        </div>

        {/* Users */}
        <UserSwitcher
          users={data.users}
          currentUserId={data.currentUserId}
          onSwitch={switchUser}
          onAdd={addUser}
          onUpdate={updateUser}
          onDelete={deleteUser}
        />

        {/* Language */}
        <Card className="p-6 border-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <h2 className="font-bold">{t.settings.language}</h2>
                <p className="text-sm text-muted-foreground">{t.settings.languageHint}</p>
              </div>
            </div>
            <Select value={language} onValueChange={(v) => setLanguage(v as 'cs' | 'en')}>
              <SelectTrigger className="w-40 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cs">🇨🇿 Čeština</SelectItem>
                <SelectItem value="en">🇬🇧 English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Units */}
        <Card className="p-6 border-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ruler className="h-5 w-5 text-muted-foreground" />
              <div>
                <h2 className="font-bold">{t.settings.units}</h2>
                <p className="text-sm text-muted-foreground">{t.settings.unitsHint}</p>
              </div>
            </div>
            <Select value={unitSystem} onValueChange={(v) => setUnitSystem(v as 'metric' | 'imperial')}>
              <SelectTrigger className="w-40 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">{t.settings.metricUnits}</SelectItem>
                <SelectItem value="imperial">{t.settings.imperialUnits}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Theme */}
        <Card className="p-6 border-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold">{t.settings.theme}</h2>
              <p className="text-sm text-muted-foreground">{t.settings.themeHint}</p>
            </div>
            <ThemeToggle />
          </div>
        </Card>

        {/* File Sync */}
        <FileSyncCard />

        {/* Cloud Sync */}
        <CloudSyncCard />

        {/* Export/Import */}
        <Card className="p-6 border-2 space-y-4">
          <div>
            <h2 className="font-bold">{t.settings.backup}</h2>
            <p className="text-sm text-muted-foreground">{t.settings.backupHint}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              {t.settings.export}
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              {t.settings.import}
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

        {/* Mock Data */}
        <Card className="p-6 border-2 space-y-4">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="font-bold">{t.settings.mockData}</h2>
              <p className="text-sm text-muted-foreground">{t.settings.mockDataHint}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLoadMockData} className="gap-2 border-2">
            <Database className="h-4 w-4" />
            {t.settings.loadMockData}
          </Button>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-2 border-destructive space-y-4">
          <div>
            <h2 className="font-bold text-destructive">{t.settings.dangerZone}</h2>
            <p className="text-sm text-muted-foreground">{t.settings.dangerZoneHint}</p>
          </div>
          <Button variant="destructive" onClick={handleClearData} className="gap-2">
            <Trash2 className="h-4 w-4" />
            {t.settings.deleteAllData}
          </Button>
        </Card>

        {/* About */}
        <Card className="p-6 border-2">
          <h2 className="font-bold">{t.settings.about}</h2>
          <p className="text-sm text-muted-foreground mt-2">
            {t.settings.aboutText}
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            {t.settings.version} 1.2.0 • PWA Ready • Multi-user • i18n
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;

import { useState, useEffect } from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { JournalFormSettings, Fertilizer } from '@/lib/storage';

interface FormSettingsDialogProps {
  settings: JournalFormSettings;
  fertilizers: Fertilizer[];
  onSave: (settings: Partial<JournalFormSettings>) => void;
}

export const FormSettingsDialog = ({
  settings,
  fertilizers,
  onSave,
}: FormSettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleToggle = (key: keyof JournalFormSettings) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleFertilizerToggle = (fertilizerId: string) => {
    setLocalSettings(prev => ({
      ...prev,
      visibleFertilizers: prev.visibleFertilizers.includes(fertilizerId)
        ? prev.visibleFertilizers.filter(id => id !== fertilizerId)
        : [...prev.visibleFertilizers, fertilizerId],
    }));
  };

  const handleSave = () => {
    onSave(localSettings);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="border-2">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nastavení formuláře</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Sections */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              Sekce
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="showDosing"
                  checked={localSettings.showDosing}
                  onCheckedChange={() => handleToggle('showDosing')}
                />
                <Label htmlFor="showDosing" className="cursor-pointer">Dávkování hnojiv</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="showWaterChange"
                  checked={localSettings.showWaterChange}
                  onCheckedChange={() => handleToggle('showWaterChange')}
                />
                <Label htmlFor="showWaterChange" className="cursor-pointer">Výměna vody</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="showVacuuming"
                  checked={localSettings.showVacuuming}
                  onCheckedChange={() => handleToggle('showVacuuming')}
                />
                <Label htmlFor="showVacuuming" className="cursor-pointer">Odsávání dna</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="showTrimming"
                  checked={localSettings.showTrimming}
                  onCheckedChange={() => handleToggle('showTrimming')}
                />
                <Label htmlFor="showTrimming" className="cursor-pointer">Zastřihování</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="showFilterCleaning"
                  checked={localSettings.showFilterCleaning}
                  onCheckedChange={() => handleToggle('showFilterCleaning')}
                />
                <Label htmlFor="showFilterCleaning" className="cursor-pointer">Čištění filtru</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="showPhotos"
                  checked={localSettings.showPhotos}
                  onCheckedChange={() => handleToggle('showPhotos')}
                />
                <Label htmlFor="showPhotos" className="cursor-pointer">Fotografie</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="showNotes"
                  checked={localSettings.showNotes}
                  onCheckedChange={() => handleToggle('showNotes')}
                />
                <Label htmlFor="showNotes" className="cursor-pointer">Poznámky</Label>
              </div>
            </div>
          </div>

          {/* Fertilizers */}
          {localSettings.showDosing && fertilizers.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                Hnojiva k zobrazení
              </h4>
              <div className="space-y-3">
                {fertilizers.map(fert => (
                  <div key={fert.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`fert-${fert.id}`}
                      checked={localSettings.visibleFertilizers.includes(fert.id)}
                      onCheckedChange={() => handleFertilizerToggle(fert.id)}
                    />
                    <Label htmlFor={`fert-${fert.id}`} className="cursor-pointer">
                      {fert.name}
                      <span className="text-muted-foreground ml-2 text-sm">({fert.brand})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleSave} className="w-full">
            Uložit nastavení
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

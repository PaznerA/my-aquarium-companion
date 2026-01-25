import { useState, useEffect } from 'react';
import { Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useI18n } from '@/lib/i18n';
import type { WaterSource } from '@/lib/storage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditWaterSourceDialogProps {
  waterSource: WaterSource;
  onUpdate: (id: string, updates: Partial<WaterSource>) => void;
  onClose: () => void;
}

export const EditWaterSourceDialog = ({ waterSource, onUpdate, onClose }: EditWaterSourceDialogProps) => {
  const { language } = useI18n();

  const [name, setName] = useState(waterSource.name);
  const [type, setType] = useState<WaterSource['type']>(waterSource.type);
  const [gh, setGh] = useState(waterSource.gh?.toString() ?? '');
  const [kh, setKh] = useState(waterSource.kh?.toString() ?? '');
  const [ph, setPh] = useState(waterSource.ph?.toString() ?? '');
  const [tds, setTds] = useState(waterSource.tds?.toString() ?? '');
  const [nitrate, setNitrate] = useState(waterSource.nitrate?.toString() ?? '');
  const [calcium, setCalcium] = useState(waterSource.calcium?.toString() ?? '');
  const [magnesium, setMagnesium] = useState(waterSource.magnesium?.toString() ?? '');
  const [potassium, setPotassium] = useState(waterSource.potassium?.toString() ?? '');
  const [isDefault, setIsDefault] = useState(waterSource.isDefault ?? false);
  const [notes, setNotes] = useState(waterSource.notes ?? '');

  useEffect(() => {
    setName(waterSource.name);
    setType(waterSource.type);
    setGh(waterSource.gh?.toString() ?? '');
    setKh(waterSource.kh?.toString() ?? '');
    setPh(waterSource.ph?.toString() ?? '');
    setTds(waterSource.tds?.toString() ?? '');
    setNitrate(waterSource.nitrate?.toString() ?? '');
    setCalcium(waterSource.calcium?.toString() ?? '');
    setMagnesium(waterSource.magnesium?.toString() ?? '');
    setPotassium(waterSource.potassium?.toString() ?? '');
    setIsDefault(waterSource.isDefault ?? false);
    setNotes(waterSource.notes ?? '');
  }, [waterSource]);

  const typeOptions = [
    { value: 'tap', label: { cs: 'Kohoutková voda', en: 'Tap Water' } },
    { value: 'ro', label: { cs: 'RO voda', en: 'RO Water' } },
    { value: 'rainwater', label: { cs: 'Dešťová voda', en: 'Rainwater' } },
    { value: 'well', label: { cs: 'Studniční voda', en: 'Well Water' } },
    { value: 'mixed', label: { cs: 'Smíchaná voda', en: 'Mixed Water' } },
    { value: 'other', label: { cs: 'Jiná', en: 'Other' } },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdate(waterSource.id, {
      name: name.trim(),
      type,
      gh: gh ? parseFloat(gh) : undefined,
      kh: kh ? parseFloat(kh) : undefined,
      ph: ph ? parseFloat(ph) : undefined,
      tds: tds ? parseFloat(tds) : undefined,
      nitrate: nitrate ? parseFloat(nitrate) : undefined,
      calcium: calcium ? parseFloat(calcium) : undefined,
      magnesium: magnesium ? parseFloat(magnesium) : undefined,
      potassium: potassium ? parseFloat(potassium) : undefined,
      isDefault,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="border-2 max-h-[90vh] overflow-y-auto max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            {language === 'cs' ? 'Upravit zdroj vody' : 'Edit Water Source'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="space-y-2">
            <Label htmlFor="name">{language === 'cs' ? 'Název' : 'Name'} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{language === 'cs' ? 'Typ zdroje' : 'Source Type'}</Label>
            <Select value={type} onValueChange={(v) => setType(v as WaterSource['type'])}>
              <SelectTrigger className="border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Key Parameters */}
          <div className="space-y-3 pt-3 border-t">
            <Label className="text-sm font-medium">
              {language === 'cs' ? 'Hlavní parametry' : 'Key Parameters'}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="gh" className="text-xs text-muted-foreground">GH (°dH)</Label>
                <Input
                  id="gh"
                  type="number"
                  step="0.1"
                  value={gh}
                  onChange={(e) => setGh(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="kh" className="text-xs text-muted-foreground">KH (°dH)</Label>
                <Input
                  id="kh"
                  type="number"
                  step="0.1"
                  value={kh}
                  onChange={(e) => setKh(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ph" className="text-xs text-muted-foreground">pH</Label>
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="tds" className="text-xs text-muted-foreground">TDS (ppm)</Label>
                <Input
                  id="tds"
                  type="number"
                  value={tds}
                  onChange={(e) => setTds(e.target.value)}
                  className="border-2"
                />
              </div>
            </div>
          </div>

          {/* Extended Parameters */}
          <div className="space-y-3 pt-3 border-t">
            <Label className="text-sm font-medium">
              {language === 'cs' ? 'Rozšířené parametry (mg/l)' : 'Extended Parameters (mg/l)'}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="nitrate" className="text-xs text-muted-foreground">NO₃ (dusičnany)</Label>
                <Input
                  id="nitrate"
                  type="number"
                  step="0.1"
                  value={nitrate}
                  onChange={(e) => setNitrate(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="calcium" className="text-xs text-muted-foreground">Ca (vápník)</Label>
                <Input
                  id="calcium"
                  type="number"
                  step="0.1"
                  value={calcium}
                  onChange={(e) => setCalcium(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="magnesium" className="text-xs text-muted-foreground">Mg (hořčík)</Label>
                <Input
                  id="magnesium"
                  type="number"
                  step="0.1"
                  value={magnesium}
                  onChange={(e) => setMagnesium(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="potassium" className="text-xs text-muted-foreground">K (draslík)</Label>
                <Input
                  id="potassium"
                  type="number"
                  step="0.1"
                  value={potassium}
                  onChange={(e) => setPotassium(e.target.value)}
                  className="border-2"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2 pt-3 border-t">
            <Label htmlFor="notes">{language === 'cs' ? 'Poznámky' : 'Notes'}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-2 min-h-[60px]"
            />
          </div>

          {/* Default Toggle */}
          <div className="flex items-center justify-between pt-3 border-t">
            <Label htmlFor="isDefault" className="cursor-pointer">
              {language === 'cs' ? 'Nastavit jako výchozí zdroj' : 'Set as default source'}
            </Label>
            <Switch
              id="isDefault"
              checked={isDefault}
              onCheckedChange={setIsDefault}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {language === 'cs' ? 'Zrušit' : 'Cancel'}
            </Button>
            <Button type="submit" className="flex-1">
              {language === 'cs' ? 'Uložit' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

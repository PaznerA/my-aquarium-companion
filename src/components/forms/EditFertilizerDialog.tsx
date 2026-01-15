import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/lib/i18n';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Fertilizer } from '@/lib/storage';

interface EditFertilizerDialogProps {
  fertilizer: Fertilizer;
  onUpdate: (id: string, updates: Partial<Fertilizer>) => void;
  trigger?: React.ReactNode;
}

export const EditFertilizerDialog = ({ fertilizer, onUpdate, trigger }: EditFertilizerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(fertilizer.name);
  const [brand, setBrand] = useState(fertilizer.brand);
  const [volume, setVolume] = useState(fertilizer.volume.toString());
  const [unit, setUnit] = useState<Fertilizer['unit']>(fertilizer.unit);
  const [nitrogen, setNitrogen] = useState(fertilizer.nitrogenPpm?.toString() || '');
  const [phosphorus, setPhosphorus] = useState(fertilizer.phosphorusPpm?.toString() || '');
  const [potassium, setPotassium] = useState(fertilizer.potassiumPpm?.toString() || '');
  const [iron, setIron] = useState(fertilizer.ironPpm?.toString() || '');
  const [magnesium, setMagnesium] = useState(fertilizer.magnesiumPpm?.toString() || '');
  const { t } = useI18n();

  useEffect(() => {
    if (open) {
      setName(fertilizer.name);
      setBrand(fertilizer.brand);
      setVolume(fertilizer.volume.toString());
      setUnit(fertilizer.unit);
      setNitrogen(fertilizer.nitrogenPpm?.toString() || '');
      setPhosphorus(fertilizer.phosphorusPpm?.toString() || '');
      setPotassium(fertilizer.potassiumPpm?.toString() || '');
      setIron(fertilizer.ironPpm?.toString() || '');
    }
  }, [open, fertilizer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && brand) {
      onUpdate(fertilizer.id, {
        name,
        brand,
        volume: parseFloat(volume) || 0,
        unit,
        nitrogenPpm: parseFloat(nitrogen) || undefined,
        phosphorusPpm: parseFloat(phosphorus) || undefined,
        potassiumPpm: parseFloat(potassium) || undefined,
        ironPpm: parseFloat(iron) || undefined,
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="border-2">
        <DialogHeader>
          <DialogTitle>{t.inventory.editFertilizer}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t.inventory.name}</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="border-2" />
          </div>
          <div className="space-y-2">
            <Label>{t.inventory.brand}</Label>
            <Input value={brand} onChange={e => setBrand(e.target.value)} className="border-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.inventory.amount}</Label>
              <Input
                type="number"
                value={volume}
                onChange={e => setVolume(e.target.value)}
                className="border-2"
              />
            </div>
            <div className="space-y-2">
              <Label>{t.inventory.unit}</Label>
              <Select value={unit} onValueChange={(v) => setUnit(v as Fertilizer['unit'])}>
                <SelectTrigger className="border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">
              {t.inventory.nutrientContent.replace('{unit}', unit)}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t.inventory.nitrogen}</Label>
                <Input type="number" step="0.1" value={nitrogen} onChange={e => setNitrogen(e.target.value)} className="border-2 h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t.inventory.phosphorus}</Label>
                <Input type="number" step="0.01" value={phosphorus} onChange={e => setPhosphorus(e.target.value)} className="border-2 h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t.inventory.potassium}</Label>
                <Input type="number" step="0.1" value={potassium} onChange={e => setPotassium(e.target.value)} className="border-2 h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t.inventory.iron}</Label>
                <Input type="number" step="0.01" value={iron} onChange={e => setIron(e.target.value)} className="border-2 h-8" />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1 border-2" onClick={() => setOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button type="submit" className="flex-1">
              {t.common.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

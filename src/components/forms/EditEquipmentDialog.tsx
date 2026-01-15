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
import type { Equipment } from '@/lib/storage';

interface EditEquipmentDialogProps {
  equipment: Equipment;
  onUpdate: (id: string, updates: Partial<Equipment>) => void;
  trigger?: React.ReactNode;
}

export const EditEquipmentDialog = ({ equipment, onUpdate, trigger }: EditEquipmentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(equipment.name);
  const [type, setType] = useState<Equipment['type']>(equipment.type);
  const [brand, setBrand] = useState(equipment.brand || '');
  const { t } = useI18n();

  const equipmentTypes: { value: Equipment['type']; labelKey: keyof typeof t.equipmentTypes }[] = [
    { value: 'filter', labelKey: 'filter' },
    { value: 'heater', labelKey: 'heater' },
    { value: 'light', labelKey: 'light' },
    { value: 'co2', labelKey: 'co2' },
    { value: 'pump', labelKey: 'pump' },
    { value: 'other', labelKey: 'other' },
  ];

  useEffect(() => {
    if (open) {
      setName(equipment.name);
      setType(equipment.type);
      setBrand(equipment.brand || '');
    }
  }, [open, equipment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      onUpdate(equipment.id, {
        name,
        type,
        brand: brand || undefined,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.inventory.editEquipment}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t.inventory.name}</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t.inventory.type}</Label>
            <Select value={type} onValueChange={(v) => setType(v as Equipment['type'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {equipmentTypes.map(eqType => (
                  <SelectItem key={eqType.value} value={eqType.value}>
                    {t.equipmentTypes[eqType.labelKey]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t.inventory.brand} ({t.common.optional})</Label>
            <Input value={brand} onChange={e => setBrand(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
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

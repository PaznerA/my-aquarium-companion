import { useState } from 'react';
import { Plus } from 'lucide-react';
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

interface AddAquariumDialogProps {
  onAdd: (aquarium: { name: string; volume: number }) => void;
}

export const AddAquariumDialog = ({ onAdd }: AddAquariumDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [volume, setVolume] = useState('');
  const { t, unitSystem, parseVolume, volumeUnit } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && volume) {
      // Convert to liters if imperial
      const volumeInLiters = parseVolume(parseFloat(volume));
      onAdd({ name, volume: volumeInLiters });
      setName('');
      setVolume('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t.dashboard.addAquarium}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2">
        <DialogHeader>
          <DialogTitle>{t.aquarium.newAquarium}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.inventory.name}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={unitSystem === 'metric' ? 'Např. Hlavní akvárium' : 'e.g. Main Tank'}
              className="border-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="volume">{t.aquarium.volume} ({volumeUnit})</Label>
            <Input
              id="volume"
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder={unitSystem === 'metric' ? 'Např. 200' : 'e.g. 50'}
              className="border-2"
            />
          </div>
          <Button type="submit" className="w-full">
            {t.common.save}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && volume) {
      onAdd({ name, volume: parseFloat(volume) });
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
          Přidat akvárium
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2">
        <DialogHeader>
          <DialogTitle>Nové akvárium</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Název</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Např. Hlavní akvárium"
              className="border-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="volume">Objem (litry)</Label>
            <Input
              id="volume"
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="Např. 200"
              className="border-2"
            />
          </div>
          <Button type="submit" className="w-full">
            Vytvořit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

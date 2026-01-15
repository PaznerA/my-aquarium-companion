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
import type { Fish } from '@/lib/storage';

interface EditFishDialogProps {
  fish: Fish;
  onUpdate: (id: string, updates: Partial<Fish>) => void;
  trigger?: React.ReactNode;
}

export const EditFishDialog = ({ fish, onUpdate, trigger }: EditFishDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(fish.name);
  const [species, setSpecies] = useState(fish.species);
  const [count, setCount] = useState(fish.count.toString());
  const { t } = useI18n();

  useEffect(() => {
    if (open) {
      setName(fish.name);
      setSpecies(fish.species);
      setCount(fish.count.toString());
    }
  }, [open, fish]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      onUpdate(fish.id, { 
        name, 
        species,
        count: parseInt(count) || 1,
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
          <DialogTitle>{t.aquarium.editFish}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t.aquarium.name}</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="border-2" />
          </div>
          <div className="space-y-2">
            <Label>{t.aquarium.species}</Label>
            <Input value={species} onChange={e => setSpecies(e.target.value)} className="border-2" />
          </div>
          <div className="space-y-2">
            <Label>{t.aquarium.count}</Label>
            <Input type="number" value={count} onChange={e => setCount(e.target.value)} className="border-2" />
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

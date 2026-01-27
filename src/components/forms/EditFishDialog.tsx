import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/lib/i18n';
import { SpeciesAutocomplete } from '@/components/common/SpeciesAutocomplete';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Fish } from '@/types';

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
  const { t, language } = useI18n();

  useEffect(() => {
    if (open) {
      setName(fish.name);
      setSpecies(fish.species);
      setCount(fish.count.toString());
    }
  }, [open, fish]);

  const handleScientificNameSelect = (scientificName: string) => {
    setSpecies(scientificName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Species is required, name is optional (will use species if empty)
    if (species) {
      onUpdate(fish.id, { 
        name: name || species, 
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
          <SpeciesAutocomplete
            type="fish"
            value={species}
            onChange={setSpecies}
            onScientificNameSelect={handleScientificNameSelect}
            label={t.aquarium.species}
            language={language}
          />
          <div className="space-y-2">
            <Label>{t.aquarium.name} ({language === 'cs' ? 'nepovinné' : 'optional'})</Label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder={language === 'cs' ? 'Přezdívka...' : 'Nickname...'}
              className="border-2" 
            />
          </div>
          <div className="space-y-2">
            <Label>{t.aquarium.count}</Label>
            <Input type="number" value={count} onChange={e => setCount(e.target.value)} className="border-2" />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1 border-2" onClick={() => setOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button type="submit" className="flex-1" disabled={!species}>
              {t.common.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task, Aquarium } from '@/lib/storage';

interface AddTaskDialogProps {
  aquariums: Aquarium[];
  onAdd: (task: Omit<Task, 'id' | 'userId'>) => void;
}

export const AddTaskDialog = ({ aquariums, onAdd }: AddTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Task['type']>('maintenance');
  const [aquariumId, setAquariumId] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [recurring, setRecurring] = useState<Task['recurring'] | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && dueDate) {
      onAdd({
        title,
        type,
        aquariumId: aquariumId || undefined,
        dueDate: new Date(dueDate).toISOString(),
        completed: false,
        recurring: recurring || undefined,
      });
      setTitle('');
      setType('maintenance');
      setAquariumId('');
      setDueDate('');
      setRecurring('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-2">
          <Plus className="h-4 w-4" />
          Přidat úkol
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2">
        <DialogHeader>
          <DialogTitle>Nový úkol</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Název</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Např. Výměna vody"
              className="border-2"
            />
          </div>
          <div className="space-y-2">
            <Label>Typ</Label>
            <Select value={type} onValueChange={(v) => setType(v as Task['type'])}>
              <SelectTrigger className="border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Údržba</SelectItem>
                <SelectItem value="feeding">Krmení</SelectItem>
                <SelectItem value="waterChange">Výměna vody</SelectItem>
                <SelectItem value="dosing">Dávkování</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {aquariums.length > 0 && (
            <div className="space-y-2">
              <Label>Akvárium (volitelné)</Label>
              <Select value={aquariumId} onValueChange={setAquariumId}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Vyberte akvárium" />
                </SelectTrigger>
                <SelectContent>
                  {aquariums.map((aq) => (
                    <SelectItem key={aq.id} value={aq.id}>
                      {aq.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Termín</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border-2"
            />
          </div>
          <div className="space-y-2">
            <Label>Opakování (volitelné)</Label>
            <Select value={recurring} onValueChange={(v) => setRecurring(v as Task['recurring'])}>
              <SelectTrigger className="border-2">
                <SelectValue placeholder="Neopakuje se" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Denně</SelectItem>
                <SelectItem value="weekly">Týdně</SelectItem>
                <SelectItem value="biweekly">Každé 2 týdny</SelectItem>
                <SelectItem value="monthly">Měsíčně</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Vytvořit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

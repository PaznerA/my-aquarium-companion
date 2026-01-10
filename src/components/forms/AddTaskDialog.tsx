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
  const { t } = useI18n();
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
          {t.tasks.addTask}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2">
        <DialogHeader>
          <DialogTitle>{t.tasks.newTask}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t.tasks.taskName}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-2"
            />
          </div>
          <div className="space-y-2">
            <Label>{t.tasks.taskType}</Label>
            <Select value={type} onValueChange={(v) => setType(v as Task['type'])}>
              <SelectTrigger className="border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">{t.tasks.maintenance}</SelectItem>
                <SelectItem value="feeding">{t.tasks.feeding}</SelectItem>
                <SelectItem value="waterChange">{t.tasks.waterChange}</SelectItem>
                <SelectItem value="dosing">{t.tasks.dosing}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {aquariums.length > 0 && (
            <div className="space-y-2">
              <Label>{t.nav.aquariums} ({t.common.optional})</Label>
              <Select value={aquariumId} onValueChange={setAquariumId}>
                <SelectTrigger className="border-2">
                  <SelectValue />
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
            <Label htmlFor="dueDate">{t.tasks.dueDate}</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border-2"
            />
          </div>
          <div className="space-y-2">
            <Label>{t.tasks.recurring} ({t.common.optional})</Label>
            <Select value={recurring} onValueChange={(v) => setRecurring(v as Task['recurring'])}>
              <SelectTrigger className="border-2">
                <SelectValue placeholder={t.tasks.noRecurring} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{t.tasks.daily}</SelectItem>
                <SelectItem value="weekly">{t.tasks.weekly}</SelectItem>
                <SelectItem value="biweekly">{t.tasks.biweekly}</SelectItem>
                <SelectItem value="monthly">{t.tasks.monthly}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            {t.tasks.create}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

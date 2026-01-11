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
import type { Task, Aquarium } from '@/lib/storage';

interface EditTaskDialogProps {
  task: Task;
  aquariums: Aquarium[];
  onUpdate: (id: string, updates: Partial<Task>) => void;
  trigger?: React.ReactNode;
}

export const EditTaskDialog = ({ task, aquariums, onUpdate, trigger }: EditTaskDialogProps) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [type, setType] = useState<Task['type']>(task.type);
  const [aquariumId, setAquariumId] = useState<string>(task.aquariumId || '');
  const [dueDate, setDueDate] = useState('');
  const [recurring, setRecurring] = useState<Task['recurring'] | ''>(task.recurring || '');

  useEffect(() => {
    if (open) {
      setTitle(task.title);
      setType(task.type);
      setAquariumId(task.aquariumId || '');
      setDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
      setRecurring(task.recurring || '');
    }
  }, [open, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && dueDate) {
      onUpdate(task.id, {
        title,
        type,
        aquariumId: aquariumId || undefined,
        dueDate: new Date(dueDate).toISOString(),
        recurring: recurring || undefined,
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
          <DialogTitle>{t.tasks.editTask}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t.tasks.taskName}</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="border-2" />
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
                  <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-</SelectItem>
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
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border-2" />
          </div>
          <div className="space-y-2">
            <Label>{t.tasks.recurring} ({t.common.optional})</Label>
            <Select value={recurring} onValueChange={(v) => setRecurring(v as Task['recurring'])}>
              <SelectTrigger className="border-2">
                <SelectValue placeholder={t.tasks.noRecurring} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t.tasks.noRecurring}</SelectItem>
                <SelectItem value="daily">{t.tasks.daily}</SelectItem>
                <SelectItem value="weekly">{t.tasks.weekly}</SelectItem>
                <SelectItem value="biweekly">{t.tasks.biweekly}</SelectItem>
                <SelectItem value="monthly">{t.tasks.monthly}</SelectItem>
              </SelectContent>
            </Select>
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

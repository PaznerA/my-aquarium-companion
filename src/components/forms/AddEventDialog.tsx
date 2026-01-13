import { useState } from 'react';
import { Plus, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { useI18n } from '@/lib/i18n';
import type { Aquarium, AquariumEvent } from '@/lib/storage';

interface AddEventDialogProps {
  aquariums: Aquarium[];
  onAdd: (event: Omit<AquariumEvent, 'id' | 'userId'>) => void;
  defaultAquariumId?: string;
  defaultDate?: string;
  trigger?: React.ReactNode;
}

export const AddEventDialog = ({ aquariums, onAdd, defaultAquariumId, defaultDate, trigger }: AddEventDialogProps) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<AquariumEvent['type']>('maintenance');
  const [aquariumId, setAquariumId] = useState<string>(defaultAquariumId || '');
  const [date, setDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [recurring, setRecurring] = useState<string>('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    onAdd({
      title: title.trim(),
      type,
      aquariumId: aquariumId || undefined,
      date,
      completed: false,
      recurring: recurring as AquariumEvent['recurring'],
      notes: notes.trim() || undefined,
    });
    
    setTitle('');
    setType('maintenance');
    setAquariumId(defaultAquariumId || '');
    setRecurring('');
    setNotes('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2 border-2">
            <Plus className="h-4 w-4" />
            {t.events.addEvent}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5" />
            {t.events.newEvent}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t.events.eventName}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.events.eventName}
              className="border-2"
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t.events.eventType}</Label>
            <Select value={type} onValueChange={(v) => setType(v as AquariumEvent['type'])}>
              <SelectTrigger className="border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">{t.events.maintenance}</SelectItem>
                <SelectItem value="feeding">{t.events.feeding}</SelectItem>
                <SelectItem value="waterChange">{t.events.waterChange}</SelectItem>
                <SelectItem value="dosing">{t.events.dosing}</SelectItem>
                <SelectItem value="treatment">{t.events.treatment}</SelectItem>
                <SelectItem value="other">{t.events.other}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {aquariums.length > 0 && (
            <div className="space-y-2">
              <Label>{t.aquarium.title} ({t.common.optional})</Label>
              <Select value={aquariumId || "_global"} onValueChange={(v) => setAquariumId(v === "_global" ? "" : v)}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder={t.events.global} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_global">{t.events.global}</SelectItem>
                  {aquariums.map((aq) => (
                    <SelectItem key={aq.id} value={aq.id}>{aq.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="date">{t.events.eventDate}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-2"
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t.events.recurring}</Label>
            <Select value={recurring || "_none"} onValueChange={(v) => setRecurring(v === "_none" ? "" : v)}>
              <SelectTrigger className="border-2">
                <SelectValue placeholder={t.events.noRecurring} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">{t.events.noRecurring}</SelectItem>
                <SelectItem value="daily">{t.events.daily}</SelectItem>
                <SelectItem value="weekly">{t.events.weekly}</SelectItem>
                <SelectItem value="biweekly">{t.events.biweekly}</SelectItem>
                <SelectItem value="monthly">{t.events.monthly}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t.journal.notes} ({t.common.optional})</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.events.notesPlaceholder}
              className="border-2"
            />
          </div>
          
          <Button onClick={handleSubmit} className="w-full">
            {t.events.create}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

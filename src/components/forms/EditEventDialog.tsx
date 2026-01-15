import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
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
  DialogFooter,
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

interface EditEventDialogProps {
  event: AquariumEvent;
  aquariums: Aquarium[];
  onUpdate: (id: string, updates: Partial<AquariumEvent>) => void;
  trigger?: React.ReactNode;
}

export const EditEventDialog = ({ event, aquariums, onUpdate, trigger }: EditEventDialogProps) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [type, setType] = useState<AquariumEvent['type']>(event.type);
  const [aquariumId, setAquariumId] = useState<string>(event.aquariumId || '');
  const [date, setDate] = useState(event.date);
  const [recurring, setRecurring] = useState<string>(event.recurring || '');
  const [notes, setNotes] = useState(event.notes || '');

  useEffect(() => {
    if (open) {
      setTitle(event.title);
      setType(event.type);
      setAquariumId(event.aquariumId || '');
      setDate(event.date);
      setRecurring(event.recurring || '');
      setNotes(event.notes || '');
    }
  }, [open, event]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    onUpdate(event.id, {
      title: title.trim(),
      type,
      aquariumId: aquariumId || undefined,
      date,
      recurring: recurring ? (recurring as AquariumEvent['recurring']) : undefined,
      notes: notes.trim() || undefined,
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.events.editEvent}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">{t.events.eventName}</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              <Select value={aquariumId} onValueChange={setAquariumId}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder={t.events.global} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t.events.global}</SelectItem>
                  {aquariums.map((aq) => (
                    <SelectItem key={aq.id} value={aq.id}>{aq.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="edit-date">{t.events.eventDate}</Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-2"
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t.events.recurring}</Label>
            <Select value={recurring} onValueChange={setRecurring}>
              <SelectTrigger className="border-2">
                <SelectValue placeholder={t.events.noRecurring} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t.events.noRecurring}</SelectItem>
                <SelectItem value="daily">{t.events.daily}</SelectItem>
                <SelectItem value="weekly">{t.events.weekly}</SelectItem>
                <SelectItem value="biweekly">{t.events.biweekly}</SelectItem>
                <SelectItem value="monthly">{t.events.monthly}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">{t.journal.notes} ({t.common.optional})</Label>
            <Textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSubmit}>{t.common.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

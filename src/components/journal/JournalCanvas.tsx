import { useState, useEffect } from 'react';
import { format, addDays, subDays, isSameDay, parseISO } from 'date-fns';
import { cs, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, Check, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import type { Aquarium, Fertilizer, JournalEntry, DosingEntry, AquariumEvent } from '@/types';

interface JournalCanvasProps {
  aquarium: Aquarium;
  fertilizers: Fertilizer[];
  entry: JournalEntry | undefined;
  events: AquariumEvent[];
  onSave: (entry: Omit<JournalEntry, 'id' | 'userId'>) => void;
  onToggleEvent: (eventId: string) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const JournalCanvas = ({
  aquarium,
  fertilizers,
  entry,
  events,
  onSave,
  onToggleEvent,
  selectedDate,
  onDateChange,
}: JournalCanvasProps) => {
  const { t, language } = useI18n();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const { formSettings } = aquarium;
  const dateLocale = language === 'cs' ? cs : enUS;
  
  // Get events for selected date (global + aquarium specific)
  const dayEvents = events.filter(event => {
    const eventDate = parseISO(event.date);
    const matchesDate = isSameDay(eventDate, selectedDate);
    const matchesAquarium = !event.aquariumId || event.aquariumId === aquarium.id;
    return matchesDate && matchesAquarium;
  });
  
  // Get visible fertilizers (all except hidden ones)
  const visibleFertilizers = fertilizers.filter(
    f => !formSettings.hiddenFertilizers.includes(f.id)
  );
  
  // Form state
  const [dosingEntries, setDosingEntries] = useState<DosingEntry[]>([]);
  const [waterChanged, setWaterChanged] = useState(false);
  const [waterChangePercent, setWaterChangePercent] = useState<number>(30);
  const [vacuumed, setVacuumed] = useState(false);
  const [trimmed, setTrimmed] = useState(false);
  const [filterCleaned, setFilterCleaned] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  // Initialize form with existing entry or defaults
  useEffect(() => {
    if (entry) {
      setDosingEntries(entry.dosingEntries);
      setWaterChanged(entry.waterChanged);
      setWaterChangePercent(entry.waterChangePercent || 30);
      setVacuumed(entry.vacuumed);
      setTrimmed(entry.trimmed);
      setFilterCleaned(entry.filterCleaned);
      setPhotos(entry.photos);
      setNotes(entry.notes);
    } else {
      // Initialize dosing entries for all visible fertilizers
      setDosingEntries(
        visibleFertilizers.map(f => ({ fertilizerId: f.id, amount: 0 }))
      );
      setWaterChanged(false);
      setWaterChangePercent(30);
      setVacuumed(false);
      setTrimmed(false);
      setFilterCleaned(false);
      setPhotos([]);
      setNotes('');
    }
  }, [entry, dateStr, visibleFertilizers.length]);

  // Auto-save on changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSave({
        date: dateStr,
        aquariumId: aquarium.id,
        dosingEntries,
        waterChanged,
        waterChangePercent: waterChanged ? waterChangePercent : undefined,
        vacuumed,
        trimmed,
        filterCleaned,
        photos,
        notes,
      });
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [dosingEntries, waterChanged, waterChangePercent, vacuumed, trimmed, filterCleaned, photos, notes]);

  const handleDosingChange = (fertilizerId: string, amount: number) => {
    setDosingEntries(prev => {
      const existing = prev.find(d => d.fertilizerId === fertilizerId);
      if (existing) {
        return prev.map(d => d.fertilizerId === fertilizerId ? { ...d, amount } : d);
      }
      return [...prev, { fertilizerId, amount }];
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setPhotos(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Date Navigation */}
      <div className="flex items-center justify-between p-4 border-b-2 border-border bg-card sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => onDateChange(subDays(selectedDate, 1))}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 border-2 font-bold">
              <Calendar className="h-4 w-4" />
              {format(selectedDate, 'd. MMMM yyyy', { locale: dateLocale })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <CalendarPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        <Button variant="ghost" size="icon" onClick={() => onDateChange(addDays(selectedDate, 1))}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Form Canvas */}
      <div className="flex-1 overflow-auto p-4 space-y-6 pb-24">
        {/* Dosing Section - automatically shows all fertilizers except hidden */}
        {formSettings.showDosing && visibleFertilizers.length > 0 && (
          <Card className="p-4 border-2 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              {t.journal.dosing}
            </h3>
            <div className="grid gap-3">
              {visibleFertilizers.map(fert => {
                const dosingEntry = dosingEntries.find(d => d.fertilizerId === fert.id);
                return (
                  <div key={fert.id} className="flex items-center gap-3">
                    <Label className="flex-1 truncate">{fert.name}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        value={dosingEntry?.amount || ''}
                        onChange={(e) => handleDosingChange(fert.id, parseFloat(e.target.value) || 0)}
                        className="w-20 border-2 text-right"
                        placeholder="0"
                      />
                      <span className="text-sm text-muted-foreground w-8">{fert.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {fertilizers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                {t.journal.addFertilizersHint}
              </p>
            )}
          </Card>
        )}

        {/* Maintenance Section */}
        <Card className="p-4 border-2 space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
            {t.journal.maintenance}
          </h3>
          <div className="space-y-3">
            {formSettings.showWaterChange && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="waterChange"
                    checked={waterChanged}
                    onCheckedChange={(c) => setWaterChanged(c === true)}
                  />
                  <Label htmlFor="waterChange" className="cursor-pointer">{t.journal.waterChange}</Label>
                </div>
                {waterChanged && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={waterChangePercent}
                      onChange={(e) => setWaterChangePercent(parseInt(e.target.value) || 0)}
                      className="w-16 border-2 text-right"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                )}
              </div>
            )}
            
            {formSettings.showVacuuming && (
              <div className="flex items-center gap-3">
                <Checkbox
                  id="vacuumed"
                  checked={vacuumed}
                  onCheckedChange={(c) => setVacuumed(c === true)}
                />
                <Label htmlFor="vacuumed" className="cursor-pointer">{t.journal.vacuuming}</Label>
              </div>
            )}
            
            {formSettings.showTrimming && (
              <div className="flex items-center gap-3">
                <Checkbox
                  id="trimmed"
                  checked={trimmed}
                  onCheckedChange={(c) => setTrimmed(c === true)}
                />
                <Label htmlFor="trimmed" className="cursor-pointer">{t.journal.trimming}</Label>
              </div>
            )}
            
            {formSettings.showFilterCleaning && (
              <div className="flex items-center gap-3">
                <Checkbox
                  id="filterCleaned"
                  checked={filterCleaned}
                  onCheckedChange={(c) => setFilterCleaned(c === true)}
                />
                <Label htmlFor="filterCleaned" className="cursor-pointer">{t.journal.filterCleaning}</Label>
              </div>
            )}
          </div>
        </Card>

        {/* Photos Section */}
        {formSettings.showPhotos && (
          <Card className="p-4 border-2 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              {t.journal.photos}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative aspect-square">
                  <img
                    src={photo}
                    alt={`${t.journal.photos} ${idx + 1}`}
                    className="w-full h-full object-cover rounded border-2 border-border"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => removePhoto(idx)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-border rounded flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <span className="text-2xl text-muted-foreground">+</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
          </Card>
        )}

        {/* Events Section */}
        {formSettings.showEvents && (
          <Card className="p-4 border-2 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {t.journal.plannedEvents}
            </h3>
            {dayEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t.journal.noPlannedEvents}
              </p>
            ) : (
              <div className="space-y-2">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded border-2 transition-colors",
                      event.completed 
                        ? "border-primary/30 bg-primary/5" 
                        : "border-border"
                    )}
                  >
                    <Checkbox
                      checked={event.completed}
                      onCheckedChange={() => onToggleEvent(event.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium truncate",
                        event.completed && "line-through text-muted-foreground"
                      )}>
                        {event.title}
                      </p>
                      {!event.aquariumId && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {t.events.global}
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {t.events[event.type as keyof typeof t.events] || event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Notes Section */}
        {formSettings.showNotes && (
          <Card className="p-4 border-2 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              {t.journal.notes}
            </h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.journal.notesPlaceholder}
              className="border-2 min-h-[100px] resize-none"
            />
          </Card>
        )}
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Plus, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useI18n } from '@/lib/i18n';
import type { WaterSource, WaterSourceMeasurement } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CalendarIcon } from 'lucide-react';

interface AddMeasurementDialogProps {
  waterSource: WaterSource;
  onAdd: (measurement: Omit<WaterSourceMeasurement, 'id' | 'userId'>) => void;
}

export const AddMeasurementDialog = ({ waterSource, onAdd }: AddMeasurementDialogProps) => {
  const [open, setOpen] = useState(false);
  const { language } = useI18n();

  const [date, setDate] = useState<Date>(new Date());
  const [gh, setGh] = useState('');
  const [kh, setKh] = useState('');
  const [ph, setPh] = useState('');
  const [tds, setTds] = useState('');
  const [nitrate, setNitrate] = useState('');
  const [calcium, setCalcium] = useState('');
  const [magnesium, setMagnesium] = useState('');
  const [potassium, setPotassium] = useState('');
  const [temperature, setTemperature] = useState('');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setDate(new Date());
    setGh('');
    setKh('');
    setPh('');
    setTds('');
    setNitrate('');
    setCalcium('');
    setMagnesium('');
    setPotassium('');
    setTemperature('');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAdd({
      waterSourceId: waterSource.id,
      date: date.toISOString().split('T')[0],
      gh: gh ? parseFloat(gh) : undefined,
      kh: kh ? parseFloat(kh) : undefined,
      ph: ph ? parseFloat(ph) : undefined,
      tds: tds ? parseFloat(tds) : undefined,
      nitrate: nitrate ? parseFloat(nitrate) : undefined,
      calcium: calcium ? parseFloat(calcium) : undefined,
      magnesium: magnesium ? parseFloat(magnesium) : undefined,
      potassium: potassium ? parseFloat(potassium) : undefined,
      temperature: temperature ? parseFloat(temperature) : undefined,
      notes: notes.trim() || undefined,
    });

    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 gap-2">
          <Plus className="h-4 w-4" />
          {language === 'cs' ? 'Měření' : 'Measure'}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 max-h-[90vh] overflow-y-auto max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            {language === 'cs' ? 'Nové měření' : 'New Measurement'}: {waterSource.name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div className="space-y-2">
            <Label>{language === 'cs' ? 'Datum měření' : 'Measurement Date'}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-2",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "d.M.yyyy") : <span>{language === 'cs' ? 'Vyberte datum' : 'Pick a date'}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Key Parameters */}
          <div className="space-y-3 pt-3 border-t">
            <Label className="text-sm font-medium">
              {language === 'cs' ? 'Hlavní parametry' : 'Key Parameters'}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="m-gh" className="text-xs text-muted-foreground">GH (°dH)</Label>
                <Input
                  id="m-gh"
                  type="number"
                  step="0.1"
                  value={gh}
                  onChange={(e) => setGh(e.target.value)}
                  placeholder={waterSource.gh?.toString() ?? '0'}
                  className="border-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="m-kh" className="text-xs text-muted-foreground">KH (°dH)</Label>
                <Input
                  id="m-kh"
                  type="number"
                  step="0.1"
                  value={kh}
                  onChange={(e) => setKh(e.target.value)}
                  placeholder={waterSource.kh?.toString() ?? '0'}
                  className="border-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="m-ph" className="text-xs text-muted-foreground">pH</Label>
                <Input
                  id="m-ph"
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                  placeholder={waterSource.ph?.toString() ?? '7.0'}
                  className="border-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="m-tds" className="text-xs text-muted-foreground">TDS (ppm)</Label>
                <Input
                  id="m-tds"
                  type="number"
                  value={tds}
                  onChange={(e) => setTds(e.target.value)}
                  placeholder={waterSource.tds?.toString() ?? '0'}
                  className="border-2"
                />
              </div>
            </div>
          </div>

          {/* Extended Parameters */}
          <div className="space-y-3 pt-3 border-t">
            <Label className="text-sm font-medium">
              {language === 'cs' ? 'Rozšířené parametry' : 'Extended Parameters'}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="m-nitrate" className="text-xs text-muted-foreground">NO₃ (mg/l)</Label>
                <Input
                  id="m-nitrate"
                  type="number"
                  step="0.1"
                  value={nitrate}
                  onChange={(e) => setNitrate(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="m-temp" className="text-xs text-muted-foreground">{language === 'cs' ? 'Teplota (°C)' : 'Temp (°C)'}</Label>
                <Input
                  id="m-temp"
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="m-calcium" className="text-xs text-muted-foreground">Ca (mg/l)</Label>
                <Input
                  id="m-calcium"
                  type="number"
                  step="0.1"
                  value={calcium}
                  onChange={(e) => setCalcium(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="m-magnesium" className="text-xs text-muted-foreground">Mg (mg/l)</Label>
                <Input
                  id="m-magnesium"
                  type="number"
                  step="0.1"
                  value={magnesium}
                  onChange={(e) => setMagnesium(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="m-potassium" className="text-xs text-muted-foreground">K (mg/l)</Label>
                <Input
                  id="m-potassium"
                  type="number"
                  step="0.1"
                  value={potassium}
                  onChange={(e) => setPotassium(e.target.value)}
                  className="border-2"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2 pt-3 border-t">
            <Label htmlFor="m-notes">{language === 'cs' ? 'Poznámky' : 'Notes'}</Label>
            <Textarea
              id="m-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'cs' 
                ? 'Např. Měřeno po údržbě vodovodního řádu' 
                : 'e.g. Measured after water main maintenance'}
              className="border-2 min-h-[60px]"
            />
          </div>

          <Button type="submit" className="w-full">
            {language === 'cs' ? 'Uložit měření' : 'Save Measurement'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

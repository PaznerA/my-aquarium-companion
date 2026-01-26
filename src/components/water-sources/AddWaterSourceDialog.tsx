import { useState } from 'react';
import { Plus, Droplets, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useI18n } from '@/lib/i18n';
import type { WaterSource } from '@/lib/storage';
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

interface AddWaterSourceDialogProps {
  onAdd: (source: Omit<WaterSource, 'id' | 'userId' | 'createdAt'>) => void;
}

export const AddWaterSourceDialog = ({ onAdd }: AddWaterSourceDialogProps) => {
  const [open, setOpen] = useState(false);
  const { language } = useI18n();

  // Basic
  const [name, setName] = useState('');
  const [type, setType] = useState<WaterSource['type']>('tap');
  const [isDefault, setIsDefault] = useState(false);
  const [notes, setNotes] = useState('');

  // Basic parameters
  const [gh, setGh] = useState('');
  const [kh, setKh] = useState('');
  const [ph, setPh] = useState('');
  const [tds, setTds] = useState('');
  const [conductivity, setConductivity] = useState('');

  // Macro elements
  const [nitrate, setNitrate] = useState('');
  const [nitrite, setNitrite] = useState('');
  const [ammonia, setAmmonia] = useState('');
  const [phosphate, setPhosphate] = useState('');
  const [calcium, setCalcium] = useState('');
  const [magnesium, setMagnesium] = useState('');
  const [potassium, setPotassium] = useState('');
  const [sodium, setSodium] = useState('');
  const [chloride, setChloride] = useState('');
  const [sulfate, setSulfate] = useState('');

  // Micro elements
  const [iron, setIron] = useState('');
  const [manganese, setManganese] = useState('');
  const [copper, setCopper] = useState('');
  const [zinc, setZinc] = useState('');
  const [boron, setBoron] = useState('');
  const [molybdenum, setMolybdenum] = useState('');
  const [cobalt, setCobalt] = useState('');
  const [silicate, setSilicate] = useState('');

  // Collapsible sections
  const [macroOpen, setMacroOpen] = useState(true);
  const [microOpen, setMicroOpen] = useState(false);

  const typeOptions = [
    { value: 'tap', label: { cs: 'Kohoutková voda', en: 'Tap Water' } },
    { value: 'ro', label: { cs: 'RO voda', en: 'RO Water' } },
    { value: 'rainwater', label: { cs: 'Dešťová voda', en: 'Rainwater' } },
    { value: 'well', label: { cs: 'Studniční voda', en: 'Well Water' } },
    { value: 'mixed', label: { cs: 'Smíchaná voda', en: 'Mixed Water' } },
    { value: 'other', label: { cs: 'Jiná', en: 'Other' } },
  ];

  const resetForm = () => {
    setName('');
    setType('tap');
    setGh('');
    setKh('');
    setPh('');
    setTds('');
    setConductivity('');
    setNitrate('');
    setNitrite('');
    setAmmonia('');
    setPhosphate('');
    setCalcium('');
    setMagnesium('');
    setPotassium('');
    setSodium('');
    setChloride('');
    setSulfate('');
    setIron('');
    setManganese('');
    setCopper('');
    setZinc('');
    setBoron('');
    setMolybdenum('');
    setCobalt('');
    setSilicate('');
    setIsDefault(false);
    setNotes('');
  };

  const parseNum = (val: string) => val ? parseFloat(val) : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      type,
      gh: parseNum(gh),
      kh: parseNum(kh),
      ph: parseNum(ph),
      tds: parseNum(tds),
      conductivity: parseNum(conductivity),
      nitrate: parseNum(nitrate),
      nitrite: parseNum(nitrite),
      ammonia: parseNum(ammonia),
      phosphate: parseNum(phosphate),
      calcium: parseNum(calcium),
      magnesium: parseNum(magnesium),
      potassium: parseNum(potassium),
      sodium: parseNum(sodium),
      chloride: parseNum(chloride),
      sulfate: parseNum(sulfate),
      iron: parseNum(iron),
      manganese: parseNum(manganese),
      copper: parseNum(copper),
      zinc: parseNum(zinc),
      boron: parseNum(boron),
      molybdenum: parseNum(molybdenum),
      cobalt: parseNum(cobalt),
      silicate: parseNum(silicate),
      isDefault,
      notes: notes.trim() || undefined,
    });

    resetForm();
    setOpen(false);
  };

  const ParameterInput = ({ 
    id, 
    label, 
    value, 
    onChange, 
    step = "0.1",
    unit = "mg/l"
  }: { 
    id: string; 
    label: string; 
    value: string; 
    onChange: (v: string) => void;
    step?: string;
    unit?: string;
  }) => (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label} <span className="opacity-60">({unit})</span>
      </Label>
      <Input
        id={id}
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="border-2 h-9"
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {language === 'cs' ? 'Přidat zdroj' : 'Add Source'}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 max-h-[90vh] overflow-y-auto max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            {language === 'cs' ? 'Nový zdroj vody' : 'New Water Source'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="space-y-2">
            <Label htmlFor="name">{language === 'cs' ? 'Název' : 'Name'} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'cs' ? 'Např. Kohoutková voda - kuchyň' : 'e.g. Kitchen Tap Water'}
              className="border-2"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{language === 'cs' ? 'Typ zdroje' : 'Source Type'}</Label>
            <Select value={type} onValueChange={(v) => setType(v as WaterSource['type'])}>
              <SelectTrigger className="border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Basic Parameters */}
          <div className="space-y-3 pt-3 border-t">
            <Label className="text-sm font-medium">
              {language === 'cs' ? 'Základní parametry' : 'Basic Parameters'}
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="gh" className="text-xs text-muted-foreground">GH (°dH)</Label>
                <Input id="gh" type="number" step="0.1" value={gh} onChange={(e) => setGh(e.target.value)} placeholder="0" className="border-2 h-9" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="kh" className="text-xs text-muted-foreground">KH (°dH)</Label>
                <Input id="kh" type="number" step="0.1" value={kh} onChange={(e) => setKh(e.target.value)} placeholder="0" className="border-2 h-9" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ph" className="text-xs text-muted-foreground">pH</Label>
                <Input id="ph" type="number" step="0.1" min="0" max="14" value={ph} onChange={(e) => setPh(e.target.value)} placeholder="7.0" className="border-2 h-9" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="tds" className="text-xs text-muted-foreground">TDS (ppm)</Label>
                <Input id="tds" type="number" value={tds} onChange={(e) => setTds(e.target.value)} placeholder="0" className="border-2 h-9" />
              </div>
              <div className="space-y-1 col-span-2">
                <Label htmlFor="conductivity" className="text-xs text-muted-foreground">
                  {language === 'cs' ? 'Vodivost (μS/cm)' : 'Conductivity (μS/cm)'}
                </Label>
                <Input id="conductivity" type="number" value={conductivity} onChange={(e) => setConductivity(e.target.value)} placeholder="0" className="border-2 h-9" />
              </div>
            </div>
          </div>

          {/* Macro Elements */}
          <Collapsible open={macroOpen} onOpenChange={setMacroOpen} className="pt-3 border-t">
            <CollapsibleTrigger asChild>
              <Button type="button" variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                <Label className="text-sm font-medium cursor-pointer">
                  {language === 'cs' ? 'Makro prvky (mg/l)' : 'Macro Elements (mg/l)'}
                </Label>
                {macroOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="grid grid-cols-2 gap-3">
                <ParameterInput id="nitrate" label="NO₃" value={nitrate} onChange={setNitrate} />
                <ParameterInput id="nitrite" label="NO₂" value={nitrite} onChange={setNitrite} step="0.01" />
                <ParameterInput id="ammonia" label="NH₃/NH₄" value={ammonia} onChange={setAmmonia} step="0.01" />
                <ParameterInput id="phosphate" label="PO₄" value={phosphate} onChange={setPhosphate} step="0.01" />
                <ParameterInput id="calcium" label="Ca" value={calcium} onChange={setCalcium} />
                <ParameterInput id="magnesium" label="Mg" value={magnesium} onChange={setMagnesium} />
                <ParameterInput id="potassium" label="K" value={potassium} onChange={setPotassium} />
                <ParameterInput id="sodium" label="Na" value={sodium} onChange={setSodium} />
                <ParameterInput id="chloride" label="Cl" value={chloride} onChange={setChloride} />
                <ParameterInput id="sulfate" label="SO₄" value={sulfate} onChange={setSulfate} />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Micro Elements */}
          <Collapsible open={microOpen} onOpenChange={setMicroOpen} className="pt-3 border-t">
            <CollapsibleTrigger asChild>
              <Button type="button" variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                <Label className="text-sm font-medium cursor-pointer">
                  {language === 'cs' ? 'Mikro prvky (mg/l)' : 'Micro Elements (mg/l)'}
                </Label>
                {microOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="grid grid-cols-2 gap-3">
                <ParameterInput id="iron" label="Fe" value={iron} onChange={setIron} step="0.01" />
                <ParameterInput id="manganese" label="Mn" value={manganese} onChange={setManganese} step="0.01" />
                <ParameterInput id="copper" label="Cu" value={copper} onChange={setCopper} step="0.001" />
                <ParameterInput id="zinc" label="Zn" value={zinc} onChange={setZinc} step="0.01" />
                <ParameterInput id="boron" label="B" value={boron} onChange={setBoron} step="0.01" />
                <ParameterInput id="molybdenum" label="Mo" value={molybdenum} onChange={setMolybdenum} step="0.001" />
                <ParameterInput id="cobalt" label="Co" value={cobalt} onChange={setCobalt} step="0.001" />
                <ParameterInput id="silicate" label="SiO₂" value={silicate} onChange={setSilicate} />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Notes */}
          <div className="space-y-2 pt-3 border-t">
            <Label htmlFor="notes">{language === 'cs' ? 'Poznámky' : 'Notes'}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'cs' 
                ? 'Např. Data z rozboru vodárny z 04/2025' 
                : 'e.g. Data from water utility report 04/2025'}
              className="border-2 min-h-[60px]"
            />
          </div>

          {/* Default Toggle */}
          <div className="flex items-center justify-between pt-3 border-t">
            <Label htmlFor="isDefault" className="cursor-pointer">
              {language === 'cs' ? 'Nastavit jako výchozí zdroj' : 'Set as default source'}
            </Label>
            <Switch
              id="isDefault"
              checked={isDefault}
              onCheckedChange={setIsDefault}
            />
          </div>

          <Button type="submit" className="w-full">
            {language === 'cs' ? 'Přidat zdroj' : 'Add Source'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

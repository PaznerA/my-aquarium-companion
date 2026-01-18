import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Loader2 } from 'lucide-react';
import { createUserSpecies, saveUserSpecies, type SpeciesInfo } from '@/lib/speciesData';
import { fetchWikipediaInfo } from '@/lib/wikipedia';
import { toast } from 'sonner';

interface AddSpeciesDialogProps {
  userId: string;
  onSpeciesAdded?: (species: SpeciesInfo) => void;
}

export const AddSpeciesDialog = ({ userId, onSpeciesAdded }: AddSpeciesDialogProps) => {
  const { t, language } = useI18n();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Manual form state
  const [type, setType] = useState<'fish' | 'plant'>('fish');
  const [scientificName, setScientificName] = useState('');
  const [commonNameEn, setCommonNameEn] = useState('');
  const [commonNameCs, setCommonNameCs] = useState('');
  const [family, setFamily] = useState('');
  const [origin, setOrigin] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionCs, setDescriptionCs] = useState('');
  
  // Fish specific
  const [temperament, setTemperament] = useState<'peaceful' | 'semi-aggressive' | 'aggressive'>('peaceful');
  const [minTankSize, setMinTankSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  
  // Plant specific
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [lightRequirement, setLightRequirement] = useState<'low' | 'medium' | 'high'>('medium');
  const [co2Required, setCo2Required] = useState(false);
  
  // Water params
  const [tempMin, setTempMin] = useState('22');
  const [tempMax, setTempMax] = useState('28');
  const [phMin, setPhMin] = useState('6.0');
  const [phMax, setPhMax] = useState('8.0');
  
  // Wikipedia search
  const [wikiSearchQuery, setWikiSearchQuery] = useState('');
  const [wikiResult, setWikiResult] = useState<any>(null);

  const resetForm = () => {
    setType('fish');
    setScientificName('');
    setCommonNameEn('');
    setCommonNameCs('');
    setFamily('');
    setOrigin('');
    setDescriptionEn('');
    setDescriptionCs('');
    setTemperament('peaceful');
    setMinTankSize('');
    setMaxSize('');
    setDifficulty('easy');
    setLightRequirement('medium');
    setCo2Required(false);
    setTempMin('22');
    setTempMax('28');
    setPhMin('6.0');
    setPhMax('8.0');
    setWikiSearchQuery('');
    setWikiResult(null);
  };

  const handleWikipediaSearch = async () => {
    if (!wikiSearchQuery.trim()) return;
    
    setLoading(true);
    try {
      const result = await fetchWikipediaInfo(wikiSearchQuery);
      if (result.found && result.data) {
        setWikiResult(result.data);
        // Pre-fill form with Wikipedia data
        setScientificName(result.data.title || wikiSearchQuery);
        setCommonNameEn(result.data.title || wikiSearchQuery);
        if (result.data.description) {
          setDescriptionEn(result.data.extract || '');
        }
        toast.success(language === 'cs' ? 'Nalezeno na Wikipedii!' : 'Found on Wikipedia!');
      } else {
        toast.error(language === 'cs' ? 'Nenalezeno na Wikipedii' : 'Not found on Wikipedia');
      }
    } catch (error) {
      toast.error(language === 'cs' ? 'Chyba při hledání' : 'Search error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!scientificName.trim()) {
      toast.error(language === 'cs' ? 'Vyplňte vědecký název' : 'Enter scientific name');
      return;
    }

    const speciesData: Partial<SpeciesInfo> = {
      type,
      scientificName: scientificName.trim(),
      commonNames: {
        en: commonNameEn.trim() || scientificName.trim(),
        cs: commonNameCs.trim() || commonNameEn.trim() || scientificName.trim(),
      },
      family: family.trim() || 'Unknown',
      origin: origin.trim() || 'Unknown',
      description: {
        en: descriptionEn.trim(),
        cs: descriptionCs.trim() || descriptionEn.trim(),
      },
      waterParams: {
        tempMin: parseFloat(tempMin) || 22,
        tempMax: parseFloat(tempMax) || 28,
        phMin: parseFloat(phMin) || 6.0,
        phMax: parseFloat(phMax) || 8.0,
      },
      careNotes: { en: [], cs: [] },
    };

    if (type === 'fish') {
      speciesData.temperament = temperament;
      speciesData.minTankSize = parseInt(minTankSize) || undefined;
      speciesData.maxSize = parseInt(maxSize) || undefined;
    } else {
      speciesData.difficulty = difficulty;
      speciesData.lightRequirement = lightRequirement;
      speciesData.co2Required = co2Required;
    }

    const newSpecies = createUserSpecies(speciesData, userId, wikiResult ? 'wikipedia' : 'user');
    saveUserSpecies(newSpecies);
    
    toast.success(language === 'cs' ? 'Druh byl přidán!' : 'Species added!');
    onSpeciesAdded?.(newSpecies);
    resetForm();
    setOpen(false);
  };

  const addSpeciesText = language === 'cs' ? 'Přidat druh' : 'Add Species';
  const addCustomText = language === 'cs' ? 'Přidat vlastní druh do lexikonu' : 'Add custom species to lexicon';
  const manualText = language === 'cs' ? 'Ručně' : 'Manual';
  const fromWikiText = language === 'cs' ? 'Z Wikipedie' : 'From Wikipedia';
  const searchWikiText = language === 'cs' ? 'Hledat na Wikipedii' : 'Search Wikipedia';
  const typeText = language === 'cs' ? 'Typ' : 'Type';
  const fishText = language === 'cs' ? 'Ryba' : 'Fish';
  const plantText = language === 'cs' ? 'Rostlina' : 'Plant';
  const scientificNameText = language === 'cs' ? 'Vědecký název' : 'Scientific Name';
  const commonNameEnText = language === 'cs' ? 'Běžný název (EN)' : 'Common Name (EN)';
  const commonNameCsText = language === 'cs' ? 'Běžný název (CZ)' : 'Common Name (CZ)';
  const familyText = language === 'cs' ? 'Čeleď' : 'Family';
  const originText = language === 'cs' ? 'Původ' : 'Origin';
  const descriptionEnText = language === 'cs' ? 'Popis (EN)' : 'Description (EN)';
  const descriptionCsText = language === 'cs' ? 'Popis (CZ)' : 'Description (CZ)';
  const temperamentText = language === 'cs' ? 'Temperament' : 'Temperament';
  const peacefulText = language === 'cs' ? 'Klidný' : 'Peaceful';
  const semiAggressiveText = language === 'cs' ? 'Polo-agresivní' : 'Semi-aggressive';
  const aggressiveText = language === 'cs' ? 'Agresivní' : 'Aggressive';
  const minTankSizeText = language === 'cs' ? 'Min. velikost nádrže (l)' : 'Min. Tank Size (l)';
  const maxSizeText = language === 'cs' ? 'Max. velikost (cm)' : 'Max. Size (cm)';
  const difficultyText = language === 'cs' ? 'Obtížnost' : 'Difficulty';
  const easyText = language === 'cs' ? 'Snadná' : 'Easy';
  const mediumText = language === 'cs' ? 'Střední' : 'Medium';
  const hardText = language === 'cs' ? 'Těžká' : 'Hard';
  const lightText = language === 'cs' ? 'Světlo' : 'Light';
  const lowText = language === 'cs' ? 'Nízké' : 'Low';
  const highText = language === 'cs' ? 'Vysoké' : 'High';
  const co2Text = language === 'cs' ? 'Vyžaduje CO2' : 'Requires CO2';
  const waterParamsText = language === 'cs' ? 'Vodní parametry' : 'Water Parameters';
  const saveText = language === 'cs' ? 'Uložit' : 'Save';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-2">
          <Plus className="h-4 w-4" />
          {addSpeciesText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{addCustomText}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="manual" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">{manualText}</TabsTrigger>
            <TabsTrigger value="wikipedia">{fromWikiText}</TabsTrigger>
          </TabsList>

          <TabsContent value="wikipedia" className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={wikiSearchQuery}
                onChange={(e) => setWikiSearchQuery(e.target.value)}
                placeholder={searchWikiText}
                onKeyDown={(e) => e.key === 'Enter' && handleWikipediaSearch()}
              />
              <Button onClick={handleWikipediaSearch} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
            {wikiResult && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-bold">{wikiResult.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-3">{wikiResult.extract}</p>
                {wikiResult.thumbnail && (
                  <img src={wikiResult.thumbnail.source} alt={wikiResult.title} className="mt-2 rounded max-h-32" />
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            {/* Type selection is always visible */}
          </TabsContent>
        </Tabs>

        {/* Common form fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{typeText}</Label>
              <Select value={type} onValueChange={(v) => setType(v as 'fish' | 'plant')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fish">{fishText}</SelectItem>
                  <SelectItem value="plant">{plantText}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{familyText}</Label>
              <Input value={family} onChange={(e) => setFamily(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{scientificNameText} *</Label>
            <Input value={scientificName} onChange={(e) => setScientificName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{commonNameEnText}</Label>
              <Input value={commonNameEn} onChange={(e) => setCommonNameEn(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{commonNameCsText}</Label>
              <Input value={commonNameCs} onChange={(e) => setCommonNameCs(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{originText}</Label>
            <Input value={origin} onChange={(e) => setOrigin(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{descriptionEnText}</Label>
              <Textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>{descriptionCsText}</Label>
              <Textarea value={descriptionCs} onChange={(e) => setDescriptionCs(e.target.value)} rows={2} />
            </div>
          </div>

          {/* Fish specific fields */}
          {type === 'fish' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{temperamentText}</Label>
                <Select value={temperament} onValueChange={(v) => setTemperament(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peaceful">{peacefulText}</SelectItem>
                    <SelectItem value="semi-aggressive">{semiAggressiveText}</SelectItem>
                    <SelectItem value="aggressive">{aggressiveText}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{minTankSizeText}</Label>
                <Input type="number" value={minTankSize} onChange={(e) => setMinTankSize(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{maxSizeText}</Label>
                <Input type="number" value={maxSize} onChange={(e) => setMaxSize(e.target.value)} />
              </div>
            </div>
          )}

          {/* Plant specific fields */}
          {type === 'plant' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{difficultyText}</Label>
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">{easyText}</SelectItem>
                    <SelectItem value="medium">{mediumText}</SelectItem>
                    <SelectItem value="hard">{hardText}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{lightText}</Label>
                <Select value={lightRequirement} onValueChange={(v) => setLightRequirement(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{lowText}</SelectItem>
                    <SelectItem value="medium">{mediumText}</SelectItem>
                    <SelectItem value="high">{highText}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={co2Required}
                    onChange={(e) => setCo2Required(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{co2Text}</span>
                </label>
              </div>
            </div>
          )}

          {/* Water parameters */}
          <div className="space-y-2">
            <Label>{waterParamsText}</Label>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Temp Min (°C)</Label>
                <Input type="number" value={tempMin} onChange={(e) => setTempMin(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Temp Max (°C)</Label>
                <Input type="number" value={tempMax} onChange={(e) => setTempMax(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">pH Min</Label>
                <Input type="number" step="0.1" value={phMin} onChange={(e) => setPhMin(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">pH Max</Label>
                <Input type="number" step="0.1" value={phMax} onChange={(e) => setPhMax(e.target.value)} />
              </div>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            {saveText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

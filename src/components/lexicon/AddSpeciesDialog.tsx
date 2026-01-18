import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChipsInput } from '@/components/ui/chips-input';
import { Plus, Search, Loader2, Globe, ExternalLink } from 'lucide-react';
import { createUserSpecies, saveUserSpecies, type SpeciesInfo } from '@/lib/speciesData';
import { searchWikipediaWithTranslations } from '@/lib/wikipediaTranslations';
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
  const [namesEn, setNamesEn] = useState<string[]>([]);
  const [namesCs, setNamesCs] = useState<string[]>([]);
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
  const [wikiResult, setWikiResult] = useState<{
    thumbnail?: string;
    wikiUrl?: string;
  } | null>(null);
  const [wikiSource, setWikiSource] = useState(false);

  const resetForm = () => {
    setType('fish');
    setScientificName('');
    setNamesEn([]);
    setNamesCs([]);
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
    setWikiSource(false);
  };

  const handleWikipediaSearch = async () => {
    if (!wikiSearchQuery.trim()) return;
    
    setLoading(true);
    try {
      const result = await searchWikipediaWithTranslations(wikiSearchQuery);
      
      if (result.found) {
        setWikiResult({
          thumbnail: result.thumbnail,
          wikiUrl: result.wikiUrl,
        });
        setWikiSource(true);
        
        // Pre-fill form with Wikipedia data
        if (result.scientificName) {
          setScientificName(result.scientificName);
        } else if (result.en.length > 0) {
          // Use first English name as fallback for scientific name
          setScientificName(result.en[0]);
        }
        
        // Set all names from Wikipedia
        if (result.en.length > 0) {
          setNamesEn(result.en);
        }
        if (result.cs.length > 0) {
          setNamesCs(result.cs);
        }
        
        // Set descriptions
        if (result.description) {
          if (result.description.en) {
            setDescriptionEn(result.description.en);
          }
          if (result.description.cs) {
            setDescriptionCs(result.description.cs);
          }
        }
        
        toast.success(language === 'cs' 
          ? `Nalezeno! ${result.en.length} EN názvů, ${result.cs.length} CZ názvů` 
          : `Found! ${result.en.length} EN names, ${result.cs.length} CZ names`
        );
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

    const primaryNameEn = namesEn[0] || scientificName.trim();
    const primaryNameCs = namesCs[0] || primaryNameEn;

    const speciesData: Partial<SpeciesInfo> = {
      type,
      scientificName: scientificName.trim(),
      commonNames: {
        en: primaryNameEn,
        cs: primaryNameCs,
      },
      allNames: {
        en: namesEn.length > 0 ? namesEn : [primaryNameEn],
        cs: namesCs.length > 0 ? namesCs : [primaryNameCs],
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

    const newSpecies = createUserSpecies(speciesData, userId, wikiSource ? 'wikipedia' : 'user');
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
  const searchWikiText = language === 'cs' ? 'Hledat na Wikipedii...' : 'Search Wikipedia...';
  const typeText = language === 'cs' ? 'Typ' : 'Type';
  const fishText = language === 'cs' ? 'Ryba' : 'Fish';
  const plantText = language === 'cs' ? 'Rostlina' : 'Plant';
  const scientificNameText = language === 'cs' ? 'Vědecký název (latinsky)' : 'Scientific Name (Latin)';
  const namesEnText = language === 'cs' ? 'Anglické názvy' : 'English Names';
  const namesCsText = language === 'cs' ? 'České názvy' : 'Czech Names';
  const namesHint = language === 'cs' ? 'Přidejte názvy pomocí Enter nebo čárky' : 'Add names with Enter or comma';
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
  const wikiFoundText = language === 'cs' ? 'Načteno z Wikipedie' : 'Loaded from Wikipedia';

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

        <Tabs defaultValue="wikipedia" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wikipedia" className="gap-2">
              <Globe className="h-4 w-4" />
              {fromWikiText}
            </TabsTrigger>
            <TabsTrigger value="manual">{manualText}</TabsTrigger>
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
              <div className="p-4 bg-muted rounded-lg flex items-start gap-4">
                {wikiResult.thumbnail && (
                  <img 
                    src={wikiResult.thumbnail} 
                    alt="Species" 
                    className="rounded w-20 h-20 object-cover shrink-0" 
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Globe className="h-4 w-4" />
                    {wikiFoundText}
                  </div>
                  <p className="font-medium mt-1">{scientificName}</p>
                  <p className="text-sm text-muted-foreground">
                    EN: {namesEn.join(', ') || '-'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CZ: {namesCs.join(', ') || '-'}
                  </p>
                  {wikiResult.wikiUrl && (
                    <a 
                      href={wikiResult.wikiUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Wikipedia
                    </a>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {language === 'cs' 
                ? 'Vyplňte informace o druhu ručně níže.'
                : 'Fill in the species information manually below.'}
            </p>
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
            <Input 
              value={scientificName} 
              onChange={(e) => setScientificName(e.target.value)} 
              className="font-mono italic"
            />
          </div>

          {/* Multi-name chips inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{namesEnText}</Label>
              <ChipsInput
                value={namesEn}
                onChange={setNamesEn}
                placeholder={namesHint}
              />
            </div>
            <div className="space-y-2">
              <Label>{namesCsText}</Label>
              <ChipsInput
                value={namesCs}
                onChange={setNamesCs}
                placeholder={namesHint}
              />
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

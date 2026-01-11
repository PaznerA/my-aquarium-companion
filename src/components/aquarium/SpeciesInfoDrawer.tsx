import { useMemo, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Fish,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Info,
  Thermometer,
  Droplets,
  ChevronRight,
} from 'lucide-react';
import { speciesDatabase, findSpeciesByName, type SpeciesInfo } from '@/lib/speciesData';
import type { Fish as FishType, Plant } from '@/lib/storage';
import { SpeciesDetailDrawer } from '@/components/lexicon/SpeciesDetailDrawer';

interface SpeciesInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fish: FishType[];
  plants: Plant[];
  aquariumVolume: number;
}

interface MatchedSpecies {
  species: SpeciesInfo;
  matches: Array<{ type: 'fish' | 'plant'; name: string }>;
}

export const SpeciesInfoDrawer = ({
  isOpen,
  onClose,
  fish,
  plants,
  aquariumVolume,
}: SpeciesInfoDrawerProps) => {
  const { t, language } = useI18n();
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesInfo | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Match species from aquarium to database
  const matchedSpecies = useMemo(() => {
    const matched: MatchedSpecies[] = [];
    const matchedIds = new Set<string>();

    // Match fish
    fish.forEach(f => {
      const species = findSpeciesByName(f.name, 'fish') || findSpeciesByName(f.species, 'fish');
      if (species && !matchedIds.has(species.id)) {
        matchedIds.add(species.id);
        const existing = matched.find(m => m.species.id === species.id);
        if (existing) {
          existing.matches.push({ type: 'fish', name: f.name });
        } else {
          matched.push({ species, matches: [{ type: 'fish', name: f.name }] });
        }
      }
    });

    // Match plants
    plants.forEach(p => {
      const species = findSpeciesByName(p.name, 'plant') || findSpeciesByName(p.species, 'plant');
      if (species && !matchedIds.has(species.id)) {
        matchedIds.add(species.id);
        const existing = matched.find(m => m.species.id === species.id);
        if (existing) {
          existing.matches.push({ type: 'plant', name: p.name });
        } else {
          matched.push({ species, matches: [{ type: 'plant', name: p.name }] });
        }
      }
    });

    return matched;
  }, [fish, plants]);

  // Calculate compatibility issues
  const compatibilityIssues = useMemo(() => {
    const issues: string[] = [];

    matchedSpecies.forEach(({ species }) => {
      // Check tank size
      if (species.type === 'fish' && species.minTankSize && aquariumVolume < species.minTankSize) {
        issues.push(
          language === 'cs'
            ? `${species.commonNames.cs}: Akvárium je příliš malé (min. ${species.minTankSize}L)`
            : `${species.commonNames.en}: Tank too small (min. ${species.minTankSize}L)`
        );
      }

      // Check schooling requirements
      if (species.type === 'fish' && species.schooling && species.minSchoolSize) {
        const fishCount = fish
          .filter(f => {
            const sp = findSpeciesByName(f.name, 'fish') || findSpeciesByName(f.species, 'fish');
            return sp?.id === species.id;
          })
          .reduce((acc, f) => acc + f.count, 0);

        if (fishCount < species.minSchoolSize) {
          issues.push(
            language === 'cs'
              ? `${species.commonNames.cs}: Potřebuje hejno ${species.minSchoolSize}+ (máte ${fishCount})`
              : `${species.commonNames.en}: Needs school of ${species.minSchoolSize}+ (you have ${fishCount})`
          );
        }
      }
    });

    // Check for aggressive fish with peaceful ones
    const hasPeaceful = matchedSpecies.some(m => m.species.temperament === 'peaceful');
    const hasAggressive = matchedSpecies.some(m => m.species.temperament === 'aggressive');
    if (hasPeaceful && hasAggressive) {
      issues.push(
        language === 'cs'
          ? 'Pozor: Máte agresivní a mírumilovné ryby společně'
          : 'Warning: You have aggressive and peaceful fish together'
      );
    }

    return issues;
  }, [matchedSpecies, aquariumVolume, fish, language]);

  // Calculate optimal water parameters
  const optimalParams = useMemo(() => {
    if (matchedSpecies.length === 0) return null;

    let tempMin = 0, tempMax = 100;
    let phMin = 0, phMax = 14;

    matchedSpecies.forEach(({ species }) => {
      tempMin = Math.max(tempMin, species.waterParams.tempMin);
      tempMax = Math.min(tempMax, species.waterParams.tempMax);
      phMin = Math.max(phMin, species.waterParams.phMin);
      phMax = Math.min(phMax, species.waterParams.phMax);
    });

    return {
      temp: tempMax >= tempMin ? { min: tempMin, max: tempMax } : null,
      ph: phMax >= phMin ? { min: phMin, max: phMax } : null,
    };
  }, [matchedSpecies]);

  const handleSpeciesClick = (species: SpeciesInfo) => {
    setSelectedSpecies(species);
    setDetailOpen(true);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg border-l-2 p-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  {t.lexicon.speciesInfo}
                </SheetTitle>
              </SheetHeader>

              {matchedSpecies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t.lexicon.noSpeciesMatched}</p>
                  <p className="text-sm mt-2">{t.lexicon.noSpeciesMatchedHint}</p>
                </div>
              ) : (
                <>
                  {/* Compatibility Issues */}
                  {compatibilityIssues.length > 0 && (
                    <div className="p-4 rounded-lg bg-destructive/10 border-2 border-destructive/20">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <h3 className="font-bold text-destructive">{t.lexicon.issues}</h3>
                      </div>
                      <ul className="space-y-2">
                        {compatibilityIssues.map((issue, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="text-destructive">•</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Optimal Parameters */}
                  {optimalParams && (optimalParams.temp || optimalParams.ph) && (
                    <div className="p-4 rounded-lg bg-primary/5 border-2 border-primary/20">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <h3 className="font-bold">{t.lexicon.optimalParams}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {optimalParams.temp && (
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {optimalParams.temp.min}–{optimalParams.temp.max}°C
                            </span>
                          </div>
                        )}
                        {optimalParams.ph && (
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              pH {optimalParams.ph.min}–{optimalParams.ph.max}
                            </span>
                          </div>
                        )}
                      </div>
                      {!optimalParams.temp && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {language === 'cs'
                            ? '⚠️ Teplotní rozsahy druhů se nepřekrývají!'
                            : '⚠️ Temperature ranges don\'t overlap!'}
                        </p>
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* Species List */}
                  <div>
                    <h3 className="font-bold mb-3">{t.lexicon.identifiedSpecies}</h3>
                    <div className="space-y-2">
                      {matchedSpecies.map(({ species }) => (
                        <Button
                          key={species.id}
                          variant="ghost"
                          className="w-full justify-start p-3 h-auto border-2 hover:bg-muted/50"
                          onClick={() => handleSpeciesClick(species)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className={`p-2 rounded-lg ${species.type === 'fish' ? 'bg-primary/10' : 'bg-secondary'}`}>
                              {species.type === 'fish' ? (
                                <Fish className="h-4 w-4 text-primary" />
                              ) : (
                                <Leaf className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-medium">
                                {language === 'cs' ? species.commonNames.cs : species.commonNames.en}
                              </p>
                              <p className="text-xs text-muted-foreground italic">
                                {species.scientificName}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Unmatched species info */}
                  {(fish.length + plants.length) > matchedSpecies.length && (
                    <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      <p>
                        {language === 'cs'
                          ? `${(fish.length + plants.length) - matchedSpecies.length} druhů nebylo nalezeno v databázi. Můžete je najít v Lexikonu.`
                          : `${(fish.length + plants.length) - matchedSpecies.length} species not found in database. You can find them in the Lexicon.`}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Detail Drawer */}
      <SpeciesDetailDrawer
        species={selectedSpecies}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        isFavorite={false}
        onToggleFavorite={() => {}}
      />
    </>
  );
};

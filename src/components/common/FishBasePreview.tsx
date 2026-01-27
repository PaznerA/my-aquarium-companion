import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Database, Plus, X, Fish, Thermometer, Droplets, Ruler, AlertTriangle, CheckCircle } from 'lucide-react';
import { getFishBaseDetails, getFishBaseCommonNames, type FishBaseSpecies, type FishBaseSearchResult } from '@/lib/fishbase';

interface FishBasePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: FishBasePreviewData) => void;
  fish: FishBaseSearchResult | null;
  language: 'cs' | 'en';
}

export interface FishBasePreviewData {
  scientificName: string;
  commonName?: string;
  family?: string;
  tempMin?: number;
  tempMax?: number;
  phMin?: number;
  phMax?: number;
  maxLengthCm?: number;
  freshwater?: boolean;
  saltwater?: boolean;
  aquarium?: boolean;
  commonNames: { name: string; language: string }[];
}

export const FishBasePreview = ({
  isOpen,
  onClose,
  onAdd,
  fish,
  language,
}: FishBasePreviewProps) => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<FishBaseSpecies | null>(null);
  const [commonNames, setCommonNames] = useState<{ name: string; language: string }[]>([]);

  useEffect(() => {
    if (isOpen && fish) {
      setLoading(true);
      setDetails(null);
      setCommonNames([]);
      
      // Fetch details and common names in parallel
      Promise.all([
        getFishBaseDetails(fish.id),
        getFishBaseCommonNames(fish.id),
      ]).then(([detailsResult, namesResult]) => {
        setDetails(detailsResult);
        setCommonNames(namesResult);
      }).catch(console.error).finally(() => {
        setLoading(false);
      });
    }
  }, [isOpen, fish]);

  if (!fish) return null;

  const texts = {
    title: language === 'cs' ? 'FishBase - Detail druhu' : 'FishBase - Species Detail',
    add: language === 'cs' ? 'Přidat do lexikonu' : 'Add to Lexicon',
    cancel: language === 'cs' ? 'Zrušit' : 'Cancel',
    scientificName: language === 'cs' ? 'Vědecký název' : 'Scientific Name',
    family: language === 'cs' ? 'Čeleď' : 'Family',
    maxSize: language === 'cs' ? 'Max. velikost' : 'Max Size',
    temperature: language === 'cs' ? 'Teplota' : 'Temperature',
    commonNames: language === 'cs' ? 'Běžné názvy' : 'Common Names',
    habitat: language === 'cs' ? 'Prostředí' : 'Habitat',
    freshwater: language === 'cs' ? 'Sladkovodní' : 'Freshwater',
    saltwater: language === 'cs' ? 'Mořská' : 'Saltwater',
    aquariumFish: language === 'cs' ? 'Akvarijní ryba' : 'Aquarium Fish',
    source: language === 'cs' ? 'Zdroj: FishBase.org' : 'Source: FishBase.org',
    loading: language === 'cs' ? 'Načítám detaily...' : 'Loading details...',
    noData: language === 'cs' ? 'Data nejsou k dispozici' : 'Data not available',
  };

  const handleAdd = () => {
    const data: FishBasePreviewData = {
      scientificName: fish.scientificName,
      commonName: fish.commonName,
      family: details?.family || fish.family,
      tempMin: details?.tempMin,
      tempMax: details?.tempMax,
      phMin: details?.phMin,
      phMax: details?.phMax,
      maxLengthCm: details?.maxLengthCm || fish.maxLength,
      freshwater: details?.freshwater,
      saltwater: details?.saltwater,
      aquarium: details?.aquarium ?? fish.aquarium,
      commonNames,
    };
    onAdd(data);
  };

  // Get English and Czech names from common names
  const englishNames = commonNames.filter(n => n.language === 'English').slice(0, 5);
  const czechNames = commonNames.filter(n => n.language === 'Czech').slice(0, 5);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            {texts.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {texts.title}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 pr-4">
            {/* Header */}
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Fish className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold italic truncate">{fish.scientificName}</h3>
                {fish.commonName && (
                  <p className="text-sm text-muted-foreground">
                    {fish.commonName}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="secondary" className="gap-1 bg-blue-500/10 text-blue-700 dark:text-blue-400">
                    <Database className="h-3 w-3" />
                    FishBase
                  </Badge>
                  {(details?.aquarium ?? fish.aquarium) && (
                    <Badge className="bg-green-500/20 text-green-700 dark:text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {texts.aquariumFish}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-8 w-2/3" />
              </div>
            ) : (
              <>
                {/* Water Parameters */}
                {details && (details.tempMin || details.tempMax || details.phMin || details.phMax) && (
                  <div className="grid grid-cols-2 gap-2">
                    {(details.tempMin || details.tempMax) && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                        <Thermometer className="h-5 w-5 text-primary shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">{texts.temperature}</p>
                          <p className="font-medium">
                            {details.tempMin || '?'}–{details.tempMax || '?'}°C
                          </p>
                        </div>
                      </div>
                    )}
                    {(details.phMin || details.phMax) && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                        <Droplets className="h-5 w-5 text-primary shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">pH</p>
                          <p className="font-medium">
                            {details.phMin || '?'}–{details.phMax || '?'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Size & Family */}
                <div className="grid grid-cols-2 gap-2">
                  {(details?.maxLengthCm || fish.maxLength) && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Ruler className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">{texts.maxSize}</p>
                        <p className="font-medium">{details?.maxLengthCm || fish.maxLength} cm</p>
                      </div>
                    </div>
                  )}
                  {(details?.family || fish.family) && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Fish className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">{texts.family}</p>
                        <p className="font-medium truncate">{details?.family || fish.family}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Habitat */}
                {details && (details.freshwater || details.saltwater) && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1.5">
                      {texts.habitat}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {details.freshwater && (
                        <Badge variant="outline" className="text-xs">
                          💧 {texts.freshwater}
                        </Badge>
                      )}
                      {details.saltwater && (
                        <Badge variant="outline" className="text-xs">
                          🌊 {texts.saltwater}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Danger warning */}
                {details?.dangerous && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <span className="text-sm">{details.dangerous}</span>
                  </div>
                )}

                {/* Common names */}
                {englishNames.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1.5">
                      {texts.commonNames} (EN)
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {englishNames.map((name, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {name.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {czechNames.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1.5">
                      {texts.commonNames} (CZ)
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {czechNames.map((name, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {name.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Source note */}
            <p className="text-xs text-muted-foreground pt-2 border-t">
              {texts.source}
            </p>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            {texts.cancel}
          </Button>
          <Button onClick={handleAdd} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            {texts.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

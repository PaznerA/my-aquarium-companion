import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Database, 
  Thermometer, 
  Droplets, 
  Ruler, 
  AlertTriangle, 
  CheckCircle,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { searchFishBase, getFishBaseDetails, type FishBaseSpecies, type FishBaseSearchResult } from '@/lib/fishbase';

interface FishBaseDetailPanelProps {
  scientificName: string;
  language: 'cs' | 'en';
}

export const FishBaseDetailPanel = ({
  scientificName,
  language,
}: FishBaseDetailPanelProps) => {
  const [loading, setLoading] = useState(true);
  const [searchResult, setSearchResult] = useState<FishBaseSearchResult | null>(null);
  const [details, setDetails] = useState<FishBaseSpecies | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!scientificName) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    setSearchResult(null);
    setDetails(null);

    // First search for the species to get the ID
    searchFishBase(scientificName)
      .then(async (results) => {
        // Find exact match or close match
        const exactMatch = results.find(
          r => r.scientificName.toLowerCase() === scientificName.toLowerCase()
        );
        const match = exactMatch || results[0];
        
        if (match) {
          setSearchResult(match);
          // Fetch full details
          const fullDetails = await getFishBaseDetails(match.id);
          setDetails(fullDetails);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [scientificName]);

  const texts = {
    title: language === 'cs' ? 'FishBase Data' : 'FishBase Data',
    temperature: language === 'cs' ? 'Teplota' : 'Temperature',
    maxSize: language === 'cs' ? 'Max. velikost' : 'Max Size',
    family: language === 'cs' ? 'Čeleď' : 'Family',
    freshwater: language === 'cs' ? 'Sladkovodní' : 'Freshwater',
    saltwater: language === 'cs' ? 'Mořská' : 'Saltwater',
    aquariumFish: language === 'cs' ? 'Akvarijní' : 'Aquarium',
    notFound: language === 'cs' ? 'Nenalezeno v FishBase' : 'Not found in FishBase',
    viewOnFishBase: language === 'cs' ? 'Zobrazit na FishBase' : 'View on FishBase',
  };

  if (loading) {
    return (
      <div className="p-4 rounded-lg bg-blue-500/5 border-2 border-blue-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="text-sm text-muted-foreground">
            {language === 'cs' ? 'Načítám z FishBase...' : 'Loading from FishBase...'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    );
  }

  if (error || (!searchResult && !details)) {
    return (
      <div className="p-4 rounded-lg bg-muted/50 border-2 border-muted">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Database className="h-4 w-4" />
          <span className="text-sm">{texts.notFound}</span>
        </div>
      </div>
    );
  }

  const fishbaseUrl = searchResult 
    ? `https://www.fishbase.se/summary/${searchResult.id}` 
    : null;

  return (
    <div className="p-4 rounded-lg bg-blue-500/5 border-2 border-blue-500/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-500" />
          <h4 className="font-bold text-blue-700 dark:text-blue-400">{texts.title}</h4>
        </div>
        <div className="flex items-center gap-2">
          {(details?.aquarium ?? searchResult?.aquarium) && (
            <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              {texts.aquariumFish}
            </Badge>
          )}
          {fishbaseUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => window.open(fishbaseUrl, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              FishBase
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Temperature */}
        {details && (details.tempMin || details.tempMax) && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
            <Thermometer className="h-4 w-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{texts.temperature}</p>
              <p className="font-medium text-sm">
                {details.tempMin || '?'}–{details.tempMax || '?'}°C
              </p>
            </div>
          </div>
        )}

        {/* pH */}
        {details && (details.phMin || details.phMax) && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
            <Droplets className="h-4 w-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">pH</p>
              <p className="font-medium text-sm">
                {details.phMin || '?'}–{details.phMax || '?'}
              </p>
            </div>
          </div>
        )}

        {/* Size */}
        {(details?.maxLengthCm || searchResult?.maxLength) && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
            <Ruler className="h-4 w-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{texts.maxSize}</p>
              <p className="font-medium text-sm">
                {details?.maxLengthCm || searchResult?.maxLength} cm
              </p>
            </div>
          </div>
        )}

        {/* Family */}
        {(details?.family || searchResult?.family) && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
            <Database className="h-4 w-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{texts.family}</p>
              <p className="font-medium text-sm truncate">
                {details?.family || searchResult?.family}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Habitat tags */}
      {details && (details.freshwater || details.saltwater) && (
        <div className="flex flex-wrap gap-1.5 mt-3">
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
      )}

      {/* Danger warning */}
      {details?.dangerous && (
        <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-destructive/10 text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="text-xs">{details.dangerous}</span>
        </div>
      )}
    </div>
  );
};

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Fish,
  Leaf,
  Thermometer,
  Droplets,
  Clock,
  Ruler,
  Users,
  Sun,
  Zap,
  ExternalLink,
  X,
} from 'lucide-react';
import type { SpeciesInfo } from '@/lib/speciesData';
import { getAllNames, getPrimaryName } from '@/lib/speciesData';

interface SpeciesQuickInfoProps {
  species: SpeciesInfo;
  isOpen: boolean;
  onClose: () => void;
  onSelect: () => void;
  language: 'en' | 'cs';
  returnFocusRef?: React.RefObject<HTMLElement>;
}

export const SpeciesQuickInfo = ({
  species,
  isOpen,
  onClose,
  onSelect,
  language,
  returnFocusRef,
}: SpeciesQuickInfoProps) => {
  const selectButtonRef = useRef<HTMLButtonElement>(null);

  // Focus select button when modal opens
  useEffect(() => {
    if (isOpen && species) {
      setTimeout(() => {
        selectButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen, species]);

  // Early return if no species - must be after hooks
  if (!species) return null;

  const handleClose = () => {
    onClose();
    // Return focus to input
    setTimeout(() => {
      returnFocusRef?.current?.focus();
    }, 50);
  };

  const handleSelect = () => {
    onSelect();
    // Focus will be handled by the parent component
  };

  const primaryName = getPrimaryName(species, language);
  const allEnglishNames = getAllNames(species, 'en');
  const allCzechNames = getAllNames(species, 'cs');
  const description = language === 'cs' ? species.description.cs : species.description.en;

  const t = {
    select: language === 'cs' ? 'Vybrat' : 'Select',
    close: language === 'cs' ? 'Zavřít' : 'Close',
    names: language === 'cs' ? 'Názvy' : 'Names',
    english: language === 'cs' ? 'Anglicky' : 'English',
    czech: language === 'cs' ? 'Česky' : 'Czech',
    latin: language === 'cs' ? 'Latinsky' : 'Latin',
    temperature: language === 'cs' ? 'Teplota' : 'Temperature',
    maxSize: language === 'cs' ? 'Max. velikost' : 'Max size',
    lifespan: language === 'cs' ? 'Délka života' : 'Lifespan',
    minSchool: language === 'cs' ? 'Min. hejno' : 'Min school',
    light: language === 'cs' ? 'Světlo' : 'Light',
    co2Required: language === 'cs' ? 'CO₂ vyžadováno' : 'CO₂ required',
    co2NotRequired: language === 'cs' ? 'CO₂ nevyžadováno' : 'CO₂ not required',
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 max-h-[80vh] overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b bg-muted/30">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${species.type === 'fish' ? 'bg-primary/10' : 'bg-secondary'}`}>
              {species.type === 'fish' ? (
                <Fish className="h-5 w-5 text-primary" />
              ) : (
                <Leaf className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg leading-tight">{primaryName}</DialogTitle>
              <p className="text-sm text-muted-foreground italic">{species.scientificName}</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[50vh]">
          <div className="p-4 space-y-4">
            {/* All Names Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">{t.names}</h4>
              
              {/* Latin */}
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0 text-xs">{t.latin}</Badge>
                <span className="text-sm italic">{species.scientificName}</span>
              </div>
              
              {/* English */}
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0 text-xs">{t.english}</Badge>
                <div className="flex flex-wrap gap-1">
                  {allEnglishNames.map((name, i) => (
                    <span key={i} className="text-sm">
                      {name}{i < allEnglishNames.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Czech */}
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0 text-xs">{t.czech}</Badge>
                <div className="flex flex-wrap gap-1">
                  {allCzechNames.map((name, i) => (
                    <span key={i} className="text-sm">
                      {name}{i < allCzechNames.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm">
                <Thermometer className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t.temperature}</p>
                  <p className="font-medium truncate">{species.waterParams.tempMin}–{species.waterParams.tempMax}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm">
                <Droplets className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">pH</p>
                  <p className="font-medium truncate">{species.waterParams.phMin}–{species.waterParams.phMax}</p>
                </div>
              </div>
              
              {species.type === 'fish' && (
                <>
                  {species.maxSize && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm">
                      <Ruler className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{t.maxSize}</p>
                        <p className="font-medium truncate">{species.maxSize} cm</p>
                      </div>
                    </div>
                  )}
                  {species.lifespan && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm">
                      <Clock className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{t.lifespan}</p>
                        <p className="font-medium truncate">{species.lifespan}</p>
                      </div>
                    </div>
                  )}
                  {species.schooling && species.minSchoolSize && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm">
                      <Users className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{t.minSchool}</p>
                        <p className="font-medium truncate">{species.minSchoolSize}+</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {species.type === 'plant' && (
                <>
                  {species.lightRequirement && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm">
                      <Sun className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{t.light}</p>
                        <p className="font-medium truncate capitalize">{species.lightRequirement}</p>
                      </div>
                    </div>
                  )}
                  {species.co2Required !== undefined && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm">
                      <Zap className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">CO₂</p>
                        <p className="font-medium truncate">
                          {species.co2Required ? t.co2Required : t.co2NotRequired}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            )}

            {/* Family & Origin */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{species.family}</Badge>
              <Badge variant="secondary">{species.origin}</Badge>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="p-4 pt-2 border-t bg-muted/30 flex gap-2">
          <Button
            ref={selectButtonRef}
            onClick={handleSelect}
            className="flex-1"
          >
            {t.select}
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
          >
            {t.close}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

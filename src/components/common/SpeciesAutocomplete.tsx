import { useState, useMemo, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Fish, Leaf, Check, Info, ChevronRight } from 'lucide-react';
import { searchSpecies, getPrimaryName, getAllNames, type SpeciesInfo } from '@/lib/speciesData';
import { cn } from '@/lib/utils';
import { SpeciesQuickInfo } from './SpeciesQuickInfo';

interface SpeciesAutocompleteProps {
  type: 'fish' | 'plant';
  value: string;
  onChange: (value: string) => void;
  onSpeciesSelect?: (species: SpeciesInfo) => void;
  label: string;
  placeholder?: string;
  language?: 'cs' | 'en';
  userId?: string;
}

export const SpeciesAutocomplete = ({
  type,
  value,
  onChange,
  onSpeciesSelect,
  label,
  placeholder,
  language = 'en',
  userId,
}: SpeciesAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [infoSpecies, setInfoSpecies] = useState<SpeciesInfo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const suggestions = useMemo(() => {
    if (!inputValue || inputValue.length < 2) return [];
    return searchSpecies(inputValue, type, userId).slice(0, 8);
  }, [inputValue, type, userId]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    if (newValue.length >= 2) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSelect = (species: SpeciesInfo) => {
    const displayName = getPrimaryName(species, language);
    setInputValue(displayName);
    onChange(displayName);
    onSpeciesSelect?.(species);
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleShowInfo = (species: SpeciesInfo, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setInfoSpecies(species);
  };

  const handleInfoClose = () => {
    setInfoSpecies(null);
    // Keep dropdown open and focus input
    inputRef.current?.focus();
  };

  const handleInfoSelect = () => {
    if (infoSpecies) {
      handleSelect(infoSpecies);
      setInfoSpecies(null);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'ArrowRight':
        // Show info modal for selected item
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          handleShowInfo(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  const Icon = type === 'fish' ? Fish : Leaf;

  const noResultsText = language === 'cs' ? 'Žádné výsledky v lexikonu' : 'No results in lexicon';
  const suggestionsText = language === 'cs' ? 'Návrhy z lexikonu' : 'Suggestions from lexicon';
  const defaultPlaceholder = type === 'fish' 
    ? (language === 'cs' ? 'Název ryby...' : 'Fish name...') 
    : (language === 'cs' ? 'Název rostliny...' : 'Plant name...');
  const infoHint = language === 'cs' ? '→ pro info' : '→ for info';

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => inputValue.length >= 2 && suggestions.length > 0 && setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || defaultPlaceholder}
              className="pl-10 border-2"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0 z-50 bg-popover" 
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandList>
              <CommandEmpty>{noResultsText}</CommandEmpty>
              <CommandGroup heading={
                <div className="flex justify-between items-center">
                  <span>{suggestionsText}</span>
                  <span className="text-xs text-muted-foreground opacity-70">{infoHint}</span>
                </div>
              }>
                {suggestions.map((species, index) => {
                  const primaryName = getPrimaryName(species, language);
                  const allNames = getAllNames(species, language);
                  const hasMultipleNames = allNames.length > 1;
                  const isSelected = index === selectedIndex;

                  return (
                    <CommandItem
                      key={species.id}
                      value={species.scientificName}
                      onSelect={() => handleSelect(species)}
                      className={cn(
                        "cursor-pointer group",
                        isSelected && "bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Icon className="h-4 w-4 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-medium truncate">{primaryName}</p>
                            {hasMultipleNames && (
                              <span className="text-xs text-muted-foreground">
                                +{allNames.length - 1}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground italic truncate">
                            {species.scientificName}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0 hidden sm:inline-flex">
                          {species.family}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleShowInfo(species, e)}
                          tabIndex={-1}
                        >
                          <Info className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      {inputValue.toLowerCase() === primaryName.toLowerCase() && (
                        <Check className="h-4 w-4 text-primary ml-2 shrink-0" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Quick Info Modal */}
      <SpeciesQuickInfo
        species={infoSpecies!}
        isOpen={!!infoSpecies}
        onClose={handleInfoClose}
        onSelect={handleInfoSelect}
        language={language}
        returnFocusRef={inputRef}
      />
    </div>
  );
};

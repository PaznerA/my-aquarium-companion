import { useState, useMemo, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Fish, Leaf, Check } from 'lucide-react';
import { searchSpecies, type SpeciesInfo } from '@/lib/speciesData';
import { cn } from '@/lib/utils';

interface SpeciesAutocompleteProps {
  type: 'fish' | 'plant';
  value: string;
  onChange: (value: string) => void;
  onSpeciesSelect?: (species: SpeciesInfo) => void;
  label: string;
  placeholder?: string;
  language?: 'cs' | 'en';
}

export const SpeciesAutocomplete = ({
  type,
  value,
  onChange,
  onSpeciesSelect,
  label,
  placeholder,
  language = 'en',
}: SpeciesAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const suggestions = useMemo(() => {
    if (!inputValue || inputValue.length < 2) return [];
    return searchSpecies(inputValue, type).slice(0, 8);
  }, [inputValue, type]);

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
    const displayName = language === 'cs' ? species.commonNames.cs : species.commonNames.en;
    setInputValue(displayName);
    onChange(displayName);
    onSpeciesSelect?.(species);
    setOpen(false);
  };

  const Icon = type === 'fish' ? Fish : Leaf;

  const noResultsText = language === 'cs' ? 'Žádné výsledky' : 'No results';
  const suggestionsText = language === 'cs' ? 'Návrhy z lexikonu' : 'Suggestions from lexicon';
  const defaultPlaceholder = type === 'fish' 
    ? (language === 'cs' ? 'Název ryby...' : 'Fish name...') 
    : (language === 'cs' ? 'Název rostliny...' : 'Plant name...');

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
              placeholder={placeholder || defaultPlaceholder}
              className="pl-10 border-2"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0" 
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandList>
              <CommandEmpty>{noResultsText}</CommandEmpty>
              <CommandGroup heading={suggestionsText}>
                {suggestions.map((species) => (
                  <CommandItem
                    key={species.id}
                    value={species.scientificName}
                    onSelect={() => handleSelect(species)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Icon className="h-4 w-4 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {language === 'cs' ? species.commonNames.cs : species.commonNames.en}
                        </p>
                        <p className="text-xs text-muted-foreground italic truncate">
                          {species.scientificName}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {species.family}
                      </Badge>
                    </div>
                    {inputValue.toLowerCase() === (language === 'cs' ? species.commonNames.cs : species.commonNames.en).toLowerCase() && (
                      <Check className="h-4 w-4 text-primary ml-2" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

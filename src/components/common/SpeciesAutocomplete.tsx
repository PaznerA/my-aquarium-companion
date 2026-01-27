import { useState, useMemo, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Fish, Leaf, Check, Info, Globe, Loader2, Eye, BookOpen, Database } from 'lucide-react';
import { searchSpecies, getPrimaryName, getAllNames, createUserSpecies, saveUserSpecies, type SpeciesInfo } from '@/lib/speciesData';
import { searchWikipediaWithTranslations } from '@/lib/wikipediaTranslations';
import { searchTaxonomyDatabases, type TaxonWorksSuggestion } from '@/lib/taxonworks';
import { searchFishBase, type FishBaseSearchResult } from '@/lib/fishbase';
import { cn } from '@/lib/utils';
import { SpeciesQuickInfo } from './SpeciesQuickInfo';
import { WikipediaPreview } from './WikipediaPreview';
import { FishBasePreview, type FishBasePreviewData } from './FishBasePreview';
import { toast } from 'sonner';

interface SpeciesAutocompleteProps {
  type: 'fish' | 'plant';
  value: string;
  onChange: (value: string) => void;
  onSpeciesSelect?: (species: SpeciesInfo) => void;
  /** Called when scientific name is determined (from any source: lexicon, GBIF, Wikipedia) */
  onScientificNameSelect?: (scientificName: string) => void;
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
  onScientificNameSelect,
  label,
  placeholder,
  language = 'en',
  userId,
}: SpeciesAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [infoSpecies, setInfoSpecies] = useState<SpeciesInfo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [wikiResult, setWikiResult] = useState<{
    en: string[];
    cs: string[];
    scientificName?: string;
    description?: { en: string; cs: string };
    thumbnail?: string;
  } | null>(null);
  const [wikiPreviewOpen, setWikiPreviewOpen] = useState(false);
  const [taxonLoading, setTaxonLoading] = useState(false);
  const [taxonResults, setTaxonResults] = useState<TaxonWorksSuggestion[]>([]);
  const [fishbaseLoading, setFishbaseLoading] = useState(false);
  const [fishbaseResults, setFishbaseResults] = useState<FishBaseSearchResult[]>([]);
  const [fishbasePreviewOpen, setFishbasePreviewOpen] = useState(false);
  const [fishbasePreviewFish, setFishbasePreviewFish] = useState<FishBaseSearchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wikiSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const taxonSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fishbaseSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const suggestions = useMemo(() => {
    if (!inputValue || inputValue.length < 2) return [];
    return searchSpecies(inputValue, type, userId).slice(0, 8);
  }, [inputValue, type, userId]);

  // Search Wikipedia when no local results and query is long enough
  useEffect(() => {
    if (wikiSearchTimeoutRef.current) {
      clearTimeout(wikiSearchTimeoutRef.current);
    }

    // Only search Wikipedia if no local results and input is 3+ chars
    if (inputValue.length >= 3 && suggestions.length === 0) {
      setWikiLoading(true);
      wikiSearchTimeoutRef.current = setTimeout(async () => {
        try {
          const result = await searchWikipediaWithTranslations(inputValue);
          if (result.found) {
            setWikiResult({
              en: result.en,
              cs: result.cs,
              scientificName: result.scientificName,
              description: result.description,
              thumbnail: result.thumbnail,
            });
          } else {
            setWikiResult(null);
          }
        } catch (error) {
          console.error('Wikipedia search error:', error);
          setWikiResult(null);
        } finally {
          setWikiLoading(false);
        }
      }, 500); // Debounce 500ms
    } else {
      setWikiResult(null);
      setWikiLoading(false);
    }

    return () => {
      if (wikiSearchTimeoutRef.current) {
        clearTimeout(wikiSearchTimeoutRef.current);
      }
    };
  }, [inputValue, suggestions.length]);

  // Search TaxonWorks for scientific names
  useEffect(() => {
    if (taxonSearchTimeoutRef.current) {
      clearTimeout(taxonSearchTimeoutRef.current);
    }

    // Search TaxonWorks if input is 3+ chars
    if (inputValue.length >= 3) {
      setTaxonLoading(true);
      taxonSearchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchTaxonomyDatabases(inputValue, type);
          setTaxonResults(results.slice(0, 5)); // Limit to 5 results
        } catch (error) {
          console.error('TaxonWorks search error:', error);
          setTaxonResults([]);
        } finally {
          setTaxonLoading(false);
        }
      }, 300); // Debounce 300ms
    } else {
      setTaxonResults([]);
      setTaxonLoading(false);
    }

    return () => {
      if (taxonSearchTimeoutRef.current) {
        clearTimeout(taxonSearchTimeoutRef.current);
      }
    };
  }, [inputValue, type]);

  // Search FishBase for fish species (only for fish type)
  useEffect(() => {
    if (fishbaseSearchTimeoutRef.current) {
      clearTimeout(fishbaseSearchTimeoutRef.current);
    }

    // Only search FishBase for fish type
    if (type === 'fish' && inputValue.length >= 3) {
      setFishbaseLoading(true);
      fishbaseSearchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchFishBase(inputValue);
          setFishbaseResults(results.slice(0, 5));
        } catch (error) {
          console.error('FishBase search error:', error);
          setFishbaseResults([]);
        } finally {
          setFishbaseLoading(false);
        }
      }, 400); // Debounce 400ms (slightly longer than GBIF)
    } else {
      setFishbaseResults([]);
      setFishbaseLoading(false);
    }

    return () => {
      if (fishbaseSearchTimeoutRef.current) {
        clearTimeout(fishbaseSearchTimeoutRef.current);
      }
    };
  }, [inputValue, type]);

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
    // Always notify about scientific name
    onScientificNameSelect?.(species.scientificName);
    setOpen(false);
    setWikiResult(null);
    setTaxonResults([]);
    inputRef.current?.focus();
  };

  const handleSelectTaxonName = (taxon: TaxonWorksSuggestion) => {
    // When user selects from GBIF, set the scientific name
    setInputValue(taxon.scientificName);
    onChange(taxon.scientificName);
    // Notify parent about scientific name selection
    onScientificNameSelect?.(taxon.scientificName);
    toast.success(
      language === 'cs' 
        ? `Vědecký název: ${taxon.scientificName}${taxon.family ? ` (${taxon.family})` : ''}` 
        : `Scientific name: ${taxon.scientificName}${taxon.family ? ` (${taxon.family})` : ''}`
    );
    setOpen(false);
    setTaxonResults([]);
    setFishbaseResults([]);
    inputRef.current?.focus();
  };

  const handleSelectFishBase = (fish: FishBaseSearchResult) => {
    // When user selects from FishBase, set the scientific name
    setInputValue(fish.scientificName);
    onChange(fish.scientificName);
    // Notify parent about scientific name selection
    onScientificNameSelect?.(fish.scientificName);
    
    const details = [];
    if (fish.family) details.push(fish.family);
    if (fish.maxLength) details.push(`${fish.maxLength} cm`);
    const detailsStr = details.length > 0 ? ` (${details.join(', ')})` : '';
    
    toast.success(
      language === 'cs' 
        ? `FishBase: ${fish.scientificName}${detailsStr}` 
        : `FishBase: ${fish.scientificName}${detailsStr}`
    );
    setOpen(false);
    setTaxonResults([]);
    setFishbaseResults([]);
    inputRef.current?.focus();
  };

  const handleShowFishBasePreview = (fish: FishBaseSearchResult) => {
    setFishbasePreviewFish(fish);
    setFishbasePreviewOpen(true);
  };

  const handleAddFromFishBase = (data: FishBasePreviewData) => {
    // Find English and Czech names from common names
    const englishNames = data.commonNames
      .filter(n => n.language === 'English')
      .map(n => n.name)
      .slice(0, 5);
    const czechNames = data.commonNames
      .filter(n => n.language === 'Czech')
      .map(n => n.name)
      .slice(0, 5);

    const primaryNameEn = englishNames[0] || data.commonName || data.scientificName;
    const primaryNameCs = czechNames[0] || primaryNameEn;

    const speciesData: Partial<SpeciesInfo> = {
      type: 'fish',
      scientificName: data.scientificName,
      commonNames: {
        en: primaryNameEn,
        cs: primaryNameCs,
      },
      allNames: {
        en: englishNames.length > 0 ? englishNames : [primaryNameEn],
        cs: czechNames.length > 0 ? czechNames : [primaryNameCs],
      },
      family: data.family || 'Unknown',
      origin: data.freshwater ? 'Freshwater' : (data.saltwater ? 'Saltwater' : 'Unknown'),
      description: { en: '', cs: '' },
      waterParams: {
        tempMin: data.tempMin || 22,
        tempMax: data.tempMax || 28,
        phMin: data.phMin || 6.0,
        phMax: data.phMax || 8.0,
      },
      maxSize: data.maxLengthCm,
      careNotes: { en: [], cs: [] },
    };

    const newSpecies = createUserSpecies(speciesData, userId, 'fishbase');
    saveUserSpecies(newSpecies);

    toast.success(language === 'cs' ? 'Druh přidán z FishBase!' : 'Species added from FishBase!');
    
    // Notify about scientific name
    onScientificNameSelect?.(data.scientificName);
    
    // Select the newly added species
    handleSelect(newSpecies);
    setFishbasePreviewOpen(false);
    setFishbasePreviewFish(null);
  };

  const handleAddFromWikipedia = () => {
    if (!wikiResult) return;

    const primaryNameEn = wikiResult.en[0] || inputValue;
    const primaryNameCs = wikiResult.cs[0] || primaryNameEn;
    const scientificName = wikiResult.scientificName || primaryNameEn;

    const speciesData: Partial<SpeciesInfo> = {
      type,
      scientificName,
      commonNames: {
        en: primaryNameEn,
        cs: primaryNameCs,
      },
      allNames: {
        en: wikiResult.en.length > 0 ? wikiResult.en : [primaryNameEn],
        cs: wikiResult.cs.length > 0 ? wikiResult.cs : [primaryNameCs],
      },
      family: 'Unknown',
      origin: 'Unknown',
      description: wikiResult.description || { en: '', cs: '' },
      waterParams: {
        tempMin: 22,
        tempMax: 28,
        phMin: 6.0,
        phMax: 8.0,
      },
      careNotes: { en: [], cs: [] },
    };

    const newSpecies = createUserSpecies(speciesData, userId, 'wikipedia');
    saveUserSpecies(newSpecies);

    toast.success(language === 'cs' ? 'Druh přidán z Wikipedie!' : 'Species added from Wikipedia!');
    
    // Notify about scientific name
    onScientificNameSelect?.(scientificName);
    
    // Select the newly added species
    handleSelect(newSpecies);
  };

  const handleShowInfo = (species: SpeciesInfo, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setInfoSpecies(species);
  };

  const handleInfoClose = () => {
    setInfoSpecies(null);
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
    if (!open) return;

    const totalItems = suggestions.length + taxonResults.length + fishbaseResults.length + (wikiResult ? 1 : 0);
    if (totalItems === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, totalItems - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex < suggestions.length && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        } else if (selectedIndex < suggestions.length + taxonResults.length) {
          const taxonIndex = selectedIndex - suggestions.length;
          if (taxonResults[taxonIndex]) {
            handleSelectTaxonName(taxonResults[taxonIndex]);
          }
        } else if (selectedIndex < suggestions.length + taxonResults.length + fishbaseResults.length) {
          const fishbaseIndex = selectedIndex - suggestions.length - taxonResults.length;
          if (fishbaseResults[fishbaseIndex]) {
            handleSelectFishBase(fishbaseResults[fishbaseIndex]);
          }
        } else if (selectedIndex === suggestions.length + taxonResults.length + fishbaseResults.length && wikiResult) {
          handleAddFromWikipedia();
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (selectedIndex < suggestions.length && suggestions[selectedIndex]) {
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

  const noResultsText = language === 'cs' ? 'Hledám...' : 'Searching...';
  const suggestionsText = language === 'cs' ? 'Návrhy z lexikonu' : 'Suggestions from lexicon';
  const taxonText = language === 'cs' ? 'Vědecké názvy (GBIF)' : 'Scientific names (GBIF)';
  const fishbaseText = language === 'cs' ? 'FishBase - akvaristické ryby' : 'FishBase - Aquarium Fish';
  const wikiText = language === 'cs' ? 'Přidat z Wikipedie' : 'Add from Wikipedia';
  const defaultPlaceholder = type === 'fish' 
    ? (language === 'cs' ? 'Název ryby...' : 'Fish name...') 
    : (language === 'cs' ? 'Název rostliny...' : 'Plant name...');
  const infoHint = language === 'cs' ? '→ pro info' : '→ for info';
  const notFoundText = language === 'cs' ? 'Nenalezeno v lexikonu' : 'Not found in lexicon';

  const showPopover = open && (suggestions.length > 0 || taxonResults.length > 0 || fishbaseResults.length > 0 || taxonLoading || fishbaseLoading || wikiLoading || !!wikiResult);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={showPopover} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => inputValue.length >= 2 && setOpen(true)}
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
              {/* Local suggestions */}
              {suggestions.length > 0 && (
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
              )}

              {/* No local results message */}
              {suggestions.length === 0 && taxonResults.length === 0 && fishbaseResults.length === 0 && inputValue.length >= 2 && !wikiLoading && !taxonLoading && !fishbaseLoading && !wikiResult && (
                <CommandEmpty>{notFoundText}</CommandEmpty>
              )}

              {/* TaxonWorks scientific names */}
              {taxonLoading && (
                <div className="p-3 flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">{language === 'cs' ? 'Hledám vědecké názvy...' : 'Searching scientific names...'}</span>
                </div>
              )}

              {taxonResults.length > 0 && !taxonLoading && (
                <>
                  {suggestions.length > 0 && <CommandSeparator />}
                  <CommandGroup heading={taxonText}>
                    {taxonResults.map((taxon, index) => {
                      const taxonIndex = suggestions.length + index;
                      const isSelected = taxonIndex === selectedIndex;

                      return (
                        <CommandItem
                          key={taxon.id}
                          value={taxon.scientificName}
                          onSelect={() => handleSelectTaxonName(taxon)}
                          className={cn(
                            "cursor-pointer",
                            isSelected && "bg-accent"
                          )}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Globe className="h-4 w-4 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p 
                                className="font-medium italic truncate"
                                dangerouslySetInnerHTML={{ __html: taxon.labelHtml }}
                              />
                              {taxon.rank && (
                                <p className="text-xs text-muted-foreground capitalize">
                                  {taxon.rank}
                                </p>
                              )}
                            </div>
                            {taxon.family && (
                              <Badge variant="secondary" className="text-xs shrink-0">
                                {taxon.family}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs shrink-0 gap-1">
                              GBIF
                            </Badge>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}

              {/* FishBase results (only for fish) */}
              {fishbaseLoading && type === 'fish' && (
                <div className="p-3 flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">{language === 'cs' ? 'Hledám v FishBase...' : 'Searching FishBase...'}</span>
                </div>
              )}

              {fishbaseResults.length > 0 && !fishbaseLoading && (
                <>
                  {(suggestions.length > 0 || taxonResults.length > 0) && <CommandSeparator />}
                  <CommandGroup heading={fishbaseText}>
                    {fishbaseResults.map((fish, index) => {
                      const fishIndex = suggestions.length + taxonResults.length + index;
                      const isSelected = fishIndex === selectedIndex;

                      return (
                        <CommandItem
                          key={fish.id}
                          value={fish.scientificName}
                          onSelect={() => handleShowFishBasePreview(fish)}
                          className={cn(
                            "cursor-pointer group",
                            isSelected && "bg-accent"
                          )}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Database className="h-4 w-4 text-blue-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium italic truncate">
                                {fish.scientificName}
                              </p>
                              {fish.commonName && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {fish.commonName}
                                </p>
                              )}
                            </div>
                            {fish.family && (
                              <Badge variant="secondary" className="text-xs shrink-0">
                                {fish.family}
                              </Badge>
                            )}
                            {fish.maxLength && (
                              <Badge variant="outline" className="text-xs shrink-0">
                                {fish.maxLength} cm
                              </Badge>
                            )}
                            {fish.aquarium && (
                              <Badge className="text-xs shrink-0 bg-blue-500/20 text-blue-700 dark:text-blue-400">
                                🐠
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs shrink-0 gap-1 bg-blue-50 dark:bg-blue-950">
                              FishBase
                            </Badge>
                            <Eye className="h-4 w-4 text-blue-500 shrink-0" />
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}

              {/* Loading Wikipedia */}
              {wikiLoading && (
                <div className="p-3 flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">{language === 'cs' ? 'Hledám na Wikipedii...' : 'Searching Wikipedia...'}</span>
                </div>
              )}

              {/* Wikipedia result */}
              {wikiResult && !wikiLoading && (
                <>
                  {(suggestions.length > 0 || taxonResults.length > 0 || fishbaseResults.length > 0) && <CommandSeparator />}
                  <CommandGroup heading={wikiText}>
                    <CommandItem
                      onSelect={() => setWikiPreviewOpen(true)}
                      className={cn(
                        "cursor-pointer",
                        selectedIndex === suggestions.length + taxonResults.length + fishbaseResults.length && "bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-3 w-full">
                        {wikiResult.thumbnail ? (
                          <img 
                            src={wikiResult.thumbnail} 
                            alt="" 
                            className="w-10 h-10 rounded object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
                            <Globe className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">
                              {wikiResult.en[0] || wikiResult.cs[0] || inputValue}
                            </p>
                            <Badge variant="secondary" className="text-xs gap-1">
                              <Globe className="h-3 w-3" />
                              Wikipedia
                            </Badge>
                          </div>
                          {wikiResult.scientificName && (
                            <p className="text-xs text-muted-foreground italic truncate">
                              {wikiResult.scientificName}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {wikiResult.en.length > 0 && `EN: ${wikiResult.en.slice(0, 2).join(', ')}`}
                            {wikiResult.en.length > 0 && wikiResult.cs.length > 0 && ' • '}
                            {wikiResult.cs.length > 0 && `CZ: ${wikiResult.cs.slice(0, 2).join(', ')}`}
                          </p>
                        </div>
                        <Eye className="h-4 w-4 text-primary shrink-0" />
                      </div>
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
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

      {/* Wikipedia Preview Modal */}
      <WikipediaPreview
        isOpen={wikiPreviewOpen}
        onClose={() => setWikiPreviewOpen(false)}
        onAdd={() => {
          handleAddFromWikipedia();
          setWikiPreviewOpen(false);
        }}
        type={type}
        data={wikiResult}
        language={language}
      />

      {/* FishBase Preview Modal */}
      <FishBasePreview
        isOpen={fishbasePreviewOpen}
        onClose={() => {
          setFishbasePreviewOpen(false);
          setFishbasePreviewFish(null);
        }}
        onAdd={handleAddFromFishBase}
        fish={fishbasePreviewFish}
        language={language}
      />
    </div>
  );
};

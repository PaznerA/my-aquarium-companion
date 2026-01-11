import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAppData } from '@/hooks/useAppData';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Fish, Leaf, Star, StarOff, Book, ChevronRight, Info } from 'lucide-react';
import { speciesDatabase, searchSpecies, type SpeciesInfo } from '@/lib/speciesData';
import { SpeciesDetailDrawer } from '@/components/lexicon/SpeciesDetailDrawer';

const Lexicon = () => {
  const { t, language } = useI18n();
  const { data, rawData, setData, currentUserId } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'fish' | 'plant'>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesInfo | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Get favorites from localStorage (stored in rawData)
  const favorites = useMemo(() => {
    const stored = localStorage.getItem('aquarium-journal-favorites');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.filter((f: { userId: string }) => f.userId === currentUserId).map((f: { speciesId: string }) => f.speciesId);
      } catch {
        return [];
      }
    }
    return [];
  }, [currentUserId, rawData]);

  const toggleFavorite = (speciesId: string) => {
    const stored = localStorage.getItem('aquarium-journal-favorites');
    let allFavorites: Array<{ speciesId: string; userId: string }> = [];
    if (stored) {
      try {
        allFavorites = JSON.parse(stored);
      } catch {
        allFavorites = [];
      }
    }

    const existingIndex = allFavorites.findIndex(f => f.speciesId === speciesId && f.userId === currentUserId);
    if (existingIndex >= 0) {
      allFavorites.splice(existingIndex, 1);
    } else {
      allFavorites.push({ speciesId, userId: currentUserId });
    }

    localStorage.setItem('aquarium-journal-favorites', JSON.stringify(allFavorites));
    // Force re-render by updating rawData timestamp
    setData(prev => ({ ...prev }));
  };

  const filteredSpecies = useMemo(() => {
    let results = searchQuery
      ? searchSpecies(searchQuery, selectedType === 'all' ? undefined : selectedType)
      : speciesDatabase.filter(s => selectedType === 'all' || s.type === selectedType);
    return results;
  }, [searchQuery, selectedType]);

  const favoriteSpecies = useMemo(() => {
    return speciesDatabase.filter(s => favorites.includes(s.id));
  }, [favorites]);

  const handleSpeciesClick = (species: SpeciesInfo) => {
    setSelectedSpecies(species);
    setDrawerOpen(true);
  };

  const renderSpeciesCard = (species: SpeciesInfo) => {
    const isFavorite = favorites.includes(species.id);
    return (
      <Card
        key={species.id}
        className="p-4 border-2 hover:shadow-md transition-all cursor-pointer"
        onClick={() => handleSpeciesClick(species)}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${species.type === 'fish' ? 'bg-primary/10' : 'bg-secondary'}`}>
            {species.type === 'fish' ? (
              <Fish className="h-5 w-5 text-primary" />
            ) : (
              <Leaf className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold truncate">
                {language === 'cs' ? species.commonNames.cs : species.commonNames.en}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(species.id);
                }}
              >
                {isFavorite ? (
                  <Star className="h-4 w-4 fill-primary text-primary" />
                ) : (
                  <StarOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground italic truncate">{species.scientificName}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {species.family}
              </Badge>
              {species.type === 'plant' && species.difficulty && (
                <Badge
                  variant={species.difficulty === 'easy' ? 'secondary' : species.difficulty === 'medium' ? 'outline' : 'destructive'}
                  className="text-xs"
                >
                  {species.difficulty}
                </Badge>
              )}
              {species.type === 'fish' && species.temperament && (
                <Badge
                  variant={species.temperament === 'peaceful' ? 'secondary' : species.temperament === 'semi-aggressive' ? 'outline' : 'destructive'}
                  className="text-xs"
                >
                  {species.temperament}
                </Badge>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
        </div>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.lexicon.title}</h1>
          <p className="text-muted-foreground">{t.lexicon.subtitle}</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.lexicon.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedType('all')}
              className="border-2"
            >
              {t.lexicon.all}
            </Button>
            <Button
              variant={selectedType === 'fish' ? 'default' : 'outline'}
              onClick={() => setSelectedType('fish')}
              className="border-2 gap-2"
            >
              <Fish className="h-4 w-4" />
              {t.aquarium.fish}
            </Button>
            <Button
              variant={selectedType === 'plant' ? 'default' : 'outline'}
              onClick={() => setSelectedType('plant')}
              className="border-2 gap-2"
            >
              <Leaf className="h-4 w-4" />
              {t.aquarium.plants}
            </Button>
          </div>
        </div>

        {/* Tabs for All / Favorites */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="border-2">
            <TabsTrigger value="all" className="gap-2">
              <Book className="h-4 w-4" />
              {t.lexicon.allSpecies}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Star className="h-4 w-4" />
              {t.lexicon.favorites} ({favoriteSpecies.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {filteredSpecies.length === 0 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>{t.lexicon.noResults}</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredSpecies.map(renderSpeciesCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-3">
            {favoriteSpecies.length === 0 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>{t.lexicon.noFavorites}</p>
                <p className="text-sm mt-2">{t.lexicon.noFavoritesHint}</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {favoriteSpecies.map(renderSpeciesCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Species Detail Drawer */}
      <SpeciesDetailDrawer
        species={selectedSpecies}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        isFavorite={selectedSpecies ? favorites.includes(selectedSpecies.id) : false}
        onToggleFavorite={() => selectedSpecies && toggleFavorite(selectedSpecies.id)}
      />
    </Layout>
  );
};

export default Lexicon;

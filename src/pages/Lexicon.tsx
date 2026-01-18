import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHeader, EmptyState, PageWrapper, WikiInfoButton } from '@/components/common';
import { useAppData } from '@/hooks/useAppData';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Fish, Leaf, Star, StarOff, Book, ChevronRight, Info, UserPlus } from 'lucide-react';
import { getSpeciesDatabase, searchSpecies, type SpeciesInfo } from '@/lib/speciesData';
import { SpeciesDetailDrawer } from '@/components/lexicon/SpeciesDetailDrawer';
import { AddSpeciesDialog } from '@/components/lexicon/AddSpeciesDialog';

const Lexicon = () => {
  const { t, language } = useI18n();
  const { data, rawData, setData, currentUserId } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'fish' | 'plant'>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesInfo | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    setData(prev => ({ ...prev }));
  };

  const allSpecies = useMemo(() => getSpeciesDatabase(currentUserId), [currentUserId, rawData]);

  const filteredSpecies = useMemo(() => {
    let results = searchQuery
      ? searchSpecies(searchQuery, selectedType === 'all' ? undefined : selectedType, currentUserId)
      : allSpecies.filter(s => selectedType === 'all' || s.type === selectedType);
    return results;
  }, [searchQuery, selectedType, allSpecies, currentUserId]);

  const favoriteSpecies = useMemo(() => {
    return allSpecies.filter(s => favorites.includes(s.id));
  }, [favorites, allSpecies]);

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
              <WikiInfoButton
                scientificName={species.scientificName}
                commonNameEn={species.commonNames.en}
                commonNameCs={species.commonNames.cs}
                displayName={language === 'cs' ? species.commonNames.cs : species.commonNames.en}
                size="sm"
              />
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

  const handleSpeciesAdded = () => {
    // Trigger re-render by updating data
    setData(prev => ({ ...prev }));
  };

  return (
    <Layout>
      <PageWrapper>
        <PageHeader
          title={t.lexicon.title}
          subtitle={`${t.lexicon.subtitle} (${allSpecies.length} ${language === 'cs' ? 'druhů' : 'species'})`}
          actions={
            <AddSpeciesDialog userId={currentUserId} onSpeciesAdded={handleSpeciesAdded} />
          }
        />

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

        {/* Tabs */}
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
              <EmptyState
                icon={Info}
                title={t.lexicon.noResults}
              />
            ) : (
              <div className="grid gap-3">
                {filteredSpecies.map(renderSpeciesCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-3">
            {favoriteSpecies.length === 0 ? (
              <EmptyState
                icon={Star}
                title={t.lexicon.noFavorites}
                description={t.lexicon.noFavoritesHint}
              />
            ) : (
              <div className="grid gap-3">
                {favoriteSpecies.map(renderSpeciesCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </PageWrapper>

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

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  Star,
  StarOff,
  Thermometer,
  Droplets,
  Clock,
  Ruler,
  Users,
  Sun,
  Zap,
  StickyNote,
  Plus,
  Trash2,
  Save,
} from 'lucide-react';
import type { SpeciesInfo } from '@/lib/speciesData';
import { useAppData } from '@/hooks/useAppData';

interface SpeciesDetailDrawerProps {
  species: SpeciesInfo | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

interface SpeciesNote {
  id: string;
  speciesId: string;
  content: string;
  createdAt: string;
  userId: string;
}

export const SpeciesDetailDrawer = ({
  species,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}: SpeciesDetailDrawerProps) => {
  const { t, language } = useI18n();
  const { currentUserId, setData } = useAppData();
  const [notes, setNotes] = useState<SpeciesNote[]>([]);
  const [newNote, setNewNote] = useState('');

  // Load notes for this species
  useEffect(() => {
    if (species) {
      const stored = localStorage.getItem('aquarium-journal-species-notes');
      if (stored) {
        try {
          const allNotes: SpeciesNote[] = JSON.parse(stored);
          setNotes(allNotes.filter(n => n.speciesId === species.id && n.userId === currentUserId));
        } catch {
          setNotes([]);
        }
      }
    }
  }, [species, currentUserId]);

  const saveNotes = (updatedNotes: SpeciesNote[]) => {
    const stored = localStorage.getItem('aquarium-journal-species-notes');
    let allNotes: SpeciesNote[] = [];
    if (stored) {
      try {
        allNotes = JSON.parse(stored);
      } catch {
        allNotes = [];
      }
    }

    // Remove old notes for this species/user
    allNotes = allNotes.filter(n => !(n.speciesId === species?.id && n.userId === currentUserId));
    // Add updated notes
    allNotes.push(...updatedNotes);

    localStorage.setItem('aquarium-journal-species-notes', JSON.stringify(allNotes));
    setNotes(updatedNotes);
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !species) return;

    const newNoteObj: SpeciesNote = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      speciesId: species.id,
      content: newNote.trim(),
      createdAt: new Date().toISOString(),
      userId: currentUserId,
    };

    saveNotes([...notes, newNoteObj]);
    setNewNote('');
  };

  const handleDeleteNote = (noteId: string) => {
    saveNotes(notes.filter(n => n.id !== noteId));
  };

  if (!species) return null;

  const commonName = language === 'cs' ? species.commonNames.cs : species.commonNames.en;
  const description = language === 'cs' ? species.description.cs : species.description.en;
  const careNotes = language === 'cs' ? species.careNotes.cs : species.careNotes.en;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Header */}
            <SheetHeader className="text-left">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${species.type === 'fish' ? 'bg-primary/10' : 'bg-secondary'}`}>
                  {species.type === 'fish' ? (
                    <Fish className="h-8 w-8 text-primary" />
                  ) : (
                    <Leaf className="h-8 w-8 text-primary" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleFavorite}
                >
                  {isFavorite ? (
                    <Star className="h-6 w-6 fill-primary text-primary" />
                  ) : (
                    <StarOff className="h-6 w-6 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <SheetTitle className="text-2xl">{commonName}</SheetTitle>
              <p className="text-muted-foreground italic">{species.scientificName}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">{species.family}</Badge>
                <Badge variant="secondary">{species.origin}</Badge>
              </div>
            </SheetHeader>

            <Separator />

            {/* Description */}
            <div>
              <p className="text-sm leading-relaxed">{description}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <Thermometer className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{t.aquarium.temperature}</p>
                  <p className="font-medium">{species.waterParams.tempMin}–{species.waterParams.tempMax}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <Droplets className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">pH</p>
                  <p className="font-medium">{species.waterParams.phMin}–{species.waterParams.phMax}</p>
                </div>
              </div>
              {species.type === 'fish' && (
                <>
                  {species.maxSize && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Ruler className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.lexicon.maxSize}</p>
                        <p className="font-medium">{species.maxSize} cm</p>
                      </div>
                    </div>
                  )}
                  {species.lifespan && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.lexicon.lifespan}</p>
                        <p className="font-medium">{species.lifespan}</p>
                      </div>
                    </div>
                  )}
                  {species.schooling && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.lexicon.minSchool}</p>
                        <p className="font-medium">{species.minSchoolSize}+</p>
                      </div>
                    </div>
                  )}
                  {species.minTankSize && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Fish className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.lexicon.minTank}</p>
                        <p className="font-medium">{species.minTankSize} L</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              {species.type === 'plant' && (
                <>
                  {species.lightRequirement && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Sun className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.lexicon.light}</p>
                        <p className="font-medium capitalize">{species.lightRequirement}</p>
                      </div>
                    </div>
                  )}
                  {species.co2Required !== undefined && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Zap className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">CO₂</p>
                        <p className="font-medium">{species.co2Required ? t.lexicon.required : t.lexicon.notRequired}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <Separator />

            {/* Care Notes */}
            <div>
              <h3 className="font-bold mb-3">{t.lexicon.careNotes}</h3>
              <ul className="space-y-2">
                {careNotes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compatibility */}
            {species.compatibility && species.compatibility.length > 0 && (
              <div>
                <h3 className="font-bold mb-3">{t.lexicon.compatibility}</h3>
                <div className="flex flex-wrap gap-2">
                  {species.compatibility.map((compat, i) => (
                    <Badge key={i} variant="outline">
                      {compat}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* User Notes */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <StickyNote className="h-5 w-5 text-primary" />
                <h3 className="font-bold">{t.lexicon.myNotes}</h3>
              </div>

              {notes.length > 0 && (
                <div className="space-y-2 mb-3">
                  {notes.map(note => (
                    <div key={note.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm flex-1">{note.content}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(note.createdAt).toLocaleDateString(language === 'cs' ? 'cs-CZ' : 'en-US')}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Textarea
                  placeholder={t.lexicon.addNotePlaceholder}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="w-full mt-2 gap-2"
              >
                <Plus className="h-4 w-4" />
                {t.lexicon.addNote}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

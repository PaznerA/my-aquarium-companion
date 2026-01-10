import { useState } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Plus, Trash2, StickyNote, X, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { EIAnalysisPanel } from './EIAnalysisPanel';
import type { DiaryNote, Aquarium, Fertilizer, JournalEntry } from '@/lib/storage';

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notes: DiaryNote[];
  aquariumId?: string;
  aquarium?: Aquarium;
  fertilizers?: Fertilizer[];
  journalEntries?: JournalEntry[];
  onAddNote: (note: { date: string; content: string; aquariumId?: string }) => void;
  onUpdateNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesDrawer = ({
  isOpen,
  onClose,
  notes,
  aquariumId,
  aquarium,
  fertilizers = [],
  journalEntries = [],
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: NotesDrawerProps) => {
  const [newNote, setNewNote] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'ei'>('notes');

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    onAddNote({
      date: new Date().toISOString(),
      content: newNote.trim(),
      aquariumId: isGlobal ? undefined : aquariumId,
    });
    setNewNote('');
  };

  // Filter notes - show global notes + aquarium-specific notes
  const filteredNotes = notes
    .filter(n => !n.aquariumId || n.aquariumId === aquariumId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 md:w-96 bg-card border-l-2 border-border z-50 transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-border shrink-0">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'notes' | 'ei')} className="flex-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes" className="gap-2">
                <StickyNote className="h-4 w-4" />
                Poznámky
              </TabsTrigger>
              <TabsTrigger value="ei" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                EI
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-2">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'notes' ? (
            <div className="flex flex-col h-full">
              {/* New Note Input */}
              <div className="p-4 border-b-2 border-border space-y-3 shrink-0">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Přidat poznámku..."
                  className="border-2 min-h-[80px] resize-none"
                />
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isGlobal}
                      onChange={(e) => setIsGlobal(e.target.checked)}
                      className="rounded border-2"
                    />
                    <span className="text-muted-foreground">Globální</span>
                  </label>
                  <Button onClick={handleAddNote} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Přidat
                  </Button>
                </div>
              </div>

              {/* Notes List */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {filteredNotes.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm py-8">
                      Zatím žádné poznámky
                    </p>
                  ) : (
                    filteredNotes.map(note => (
                      <Card key={note.id} className="p-3 border-2 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(note.date), 'd. MMMM yyyy', { locale: cs })}
                              {!note.aquariumId && (
                                <span className="ml-2 text-primary">• Globální</span>
                              )}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onDeleteNote(note.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <Textarea
                          value={note.content}
                          onChange={(e) => onUpdateNote(note.id, e.target.value)}
                          className="border-2 min-h-[60px] resize-none text-sm"
                        />
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            aquarium && (
              <EIAnalysisPanel
                aquarium={aquarium}
                fertilizers={fertilizers}
                journalEntries={journalEntries}
              />
            )
          )}
        </div>
      </div>
    </>
  );
};

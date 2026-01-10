import { useState } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Plus, Trash2, StickyNote, X, BarChart3, Settings2, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { EIAnalysisPanel } from './EIAnalysisPanel';
import type { DiaryNote, Aquarium, Fertilizer, JournalEntry, JournalFormSettings } from '@/lib/storage';

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notes: DiaryNote[];
  aquariumId?: string;
  aquarium?: Aquarium;
  fertilizers?: Fertilizer[];
  journalEntries?: JournalEntry[];
  formSettings?: JournalFormSettings;
  onUpdateFormSettings?: (settings: Partial<JournalFormSettings>) => void;
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
  formSettings,
  onUpdateFormSettings,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: NotesDrawerProps) => {
  const [newNote, setNewNote] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'ei' | 'settings'>('notes');

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    onAddNote({
      date: new Date().toISOString(),
      content: newNote.trim(),
      aquariumId: isGlobal ? undefined : aquariumId,
    });
    setNewNote('');
  };

  const handleToggleFertilizer = (fertilizerId: string) => {
    if (!formSettings || !onUpdateFormSettings) return;
    
    const isHidden = formSettings.hiddenFertilizers.includes(fertilizerId);
    const newHidden = isHidden
      ? formSettings.hiddenFertilizers.filter(id => id !== fertilizerId)
      : [...formSettings.hiddenFertilizers, fertilizerId];
    
    onUpdateFormSettings({ hiddenFertilizers: newHidden });
  };

  const handleToggleSetting = (key: keyof JournalFormSettings) => {
    if (!formSettings || !onUpdateFormSettings) return;
    onUpdateFormSettings({ [key]: !formSettings[key] });
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
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
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
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'notes' | 'ei' | 'settings')} className="flex-1">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="notes" className="gap-1 text-xs">
                <StickyNote className="h-3 w-3" />
                Poznámky
              </TabsTrigger>
              <TabsTrigger value="ei" className="gap-1 text-xs">
                <BarChart3 className="h-3 w-3" />
                EI
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1 text-xs">
                <Settings2 className="h-3 w-3" />
                Nastavení
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-2">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'notes' && (
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
          )}
          
          {activeTab === 'ei' && aquarium && (
            <EIAnalysisPanel
              aquarium={aquarium}
              fertilizers={fertilizers}
              journalEntries={journalEntries}
            />
          )}
          
          {activeTab === 'settings' && formSettings && onUpdateFormSettings && (
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                {/* Fertilizers visibility */}
                <Card className="p-4 border-2 space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                    Hnojiva ve formuláři
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Skryjte hnojiva, která nepoužíváte pro toto akvárium
                  </p>
                  <div className="space-y-2">
                    {fertilizers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Žádná hnojiva v zásobách
                      </p>
                    ) : (
                      fertilizers.map(fert => {
                        const isHidden = formSettings.hiddenFertilizers.includes(fert.id);
                        return (
                          <div
                            key={fert.id}
                            className={cn(
                              "flex items-center justify-between p-2 rounded border-2 cursor-pointer transition-colors",
                              isHidden 
                                ? "border-border bg-muted/50 opacity-60" 
                                : "border-primary/30 bg-primary/5"
                            )}
                            onClick={() => handleToggleFertilizer(fert.id)}
                          >
                            <span className={cn("text-sm", isHidden && "line-through")}>
                              {fert.name}
                            </span>
                            {isHidden ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </Card>

                {/* Form sections */}
                <Card className="p-4 border-2 space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                    Sekce formuláře
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="showDosing"
                        checked={formSettings.showDosing}
                        onCheckedChange={() => handleToggleSetting('showDosing')}
                      />
                      <Label htmlFor="showDosing" className="cursor-pointer">Dávkování hnojiv</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="showWaterChange"
                        checked={formSettings.showWaterChange}
                        onCheckedChange={() => handleToggleSetting('showWaterChange')}
                      />
                      <Label htmlFor="showWaterChange" className="cursor-pointer">Výměna vody</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="showVacuuming"
                        checked={formSettings.showVacuuming}
                        onCheckedChange={() => handleToggleSetting('showVacuuming')}
                      />
                      <Label htmlFor="showVacuuming" className="cursor-pointer">Odsávání dna</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="showTrimming"
                        checked={formSettings.showTrimming}
                        onCheckedChange={() => handleToggleSetting('showTrimming')}
                      />
                      <Label htmlFor="showTrimming" className="cursor-pointer">Zastřihování</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="showFilterCleaning"
                        checked={formSettings.showFilterCleaning}
                        onCheckedChange={() => handleToggleSetting('showFilterCleaning')}
                      />
                      <Label htmlFor="showFilterCleaning" className="cursor-pointer">Čištění filtru</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="showPhotos"
                        checked={formSettings.showPhotos}
                        onCheckedChange={() => handleToggleSetting('showPhotos')}
                      />
                      <Label htmlFor="showPhotos" className="cursor-pointer">Fotografie</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="showNotes"
                        checked={formSettings.showNotes}
                        onCheckedChange={() => handleToggleSetting('showNotes')}
                      />
                      <Label htmlFor="showNotes" className="cursor-pointer">Poznámky</Label>
                    </div>
                  </div>
                </Card>
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </>
  );
};

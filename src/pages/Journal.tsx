import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAppData } from '@/hooks/useAppData';
import { JournalCanvas } from '@/components/journal/JournalCanvas';
import { NotesDrawer } from '@/components/journal/NotesDrawer';
import { FormSettingsDialog } from '@/components/journal/FormSettingsDialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, StickyNote } from 'lucide-react';

const Journal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data,
    getJournalEntry,
    saveJournalEntry,
    updateAquariumFormSettings,
    addDiaryNote,
    updateDiaryNote,
    deleteDiaryNote,
  } = useAppData();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);

  const aquarium = data.aquariums.find(a => a.id === id);
  
  if (!aquarium) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p>Akvárium nenalezeno</p>
          <Button onClick={() => navigate('/aquariums')} className="mt-4">
            Zpět na akvária
          </Button>
        </div>
      </Layout>
    );
  }

  const dateStr = selectedDate.toISOString().split('T')[0];
  const entry = getJournalEntry(aquarium.id, dateStr);

  return (
    <Layout hideNavPadding>
      <div className="flex h-[calc(100vh-4rem)] md:h-screen relative">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b-2 border-border bg-card">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/aquariums/${id}`)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold truncate">{aquarium.name}</h1>
              <p className="text-sm text-muted-foreground">Deník</p>
            </div>
            <FormSettingsDialog
              settings={aquarium.formSettings}
              fertilizers={data.fertilizers}
              onSave={(settings) => updateAquariumFormSettings(aquarium.id, settings)}
            />
            <Button
              variant="outline"
              size="icon"
              className="border-2"
              onClick={() => setDrawerOpen(true)}
            >
              <StickyNote className="h-4 w-4" />
            </Button>
          </div>

          {/* Journal Canvas */}
          <JournalCanvas
            aquarium={aquarium}
            fertilizers={data.fertilizers}
            entry={entry}
            onSave={saveJournalEntry}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {/* Notes Drawer */}
        <NotesDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          notes={data.diaryNotes}
          aquariumId={aquarium.id}
          onAddNote={addDiaryNote}
          onUpdateNote={updateDiaryNote}
          onDeleteNote={deleteDiaryNote}
        />
      </div>
    </Layout>
  );
};

export default Journal;

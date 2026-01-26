import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAppData } from '@/hooks/useAppData';
import { useI18n } from '@/lib/i18n';
import { JournalCanvas } from '@/components/journal/JournalCanvas';
import { NotesDrawer } from '@/components/journal/NotesDrawer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings2 } from 'lucide-react';
import { parseISO, isValid } from 'date-fns';

const Journal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useI18n();
  const {
    data,
    getJournalEntry,
    saveJournalEntry,
    updateAquariumFormSettings,
    addDiaryNote,
    updateDiaryNote,
    deleteDiaryNote,
    toggleEvent,
  } = useAppData();

  // Initialize date from URL param or today
  const getInitialDate = () => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const parsed = parseISO(dateParam);
      if (isValid(parsed)) {
        return parsed;
      }
    }
    return new Date();
  };

  const [selectedDate, setSelectedDate] = useState(getInitialDate);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Update date when URL param changes
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const parsed = parseISO(dateParam);
      if (isValid(parsed)) {
        setSelectedDate(parsed);
      }
    }
  }, [searchParams]);

  const aquarium = data.aquariums.find(a => a.id === id);
  const waterSource = aquarium?.waterSourceId 
    ? data.waterSources.find(ws => ws.id === aquarium.waterSourceId) || null
    : null;
  
  if (!aquarium) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p>{t.aquarium.notFound}</p>
          <Button onClick={() => navigate('/aquariums')} className="mt-4">
            {t.aquarium.backToAquariums}
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
              <p className="text-sm text-muted-foreground">{t.aquarium.journal}</p>
            </div>
          </div>

          {/* Journal Canvas */}
          <JournalCanvas
            aquarium={aquarium}
            fertilizers={data.fertilizers}
            entry={entry}
            events={data.events}
            onSave={saveJournalEntry}
            onToggleEvent={toggleEvent}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {/* Floating Action Button */}
        <Button
          size="lg"
          className="fixed bottom-20 md:bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-30"
          onClick={() => setDrawerOpen(true)}
        >
          <Settings2 className="h-6 w-6" />
        </Button>

        {/* Notes Drawer with EI Analysis and Settings */}
        <NotesDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          notes={data.diaryNotes}
          aquariumId={aquarium.id}
          aquarium={aquarium}
          fertilizers={data.fertilizers}
          journalEntries={data.journalEntries}
          waterSource={waterSource}
          formSettings={aquarium.formSettings}
          onUpdateFormSettings={(settings) => updateAquariumFormSettings(aquarium.id, settings)}
          onAddNote={addDiaryNote}
          onUpdateNote={updateDiaryNote}
          onDeleteNote={deleteDiaryNote}
        />
      </div>
    </Layout>
  );
};

export default Journal;

// Domain hook for journal entries and diary notes
import { useCallback } from 'react';
import type { JournalEntry, DiaryNote, AppData } from '@/types';
import { generateId } from '@/lib/storage';

export const useJournalActions = (
  data: AppData,
  setData: React.Dispatch<React.SetStateAction<AppData>>,
  currentUserId: string,
  triggerSync: () => void
) => {
  // Get journal entry for a specific date and aquarium
  const getJournalEntry = useCallback((aquariumId: string, date: string): JournalEntry | undefined => {
    return data.journalEntries.find(
      j => j.aquariumId === aquariumId && j.date === date && j.userId === currentUserId
    );
  }, [data.journalEntries, currentUserId]);

  // Save or update journal entry
  const saveJournalEntry = useCallback((entry: Omit<JournalEntry, 'id' | 'userId'> & { id?: string }) => {
    setData(prev => {
      const existing = prev.journalEntries.find(
        j => j.aquariumId === entry.aquariumId && j.date === entry.date && j.userId === currentUserId
      );
      
      if (existing) {
        return {
          ...prev,
          journalEntries: prev.journalEntries.map(j =>
            j.id === existing.id ? { ...j, ...entry } : j
          ),
        };
      }
      
      const newEntry: JournalEntry = {
        ...entry,
        id: entry.id || generateId(),
        userId: currentUserId,
      };
      return { ...prev, journalEntries: [...prev.journalEntries, newEntry] };
    });
    triggerSync();
  }, [currentUserId, triggerSync, setData]);

  const deleteJournalEntry = useCallback((id: string) => {
    setData(prev => ({ ...prev, journalEntries: prev.journalEntries.filter(j => j.id !== id) }));
    triggerSync();
  }, [triggerSync, setData]);

  // Diary note actions
  const addDiaryNote = useCallback((note: Omit<DiaryNote, 'id' | 'userId'>) => {
    const newNote: DiaryNote = { ...note, id: generateId(), userId: currentUserId };
    setData(prev => ({ ...prev, diaryNotes: [...prev.diaryNotes, newNote] }));
    triggerSync();
    return newNote;
  }, [currentUserId, triggerSync, setData]);

  const updateDiaryNote = useCallback((id: string, content: string) => {
    setData(prev => ({
      ...prev,
      diaryNotes: prev.diaryNotes.map(n => n.id === id ? { ...n, content } : n),
    }));
    triggerSync();
  }, [triggerSync, setData]);

  const deleteDiaryNote = useCallback((id: string) => {
    setData(prev => ({ ...prev, diaryNotes: prev.diaryNotes.filter(n => n.id !== id) }));
    triggerSync();
  }, [triggerSync, setData]);

  return {
    getJournalEntry,
    saveJournalEntry,
    deleteJournalEntry,
    addDiaryNote,
    updateDiaryNote,
    deleteDiaryNote,
  };
};

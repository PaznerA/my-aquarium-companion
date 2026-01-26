// Domain hook for aquarium management
import { useCallback } from 'react';
import type { Aquarium, JournalFormSettings } from '@/types';
import { generateId, getDefaultFormSettings } from '@/lib/storage';

export const useAquariumActions = (
  setData: React.Dispatch<React.SetStateAction<any>>,
  currentUserId: string,
  triggerSync: () => void
) => {
  const addAquarium = useCallback((aquarium: Omit<Aquarium, 'id' | 'dateCreated' | 'userId' | 'formSettings'>) => {
    const newAquarium: Aquarium = {
      ...aquarium,
      id: generateId(),
      dateCreated: new Date().toISOString(),
      userId: currentUserId,
      formSettings: getDefaultFormSettings(),
    };
    setData((prev: any) => ({ ...prev, aquariums: [...prev.aquariums, newAquarium] }));
    triggerSync();
    return newAquarium;
  }, [currentUserId, triggerSync, setData]);

  const updateAquarium = useCallback((id: string, updates: Partial<Aquarium>) => {
    setData((prev: any) => ({
      ...prev,
      aquariums: prev.aquariums.map((a: Aquarium) => a.id === id ? { ...a, ...updates } : a),
    }));
    triggerSync();
  }, [triggerSync, setData]);

  const updateAquariumFormSettings = useCallback((id: string, settings: Partial<JournalFormSettings>) => {
    setData((prev: any) => ({
      ...prev,
      aquariums: prev.aquariums.map((a: Aquarium) => 
        a.id === id ? { ...a, formSettings: { ...a.formSettings, ...settings } } : a
      ),
    }));
    triggerSync();
  }, [triggerSync, setData]);

  const deleteAquarium = useCallback((id: string) => {
    setData((prev: any) => ({
      ...prev,
      aquariums: prev.aquariums.filter((a: Aquarium) => a.id !== id),
      fish: prev.fish.filter((f: any) => f.aquariumId !== id),
      plants: prev.plants.filter((p: any) => p.aquariumId !== id),
      waterParameters: prev.waterParameters.filter((w: any) => w.aquariumId !== id),
      dosingLogs: prev.dosingLogs.filter((d: any) => d.aquariumId !== id),
      events: prev.events.filter((e: any) => e.aquariumId !== id),
      journalEntries: prev.journalEntries.filter((j: any) => j.aquariumId !== id),
      diaryNotes: prev.diaryNotes.filter((n: any) => n.aquariumId !== id),
    }));
    triggerSync();
  }, [triggerSync, setData]);

  return {
    addAquarium,
    updateAquarium,
    updateAquariumFormSettings,
    deleteAquarium,
  };
};

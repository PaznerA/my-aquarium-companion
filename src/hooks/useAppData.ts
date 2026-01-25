import { useState, useEffect, useCallback, useMemo } from 'react';
import { AppData, loadData, saveData, generateId, getDefaultFormSettings } from '@/lib/storage';
import type { 
  Aquarium, Fish, Plant, WaterParameter, Equipment, 
  Fertilizer, DosingLog, AquariumEvent, JournalEntry, DiaryNote, User, JournalFormSettings,
  WaterSource, WaterSourceMeasurement
} from '@/lib/storage';
import { useSyncTrigger } from './useSyncContext';

export const useAppData = () => {
  const [data, setData] = useState<AppData>(loadData);
  const { triggerSync } = useSyncTrigger();

  useEffect(() => {
    saveData(data);
  }, [data]);

  // Current user helper
  const currentUserId = data.currentUserId || data.users[0]?.id || '';

  // User-filtered data
  const filteredData = useMemo(() => ({
    aquariums: data.aquariums.filter(a => a.userId === currentUserId),
    fish: data.fish.filter(f => f.userId === currentUserId),
    plants: data.plants.filter(p => p.userId === currentUserId),
    waterParameters: data.waterParameters.filter(w => w.userId === currentUserId),
    equipment: data.equipment.filter(e => e.userId === currentUserId),
    fertilizers: data.fertilizers.filter(f => f.userId === currentUserId),
    dosingLogs: data.dosingLogs.filter(d => d.userId === currentUserId),
    events: data.events.filter(e => e.userId === currentUserId),
    journalEntries: data.journalEntries.filter(j => j.userId === currentUserId),
    diaryNotes: data.diaryNotes.filter(n => n.userId === currentUserId),
    waterSources: data.waterSources.filter(ws => ws.userId === currentUserId),
    waterSourceMeasurements: data.waterSourceMeasurements.filter(m => m.userId === currentUserId),
    users: data.users,
    currentUserId,
  }), [data, currentUserId]);

  // Users
  const addUser = useCallback((name: string) => {
    const newUser: User = {
      id: generateId(),
      name,
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ 
      ...prev, 
      users: [...prev.users, newUser],
      currentUserId: newUser.id,
    }));
    triggerSync();
    return newUser;
  }, [triggerSync]);

  const switchUser = useCallback((userId: string) => {
    setData(prev => ({ ...prev, currentUserId: userId }));
    triggerSync();
  }, [triggerSync]);

  const updateUser = useCallback((id: string, name: string) => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, name } : u),
    }));
    triggerSync();
  }, [triggerSync]);

  const deleteUser = useCallback((id: string) => {
    setData(prev => {
      const remaining = prev.users.filter(u => u.id !== id);
      return {
        ...prev,
        users: remaining,
        currentUserId: remaining[0]?.id || null,
        aquariums: prev.aquariums.filter(a => a.userId !== id),
        fish: prev.fish.filter(f => f.userId !== id),
        plants: prev.plants.filter(p => p.userId !== id),
        waterParameters: prev.waterParameters.filter(w => w.userId !== id),
        equipment: prev.equipment.filter(e => e.userId !== id),
        fertilizers: prev.fertilizers.filter(f => f.userId !== id),
        dosingLogs: prev.dosingLogs.filter(d => d.userId !== id),
        events: prev.events.filter(e => e.userId !== id),
        journalEntries: prev.journalEntries.filter(j => j.userId !== id),
        diaryNotes: prev.diaryNotes.filter(n => n.userId !== id),
      };
    });
    triggerSync();
  }, [triggerSync]);

  // Aquariums
  const addAquarium = useCallback((aquarium: Omit<Aquarium, 'id' | 'dateCreated' | 'userId' | 'formSettings'>) => {
    const newAquarium: Aquarium = {
      ...aquarium,
      id: generateId(),
      dateCreated: new Date().toISOString(),
      userId: currentUserId,
      formSettings: getDefaultFormSettings(),
    };
    setData(prev => ({ ...prev, aquariums: [...prev.aquariums, newAquarium] }));
    triggerSync();
    return newAquarium;
  }, [currentUserId, triggerSync]);

  const updateAquarium = useCallback((id: string, updates: Partial<Aquarium>) => {
    setData(prev => ({
      ...prev,
      aquariums: prev.aquariums.map(a => a.id === id ? { ...a, ...updates } : a),
    }));
    triggerSync();
  }, [triggerSync]);

  const updateAquariumFormSettings = useCallback((id: string, settings: Partial<JournalFormSettings>) => {
    setData(prev => ({
      ...prev,
      aquariums: prev.aquariums.map(a => 
        a.id === id ? { ...a, formSettings: { ...a.formSettings, ...settings } } : a
      ),
    }));
    triggerSync();
  }, [triggerSync]);

  const deleteAquarium = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      aquariums: prev.aquariums.filter(a => a.id !== id),
      fish: prev.fish.filter(f => f.aquariumId !== id),
      plants: prev.plants.filter(p => p.aquariumId !== id),
      waterParameters: prev.waterParameters.filter(w => w.aquariumId !== id),
      dosingLogs: prev.dosingLogs.filter(d => d.aquariumId !== id),
      events: prev.events.filter(e => e.aquariumId !== id),
      journalEntries: prev.journalEntries.filter(j => j.aquariumId !== id),
      diaryNotes: prev.diaryNotes.filter(n => n.aquariumId !== id),
    }));
    triggerSync();
  }, [triggerSync]);

  // Fish
  const addFish = useCallback((fish: Omit<Fish, 'id' | 'dateAdded' | 'userId'>) => {
    const newFish: Fish = {
      ...fish,
      id: generateId(),
      dateAdded: new Date().toISOString(),
      userId: currentUserId,
    };
    setData(prev => ({ ...prev, fish: [...prev.fish, newFish] }));
    triggerSync();
    return newFish;
  }, [currentUserId, triggerSync]);

  const updateFish = useCallback((id: string, updates: Partial<Fish>) => {
    setData(prev => ({
      ...prev,
      fish: prev.fish.map(f => f.id === id ? { ...f, ...updates } : f),
    }));
    triggerSync();
  }, [triggerSync]);

  const deleteFish = useCallback((id: string) => {
    setData(prev => ({ ...prev, fish: prev.fish.filter(f => f.id !== id) }));
    triggerSync();
  }, [triggerSync]);

  // Plants
  const addPlant = useCallback((plant: Omit<Plant, 'id' | 'dateAdded' | 'userId'>) => {
    const newPlant: Plant = {
      ...plant,
      id: generateId(),
      dateAdded: new Date().toISOString(),
      userId: currentUserId,
    };
    setData(prev => ({ ...prev, plants: [...prev.plants, newPlant] }));
    triggerSync();
    return newPlant;
  }, [currentUserId, triggerSync]);

  const updatePlant = useCallback((id: string, updates: Partial<Plant>) => {
    setData(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
    triggerSync();
  }, [triggerSync]);

  const deletePlant = useCallback((id: string) => {
    setData(prev => ({ ...prev, plants: prev.plants.filter(p => p.id !== id) }));
    triggerSync();
  }, [triggerSync]);

  // Water Parameters
  const addWaterParameter = useCallback((param: Omit<WaterParameter, 'id' | 'userId'>) => {
    const newParam: WaterParameter = { ...param, id: generateId(), userId: currentUserId };
    setData(prev => ({ ...prev, waterParameters: [...prev.waterParameters, newParam] }));
    triggerSync();
    return newParam;
  }, [currentUserId, triggerSync]);

  const deleteWaterParameter = useCallback((id: string) => {
    setData(prev => ({ ...prev, waterParameters: prev.waterParameters.filter(w => w.id !== id) }));
    triggerSync();
  }, [triggerSync]);

  // Equipment
  const addEquipment = useCallback((equipment: Omit<Equipment, 'id' | 'userId'>) => {
    const newEquipment: Equipment = { ...equipment, id: generateId(), userId: currentUserId };
    setData(prev => ({ ...prev, equipment: [...prev.equipment, newEquipment] }));
    triggerSync();
    return newEquipment;
  }, [currentUserId, triggerSync]);

  const updateEquipment = useCallback((id: string, updates: Partial<Equipment>) => {
    setData(prev => ({
      ...prev,
      equipment: prev.equipment.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
    triggerSync();
  }, [triggerSync]);

  const deleteEquipment = useCallback((id: string) => {
    setData(prev => ({ ...prev, equipment: prev.equipment.filter(e => e.id !== id) }));
    triggerSync();
  }, [triggerSync]);

  // Fertilizers
  const addFertilizer = useCallback((fertilizer: Omit<Fertilizer, 'id' | 'userId'>) => {
    const newFertilizer: Fertilizer = { ...fertilizer, id: generateId(), userId: currentUserId };
    setData(prev => ({ ...prev, fertilizers: [...prev.fertilizers, newFertilizer] }));
    triggerSync();
    return newFertilizer;
  }, [currentUserId, triggerSync]);

  const updateFertilizer = useCallback((id: string, updates: Partial<Fertilizer>) => {
    setData(prev => ({
      ...prev,
      fertilizers: prev.fertilizers.map(f => f.id === id ? { ...f, ...updates } : f),
    }));
    triggerSync();
  }, [triggerSync]);

  const deleteFertilizer = useCallback((id: string) => {
    setData(prev => ({ ...prev, fertilizers: prev.fertilizers.filter(f => f.id !== id) }));
    triggerSync();
  }, [triggerSync]);

  // Dosing Logs
  const addDosingLog = useCallback((log: Omit<DosingLog, 'id' | 'userId'>) => {
    const newLog: DosingLog = { ...log, id: generateId(), userId: currentUserId };
    setData(prev => ({ ...prev, dosingLogs: [...prev.dosingLogs, newLog] }));
    triggerSync();
    return newLog;
  }, [currentUserId, triggerSync]);

  // Events
  const addEvent = useCallback((event: Omit<AquariumEvent, 'id' | 'userId'>) => {
    const newEvent: AquariumEvent = { ...event, id: generateId(), userId: currentUserId };
    setData(prev => ({ ...prev, events: [...prev.events, newEvent] }));
    triggerSync();
    return newEvent;
  }, [currentUserId, triggerSync]);

  const updateEvent = useCallback((id: string, updates: Partial<AquariumEvent>) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
    triggerSync();
  }, [triggerSync]);

  const toggleEvent = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === id ? { ...e, completed: !e.completed } : e),
    }));
    triggerSync();
  }, [triggerSync]);

  const deleteEvent = useCallback((id: string) => {
    setData(prev => ({ ...prev, events: prev.events.filter(e => e.id !== id) }));
    triggerSync();
  }, [triggerSync]);

  // Journal Entries
  const getJournalEntry = useCallback((aquariumId: string, date: string): JournalEntry | undefined => {
    return data.journalEntries.find(
      j => j.aquariumId === aquariumId && j.date === date && j.userId === currentUserId
    );
  }, [data.journalEntries, currentUserId]);

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
  }, [currentUserId, triggerSync]);

  const deleteJournalEntry = useCallback((id: string) => {
    setData(prev => ({ ...prev, journalEntries: prev.journalEntries.filter(j => j.id !== id) }));
    triggerSync();
  }, [triggerSync]);

  // Diary Notes
  const addDiaryNote = useCallback((note: Omit<DiaryNote, 'id' | 'userId'>) => {
    const newNote: DiaryNote = { ...note, id: generateId(), userId: currentUserId };
    setData(prev => ({ ...prev, diaryNotes: [...prev.diaryNotes, newNote] }));
    triggerSync();
    return newNote;
  }, [currentUserId, triggerSync]);

  const updateDiaryNote = useCallback((id: string, content: string) => {
    setData(prev => ({
      ...prev,
      diaryNotes: prev.diaryNotes.map(n => n.id === id ? { ...n, content } : n),
    }));
    triggerSync();
  }, [triggerSync]);

  const deleteDiaryNote = useCallback((id: string) => {
    setData(prev => ({ ...prev, diaryNotes: prev.diaryNotes.filter(n => n.id !== id) }));
    triggerSync();
  }, [triggerSync]);

  // Water Sources
  const addWaterSource = useCallback((waterSource: Omit<WaterSource, 'id' | 'userId' | 'createdAt'>) => {
    const newWaterSource: WaterSource = {
      ...waterSource,
      id: generateId(),
      userId: currentUserId,
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, waterSources: [...prev.waterSources, newWaterSource] }));
    triggerSync();
    return newWaterSource;
  }, [currentUserId, triggerSync]);

  const updateWaterSource = useCallback((id: string, updates: Partial<WaterSource>) => {
    setData(prev => ({
      ...prev,
      waterSources: prev.waterSources.map(ws => ws.id === id ? { ...ws, ...updates } : ws),
    }));
    triggerSync();
  }, [triggerSync]);

  const deleteWaterSource = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      waterSources: prev.waterSources.filter(ws => ws.id !== id),
      waterSourceMeasurements: prev.waterSourceMeasurements.filter(m => m.waterSourceId !== id),
      // Clear reference from aquariums
      aquariums: prev.aquariums.map(a => a.waterSourceId === id ? { ...a, waterSourceId: undefined } : a),
    }));
    triggerSync();
  }, [triggerSync]);

  // Water Source Measurements
  const addWaterSourceMeasurement = useCallback((measurement: Omit<WaterSourceMeasurement, 'id' | 'userId'>) => {
    const newMeasurement: WaterSourceMeasurement = {
      ...measurement,
      id: generateId(),
      userId: currentUserId,
    };
    setData(prev => ({ ...prev, waterSourceMeasurements: [...prev.waterSourceMeasurements, newMeasurement] }));
    triggerSync();
    return newMeasurement;
  }, [currentUserId, triggerSync]);

  const updateWaterSourceMeasurement = useCallback((id: string, updates: Partial<WaterSourceMeasurement>) => {
    setData(prev => ({
      ...prev,
      waterSourceMeasurements: prev.waterSourceMeasurements.map(m => m.id === id ? { ...m, ...updates } : m),
    }));
    triggerSync();
  }, [triggerSync]);

  const deleteWaterSourceMeasurement = useCallback((id: string) => {
    setData(prev => ({ ...prev, waterSourceMeasurements: prev.waterSourceMeasurements.filter(m => m.id !== id) }));
    triggerSync();
  }, [triggerSync]);

  return {
    data: filteredData,
    rawData: data,
    setData,
    currentUserId,
    // Users
    addUser,
    switchUser,
    updateUser,
    deleteUser,
    // Aquariums
    addAquarium,
    updateAquarium,
    updateAquariumFormSettings,
    deleteAquarium,
    // Fish
    addFish,
    updateFish,
    deleteFish,
    // Plants
    addPlant,
    updatePlant,
    deletePlant,
    // Water Parameters
    addWaterParameter,
    deleteWaterParameter,
    // Equipment
    addEquipment,
    updateEquipment,
    deleteEquipment,
    // Fertilizers
    addFertilizer,
    updateFertilizer,
    deleteFertilizer,
    // Dosing
    addDosingLog,
    // Events
    addEvent,
    updateEvent,
    toggleEvent,
    deleteEvent,
    // Journal
    getJournalEntry,
    saveJournalEntry,
    deleteJournalEntry,
    // Diary Notes
    addDiaryNote,
    updateDiaryNote,
    deleteDiaryNote,
    // Water Sources
    addWaterSource,
    updateWaterSource,
    deleteWaterSource,
    // Water Source Measurements
    addWaterSourceMeasurement,
    updateWaterSourceMeasurement,
    deleteWaterSourceMeasurement,
  };
};

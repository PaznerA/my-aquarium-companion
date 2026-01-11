import { useState, useEffect, useCallback, useMemo } from 'react';
import { AppData, loadData, saveData, generateId, getDefaultFormSettings } from '@/lib/storage';
import type { 
  Aquarium, Fish, Plant, WaterParameter, Equipment, 
  Fertilizer, DosingLog, Task, JournalEntry, DiaryNote, User, JournalFormSettings 
} from '@/lib/storage';

export const useAppData = () => {
  const [data, setData] = useState<AppData>(loadData);

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
    tasks: data.tasks.filter(t => t.userId === currentUserId),
    journalEntries: data.journalEntries.filter(j => j.userId === currentUserId),
    diaryNotes: data.diaryNotes.filter(n => n.userId === currentUserId),
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
    return newUser;
  }, []);

  const switchUser = useCallback((userId: string) => {
    setData(prev => ({ ...prev, currentUserId: userId }));
  }, []);

  const updateUser = useCallback((id: string, name: string) => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, name } : u),
    }));
  }, []);

  const deleteUser = useCallback((id: string) => {
    setData(prev => {
      const remaining = prev.users.filter(u => u.id !== id);
      return {
        ...prev,
        users: remaining,
        currentUserId: remaining[0]?.id || null,
        // Also delete user's data
        aquariums: prev.aquariums.filter(a => a.userId !== id),
        fish: prev.fish.filter(f => f.userId !== id),
        plants: prev.plants.filter(p => p.userId !== id),
        waterParameters: prev.waterParameters.filter(w => w.userId !== id),
        equipment: prev.equipment.filter(e => e.userId !== id),
        fertilizers: prev.fertilizers.filter(f => f.userId !== id),
        dosingLogs: prev.dosingLogs.filter(d => d.userId !== id),
        tasks: prev.tasks.filter(t => t.userId !== id),
        journalEntries: prev.journalEntries.filter(j => j.userId !== id),
        diaryNotes: prev.diaryNotes.filter(n => n.userId !== id),
      };
    });
  }, []);

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
    return newAquarium;
  }, [currentUserId]);

  const updateAquarium = useCallback((id: string, updates: Partial<Aquarium>) => {
    setData(prev => ({
      ...prev,
      aquariums: prev.aquariums.map(a => a.id === id ? { ...a, ...updates } : a),
    }));
  }, []);

  const updateAquariumFormSettings = useCallback((id: string, settings: Partial<JournalFormSettings>) => {
    setData(prev => ({
      ...prev,
      aquariums: prev.aquariums.map(a => 
        a.id === id ? { ...a, formSettings: { ...a.formSettings, ...settings } } : a
      ),
    }));
  }, []);

  const deleteAquarium = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      aquariums: prev.aquariums.filter(a => a.id !== id),
      fish: prev.fish.filter(f => f.aquariumId !== id),
      plants: prev.plants.filter(p => p.aquariumId !== id),
      waterParameters: prev.waterParameters.filter(w => w.aquariumId !== id),
      dosingLogs: prev.dosingLogs.filter(d => d.aquariumId !== id),
      tasks: prev.tasks.filter(t => t.aquariumId !== id),
      journalEntries: prev.journalEntries.filter(j => j.aquariumId !== id),
      diaryNotes: prev.diaryNotes.filter(n => n.aquariumId !== id),
    }));
  }, []);

  // Fish
  const addFish = useCallback((fish: Omit<Fish, 'id' | 'dateAdded' | 'userId'>) => {
    const newFish: Fish = {
      ...fish,
      id: generateId(),
      dateAdded: new Date().toISOString(),
      userId: currentUserId,
    };
    setData(prev => ({ ...prev, fish: [...prev.fish, newFish] }));
    return newFish;
  }, [currentUserId]);

  const updateFish = useCallback((id: string, updates: Partial<Fish>) => {
    setData(prev => ({
      ...prev,
      fish: prev.fish.map(f => f.id === id ? { ...f, ...updates } : f),
    }));
  }, []);

  const deleteFish = useCallback((id: string) => {
    setData(prev => ({ ...prev, fish: prev.fish.filter(f => f.id !== id) }));
  }, []);

  // Plants
  const addPlant = useCallback((plant: Omit<Plant, 'id' | 'dateAdded' | 'userId'>) => {
    const newPlant: Plant = {
      ...plant,
      id: generateId(),
      dateAdded: new Date().toISOString(),
      userId: currentUserId,
    };
    setData(prev => ({ ...prev, plants: [...prev.plants, newPlant] }));
    return newPlant;
  }, [currentUserId]);

  const updatePlant = useCallback((id: string, updates: Partial<Plant>) => {
    setData(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
  }, []);

  const deletePlant = useCallback((id: string) => {
    setData(prev => ({ ...prev, plants: prev.plants.filter(p => p.id !== id) }));
  }, []);

  // Water Parameters
  const addWaterParameter = useCallback((param: Omit<WaterParameter, 'id' | 'userId'>) => {
    const newParam: WaterParameter = { ...param, id: generateId(), userId: currentUserId };
    setData(prev => ({ ...prev, waterParameters: [...prev.waterParameters, newParam] }));
    return newParam;
  }, [currentUserId]);

  const deleteWaterParameter = useCallback((id: string) => {
    setData(prev => ({ ...prev, waterParameters: prev.waterParameters.filter(w => w.id !== id) }));
  }, []);

  // Equipment
  const addEquipment = useCallback((equipment: Omit<Equipment, 'id' | 'userId'>) => {
    const newEquipment: Equipment = { ...equipment, id: generateId(), userId: currentUserId };
    setData(prev => ({ ...prev, equipment: [...prev.equipment, newEquipment] }));
    return newEquipment;
  }, [currentUserId]);

  const updateEquipment = useCallback((id: string, updates: Partial<Equipment>) => {
    setData(prev => ({
      ...prev,
      equipment: prev.equipment.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  }, []);

  const deleteEquipment = useCallback((id: string) => {
    setData(prev => ({ ...prev, equipment: prev.equipment.filter(e => e.id !== id) }));
  }, []);

  // Fertilizers
  const addFertilizer = useCallback((fertilizer: Omit<Fertilizer, 'id' | 'userId'>) => {
    const newFertilizer: Fertilizer = { ...fertilizer, id: generateId(), userId: currentUserId };
    setData(prev => ({ ...prev, fertilizers: [...prev.fertilizers, newFertilizer] }));
    return newFertilizer;
  }, [currentUserId]);

  const updateFertilizer = useCallback((id: string, updates: Partial<Fertilizer>) => {
    setData(prev => ({
      ...prev,
      fertilizers: prev.fertilizers.map(f => f.id === id ? { ...f, ...updates } : f),
    }));
  }, []);

  const deleteFertilizer = useCallback((id: string) => {
    setData(prev => ({ ...prev, fertilizers: prev.fertilizers.filter(f => f.id !== id) }));
  }, []);

  // Dosing Logs
  const addDosingLog = useCallback((log: Omit<DosingLog, 'id' | 'userId'>) => {
    const newLog: DosingLog = { ...log, id: generateId(), userId: currentUserId };
    setData(prev => ({ ...prev, dosingLogs: [...prev.dosingLogs, newLog] }));
    return newLog;
  }, [currentUserId]);

  // Tasks
  const addTask = useCallback((task: Omit<Task, 'id' | 'userId'>) => {
    const newTask: Task = { ...task, id: generateId(), userId: currentUserId };
    setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    return newTask;
  }, [currentUserId]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  }, []);

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
  }, [currentUserId]);

  const deleteJournalEntry = useCallback((id: string) => {
    setData(prev => ({ ...prev, journalEntries: prev.journalEntries.filter(j => j.id !== id) }));
  }, []);

  // Diary Notes
  const addDiaryNote = useCallback((note: Omit<DiaryNote, 'id' | 'userId'>) => {
    const newNote: DiaryNote = { ...note, id: generateId(), userId: currentUserId };
    setData(prev => ({ ...prev, diaryNotes: [...prev.diaryNotes, newNote] }));
    return newNote;
  }, [currentUserId]);

  const updateDiaryNote = useCallback((id: string, content: string) => {
    setData(prev => ({
      ...prev,
      diaryNotes: prev.diaryNotes.map(n => n.id === id ? { ...n, content } : n),
    }));
  }, []);

  const deleteDiaryNote = useCallback((id: string) => {
    setData(prev => ({ ...prev, diaryNotes: prev.diaryNotes.filter(n => n.id !== id) }));
  }, []);

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
    // Tasks
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    // Journal
    getJournalEntry,
    saveJournalEntry,
    deleteJournalEntry,
    // Diary Notes
    addDiaryNote,
    updateDiaryNote,
    deleteDiaryNote,
  };
};

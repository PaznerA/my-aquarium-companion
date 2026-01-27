// LocalStorage wrapper for AquariumJournal data persistence
// Types are imported from centralized type definitions

import type { AppData, User, JournalFormSettings } from '@/types';

// Re-export types for backwards compatibility (deprecated - use @/types directly)
export type { AppData, User, JournalFormSettings } from '@/types';

const STORAGE_KEY = 'aquarium-journal-data';

const defaultFormSettings: JournalFormSettings = {
  showDosing: true,
  showWaterChange: true,
  showVacuuming: true,
  showTrimming: true,
  showFilterCleaning: true,
  showPhotos: true,
  showNotes: true,
  showEvents: true,
  hiddenFertilizers: [],
};

const defaultData: AppData = {
  users: [],
  currentUserId: null,
  aquariums: [],
  fish: [],
  plants: [],
  waterParameters: [],
  equipment: [],
  fertilizers: [],
  dosingLogs: [],
  events: [],
  journalEntries: [],
  diaryNotes: [],
  waterSources: [],
  waterSourceMeasurements: [],
};

// Migration function to add userId to existing data and ensure all fields exist
const migrateData = (data: Partial<AppData>): AppData => {
  // Create default user if none exists
  let users = data.users || [];
  let currentUserId = data.currentUserId || null;
  
  if (users.length === 0) {
    const defaultUser: User = {
      id: generateId(),
      name: 'Výchozí uživatel',
      createdAt: new Date().toISOString(),
    };
    users = [defaultUser];
    currentUserId = defaultUser.id;
  }
  
  const userId = currentUserId || users[0]?.id || '';
  
  // Migrate aquariums with formSettings and EI parameters
  const aquariums = (data.aquariums || []).map(a => ({
    ...a,
    userId: a.userId || userId,
    formSettings: {
      ...defaultFormSettings,
      ...(a.formSettings || {}),
    },
    plantDensity: a.plantDensity || 'medium',
    hasCO2: a.hasCO2 ?? false,
    lightLevel: a.lightLevel || 'medium',
  }));
  
  // Migrate other entities
  const fish = (data.fish || []).map(f => ({ ...f, userId: f.userId || userId }));
  const plants = (data.plants || []).map(p => ({ ...p, userId: p.userId || userId }));
  const waterParameters = (data.waterParameters || []).map(w => ({ ...w, userId: w.userId || userId }));
  const equipment = (data.equipment || []).map(e => ({ ...e, userId: e.userId || userId }));
  const fertilizers = (data.fertilizers || []).map(f => ({ ...f, userId: f.userId || userId }));
  const dosingLogs = (data.dosingLogs || []).map(d => ({ ...d, userId: d.userId || userId }));
  
  // Migrate tasks to events if needed (backwards compatibility)
  const existingTasks = (data as any).tasks || [];
  const existingEvents = (data.events || []).map(e => ({
    ...e,
    userId: e.userId || userId,
    completed: e.completed ?? false,
  }));
  const migratedTasks = existingTasks.map((t: any) => ({
    id: t.id,
    title: t.title,
    type: t.type || 'other',
    aquariumId: t.aquariumId,
    date: t.dueDate || t.date,
    completed: t.completed ?? false,
    recurring: t.recurring,
    notes: t.notes,
    userId: t.userId || userId,
  }));
  const events = [...existingEvents, ...migratedTasks.filter((t: any) => !existingEvents.some((e: any) => e.id === t.id))];
  
  // Migrate journal entries
  const journalEntries = (data.journalEntries || []).map(j => ({
    ...j,
    userId: j.userId || userId,
    dosingEntries: j.dosingEntries || [],
    waterChanged: j.waterChanged ?? false,
    vacuumed: j.vacuumed ?? false,
    trimmed: j.trimmed ?? false,
    filterCleaned: j.filterCleaned ?? false,
    photos: j.photos || [],
    notes: j.notes || '',
  }));
  
  // Migrate diary notes
  const diaryNotes = (data.diaryNotes || []).map(n => ({
    ...n,
    userId: n.userId || userId,
  }));
  
  // Migrate water sources
  const waterSources = (data.waterSources || []).map((ws: any) => ({
    ...ws,
    userId: ws.userId || userId,
  }));
  
  // Migrate water source measurements
  const waterSourceMeasurements = (data.waterSourceMeasurements || []).map((m: any) => ({
    ...m,
    userId: m.userId || userId,
  }));
  
  return {
    users,
    currentUserId,
    aquariums,
    fish,
    plants,
    waterParameters,
    equipment,
    fertilizers,
    dosingLogs,
    events,
    journalEntries,
    diaryNotes,
    waterSources,
    waterSourceMeasurements,
  };
};

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return migrateData(parsed);
    }
  } catch (e) {
    console.error('Failed to load data:', e);
  }
  return migrateData(defaultData);
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
};

export const exportData = (): string => {
  const data = loadData();
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    const migrated = migrateData(data);
    saveData(migrated);
    return true;
  } catch (e) {
    console.error('Failed to import data:', e);
    return false;
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getDefaultFormSettings = (): JournalFormSettings => ({ ...defaultFormSettings });

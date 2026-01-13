// LocalStorage wrapper for AquariumJournal data persistence

export interface Fish {
  id: string;
  name: string;
  species: string;
  count: number;
  dateAdded: string;
  aquariumId: string;
  userId: string;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  count: number;
  dateAdded: string;
  aquariumId: string;
  userId: string;
}

export interface WaterParameter {
  id: string;
  date: string;
  ph: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  temperature: number;
  kh: number;
  gh: number;
  aquariumId: string;
  userId: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'filter' | 'heater' | 'light' | 'co2' | 'pump' | 'other';
  brand?: string;
  aquariumId?: string;
  isInventory: boolean;
  userId: string;
}

export interface Fertilizer {
  id: string;
  name: string;
  brand: string;
  volume: number;
  unit: 'ml' | 'g';
  // Estimative Index - nutrient content per ml/g
  nitrogenPpm?: number;
  phosphorusPpm?: number;
  potassiumPpm?: number;
  ironPpm?: number;
  userId: string;
}

export interface DosingEntry {
  fertilizerId: string;
  amount: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  aquariumId: string;
  userId: string;
  // Dosing
  dosingEntries: DosingEntry[];
  // Maintenance
  waterChanged: boolean;
  waterChangePercent?: number;
  vacuumed: boolean;
  trimmed: boolean;
  filterCleaned: boolean;
  // Photos (base64 or blob urls)
  photos: string[];
  // Notes
  notes: string;
  // Entry-specific note (different from general notes)
  entryNote?: string;
}

export interface DiaryNote {
  id: string;
  date: string;
  content: string;
  aquariumId?: string; // global if undefined
  userId: string;
}

export interface User {
  id: string;
  name: string;
  createdAt: string;
}

export interface JournalFormSettings {
  showDosing: boolean;
  showWaterChange: boolean;
  showVacuuming: boolean;
  showTrimming: boolean;
  showFilterCleaning: boolean;
  showPhotos: boolean;
  showNotes: boolean;
  hiddenFertilizers: string[]; // fertilizer IDs to HIDE from form (all others are shown)
}

export interface DosingLog {
  id: string;
  fertilizerId: string;
  aquariumId: string;
  amount: number;
  date: string;
  userId: string;
}

export interface Aquarium {
  id: string;
  name: string;
  volume: number;
  dateCreated: string;
  imageUrl?: string;
  userId: string;
  formSettings: JournalFormSettings;
  // Sharing options
  sharedWithAll?: boolean;
  sharedWith?: string[]; // user IDs
}

export interface AquariumEvent {
  id: string;
  title: string;
  type: 'maintenance' | 'feeding' | 'waterChange' | 'dosing' | 'treatment' | 'other';
  aquariumId?: string; // undefined = global event
  date: string;
  completed: boolean;
  recurring?: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  notes?: string;
  userId: string;
}

export interface AppData {
  users: User[];
  currentUserId: string | null;
  aquariums: Aquarium[];
  fish: Fish[];
  plants: Plant[];
  waterParameters: WaterParameter[];
  equipment: Equipment[];
  fertilizers: Fertilizer[];
  dosingLogs: DosingLog[];
  events: AquariumEvent[];
  journalEntries: JournalEntry[];
  diaryNotes: DiaryNote[];
}

const STORAGE_KEY = 'aquarium-journal-data';

const defaultFormSettings: JournalFormSettings = {
  showDosing: true,
  showWaterChange: true,
  showVacuuming: true,
  showTrimming: true,
  showFilterCleaning: true,
  showPhotos: true,
  showNotes: true,
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
};

// Migration function to add userId to existing data
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
  
  // Migrate aquariums with formSettings
  const aquariums = (data.aquariums || []).map(a => ({
    ...a,
    userId: a.userId || userId,
    formSettings: a.formSettings || { ...defaultFormSettings },
  }));
  
  // Migrate other entities
  const fish = (data.fish || []).map(f => ({ ...f, userId: f.userId || userId }));
  const plants = (data.plants || []).map(p => ({ ...p, userId: p.userId || userId }));
  const waterParameters = (data.waterParameters || []).map(w => ({ ...w, userId: w.userId || userId }));
  const equipment = (data.equipment || []).map(e => ({ ...e, userId: e.userId || userId }));
  const fertilizers = (data.fertilizers || []).map(f => ({ ...f, userId: f.userId || userId }));
  const dosingLogs = (data.dosingLogs || []).map(d => ({ ...d, userId: d.userId || userId }));
  // Migrate tasks to events if needed
  const existingTasks = (data as any).tasks || [];
  const existingEvents = (data.events || []).map(e => ({ ...e, userId: e.userId || userId }));
  const migratedTasks = existingTasks.map((t: any) => ({
    id: t.id,
    title: t.title,
    type: t.type,
    aquariumId: t.aquariumId,
    date: t.dueDate || t.date,
    completed: t.completed,
    recurring: t.recurring,
    notes: t.notes,
    userId: t.userId || userId,
  }));
  const events = [...existingEvents, ...migratedTasks.filter((t: any) => !existingEvents.some((e: any) => e.id === t.id))];
  
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
    journalEntries: data.journalEntries || [],
    diaryNotes: data.diaryNotes || [],
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

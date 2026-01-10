// LocalStorage wrapper for AquariumJournal data persistence

export interface Fish {
  id: string;
  name: string;
  species: string;
  count: number;
  dateAdded: string;
  aquariumId: string;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  count: number;
  dateAdded: string;
  aquariumId: string;
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
}

export interface Equipment {
  id: string;
  name: string;
  type: 'filter' | 'heater' | 'light' | 'co2' | 'pump' | 'other';
  brand?: string;
  aquariumId?: string;
  isInventory: boolean;
}

export interface Fertilizer {
  id: string;
  name: string;
  brand: string;
  volume: number;
  unit: 'ml' | 'g';
}

export interface DosingLog {
  id: string;
  fertilizerId: string;
  aquariumId: string;
  amount: number;
  date: string;
}

export interface Aquarium {
  id: string;
  name: string;
  volume: number;
  dateCreated: string;
  imageUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  type: 'maintenance' | 'feeding' | 'waterChange' | 'dosing';
  aquariumId?: string;
  dueDate: string;
  completed: boolean;
  recurring?: 'daily' | 'weekly' | 'biweekly' | 'monthly';
}

export interface AppData {
  aquariums: Aquarium[];
  fish: Fish[];
  plants: Plant[];
  waterParameters: WaterParameter[];
  equipment: Equipment[];
  fertilizers: Fertilizer[];
  dosingLogs: DosingLog[];
  tasks: Task[];
}

const STORAGE_KEY = 'aquarium-journal-data';

const defaultData: AppData = {
  aquariums: [],
  fish: [],
  plants: [],
  waterParameters: [],
  equipment: [],
  fertilizers: [],
  dosingLogs: [],
  tasks: [],
};

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultData, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load data:', e);
  }
  return defaultData;
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
    const data = JSON.parse(jsonString) as AppData;
    saveData(data);
    return true;
  } catch (e) {
    console.error('Failed to import data:', e);
    return false;
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

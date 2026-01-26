// Core entity interfaces for the application
// All entities that are persisted in storage

import type { 
  EquipmentType, 
  FertilizerUnit, 
  PlantDensity, 
  LightLevel, 
  EventType, 
  RecurringType,
  WaterSourceType 
} from './enums';
import type { FullWaterParams, FertilizerNutrients } from './waterParams';

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  id: string;
  userId: string;
}

/**
 * User account
 */
export interface User {
  id: string;
  name: string;
  createdAt: string;
}

/**
 * Journal form customization settings
 */
export interface JournalFormSettings {
  showDosing: boolean;
  showWaterChange: boolean;
  showVacuuming: boolean;
  showTrimming: boolean;
  showFilterCleaning: boolean;
  showPhotos: boolean;
  showNotes: boolean;
  showEvents: boolean;
  hiddenFertilizers: string[]; // fertilizer IDs to HIDE from form
}

/**
 * Aquarium tank
 */
export interface Aquarium extends BaseEntity {
  name: string;
  volume: number;
  dateCreated: string;
  imageUrl?: string;
  formSettings: JournalFormSettings;
  // Sharing options
  sharedWithAll?: boolean;
  sharedWith?: string[]; // user IDs
  // EI parameters
  plantDensity?: PlantDensity;
  hasCO2?: boolean;
  lightLevel?: LightLevel;
  // Water source reference
  waterSourceId?: string;
}

/**
 * Fish in an aquarium
 */
export interface Fish extends BaseEntity {
  name: string;
  species: string;
  count: number;
  dateAdded: string;
  aquariumId: string;
}

/**
 * Plant in an aquarium
 */
export interface Plant extends BaseEntity {
  name: string;
  species: string;
  count: number;
  dateAdded: string;
  aquariumId: string;
}

/**
 * Water parameter measurement for an aquarium
 */
export interface WaterParameter extends BaseEntity {
  date: string;
  aquariumId: string;
  // Core parameters
  ph: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  temperature: number;
  kh: number;
  gh: number;
}

/**
 * Equipment item
 */
export interface Equipment extends BaseEntity {
  name: string;
  type: EquipmentType;
  brand?: string;
  aquariumId?: string;
  isInventory: boolean;
}

/**
 * Fertilizer product
 */
export interface Fertilizer extends BaseEntity, FertilizerNutrients {
  name: string;
  brand: string;
  volume: number;
  unit: FertilizerUnit;
}

/**
 * Single dosing entry within a journal entry
 */
export interface DosingEntry {
  fertilizerId: string;
  amount: number;
}

/**
 * Standalone dosing log entry
 */
export interface DosingLog extends BaseEntity {
  fertilizerId: string;
  aquariumId: string;
  amount: number;
  date: string;
}

/**
 * Daily journal entry for an aquarium
 */
export interface JournalEntry extends BaseEntity {
  date: string;
  aquariumId: string;
  // Dosing
  dosingEntries: DosingEntry[];
  // Maintenance
  waterChanged: boolean;
  waterChangePercent?: number;
  vacuumed: boolean;
  trimmed: boolean;
  filterCleaned: boolean;
  // Photos (URLs or paths)
  photos: string[];
  // Notes
  notes: string;
  entryNote?: string;
}

/**
 * Diary note (global or per-aquarium)
 */
export interface DiaryNote extends BaseEntity {
  date: string;
  content: string;
  aquariumId?: string; // global if undefined
}

/**
 * Scheduled or recurring event
 */
export interface AquariumEvent extends BaseEntity {
  title: string;
  type: EventType;
  aquariumId?: string; // undefined = global event
  date: string;
  completed: boolean;
  recurring?: RecurringType;
  notes?: string;
}

/**
 * Water source (tap water, RO, etc.) - uses shared water params
 */
export interface WaterSource extends BaseEntity, FullWaterParams {
  name: string;
  type: WaterSourceType;
  createdAt: string;
  notes?: string;
  isDefault?: boolean;
}

/**
 * Historical measurement of a water source
 */
export interface WaterSourceMeasurement extends BaseEntity, FullWaterParams {
  waterSourceId: string;
  date: string;
  notes?: string;
  sourceDocument?: string;
}

/**
 * Complete application data structure
 */
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
  waterSources: WaterSource[];
  waterSourceMeasurements: WaterSourceMeasurement[];
}

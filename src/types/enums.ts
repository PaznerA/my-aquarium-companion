// Shared enums and literal types for the application

// Equipment types
export type EquipmentType = 'filter' | 'heater' | 'light' | 'co2' | 'pump' | 'other';

// Fertilizer units
export type FertilizerUnit = 'ml' | 'g';

// Aquarium parameters
export type PlantDensity = 'low' | 'medium' | 'high' | 'dutch';
export type LightLevel = 'low' | 'medium' | 'high';

// Event types
export type EventType = 'maintenance' | 'feeding' | 'waterChange' | 'dosing' | 'treatment' | 'other';
export type RecurringType = 'daily' | 'weekly' | 'biweekly' | 'monthly';

// Water source types
export type WaterSourceType = 'tap' | 'ro' | 'rainwater' | 'well' | 'mixed' | 'other';

// Species types
export type SpeciesType = 'fish' | 'plant';
export type Temperament = 'peaceful' | 'semi-aggressive' | 'aggressive';
export type Diet = 'omnivore' | 'herbivore' | 'carnivore' | 'specialized';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GrowthRate = 'slow' | 'medium' | 'fast';
export type PlantPlacement = 'foreground' | 'midground' | 'background' | 'floating' | 'carpet';
export type SpeciesSource = 'builtin' | 'user' | 'wikipedia' | 'fishbase';

// Nutrient status for EI analysis
export type NutrientStatus = 'low' | 'optimal' | 'high';

// Shared water parameter types - eliminates duplication across entities

/**
 * Basic water chemistry parameters
 */
export interface BaseWaterParams {
  gh?: number;           // General Hardness (°dGH)
  kh?: number;           // Carbonate Hardness (°dKH)
  ph?: number;           // pH value
  tds?: number;          // Total Dissolved Solids (ppm)
  conductivity?: number; // μS/cm
  temperature?: number;  // °C
}

/**
 * Macro nutrients (mg/l or ppm)
 */
export interface MacroNutrients {
  nitrate?: number;      // NO3
  nitrite?: number;      // NO2
  ammonia?: number;      // NH3/NH4
  phosphate?: number;    // PO4
  calcium?: number;      // Ca
  magnesium?: number;    // Mg
  potassium?: number;    // K
  sodium?: number;       // Na
  chloride?: number;     // Cl
  sulfate?: number;      // SO4
}

/**
 * Micro/trace nutrients (mg/l or ppm)
 */
export interface MicroNutrients {
  iron?: number;         // Fe
  manganese?: number;    // Mn
  copper?: number;       // Cu
  zinc?: number;         // Zn
  boron?: number;        // B
  molybdenum?: number;   // Mo
  cobalt?: number;       // Co
  silicate?: number;     // SiO2
}

/**
 * Complete water parameters - combines all parameter types
 */
export type FullWaterParams = BaseWaterParams & MacroNutrients & MicroNutrients;

/**
 * Nutrient content in fertilizers (ppm per ml/g)
 */
export interface FertilizerNutrients {
  nitrogenPpm?: number;
  phosphorusPpm?: number;
  potassiumPpm?: number;
  ironPpm?: number;
  magnesiumPpm?: number;
}

/**
 * Water source nutrients for EI calculations
 */
export interface WaterSourceNutrients {
  nitrogen: number;    // NO3 in ppm
  phosphorus: number;  // PO4 in ppm
  potassium: number;   // K in ppm
  iron: number;        // Fe in ppm
  magnesium: number;   // Mg in ppm
  calcium: number;     // Ca in ppm
}

/**
 * Species water parameter requirements
 */
export interface SpeciesWaterRequirements {
  tempMin: number;
  tempMax: number;
  phMin: number;
  phMax: number;
  ghMin?: number;
  ghMax?: number;
  khMin?: number;
  khMax?: number;
}

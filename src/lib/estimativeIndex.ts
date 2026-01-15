// Estimative Index (EI) Method Calculator
// Based on Tom Barr's EI dosing method for planted aquariums

import type { Fertilizer, DosingLog, Aquarium, PlantDensity, LightLevel } from './storage';

// EI Target ranges (ppm) - base values for medium consumption
export const EI_TARGETS = {
  nitrogenMin: 10,
  nitrogenMax: 30,
  phosphorusMin: 1,
  phosphorusMax: 3,
  potassiumMin: 10,
  potassiumMax: 30,
  ironMin: 0.1,
  ironMax: 0.5,
  magnesiumMin: 5,
  magnesiumMax: 15,
};

// Consumption multipliers based on aquarium type
const DENSITY_MULTIPLIERS: Record<PlantDensity, number> = {
  low: 0.5,      // Few plants, slow growth
  medium: 1.0,   // Average planting
  high: 1.5,     // Heavily planted
  dutch: 2.0,    // Fully planted, competition for nutrients
};

const CO2_MULTIPLIER = {
  withCO2: 2.0,  // CO2 injection dramatically increases uptake
  withoutCO2: 1.0,
};

const LIGHT_MULTIPLIERS: Record<LightLevel, number> = {
  low: 0.5,      // ~20-30 PAR
  medium: 1.0,   // ~40-60 PAR
  high: 1.5,     // ~80+ PAR
};

// Status type
export type NutrientStatus = 'low' | 'optimal' | 'high';

// Day projection type
export interface DayProjection {
  day: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  iron: number;
  magnesium: number;
}

export interface DosingRecommendation {
  fertilizerId: string;
  fertilizerName: string;
  recommendedDose: number;
  unit: 'ml' | 'g';
  frequency: 'daily' | 'weekly' | '3x_week';
  reasoning: string;
}

export interface NutrientProjection {
  date: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  iron: number;
  magnesium: number;
}

export interface EIAnalysis {
  currentLevels: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    iron: number;
    magnesium: number;
  };
  weeklyTotals: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    iron: number;
    magnesium: number;
  };
  status: {
    nitrogen: NutrientStatus;
    phosphorus: NutrientStatus;
    potassium: NutrientStatus;
    iron: NutrientStatus;
    magnesium: NutrientStatus;
  };
  consumptionMultiplier: number;
  consumptionDescription: string;
  recommendations: DosingRecommendation[];
  tips: string[];
}

// Calculate combined consumption multiplier for an aquarium
export const calculateConsumptionMultiplier = (aquarium: Partial<Aquarium>): number => {
  const density = aquarium.plantDensity || 'medium';
  const light = aquarium.lightLevel || 'medium';
  const hasCO2 = aquarium.hasCO2 ?? false;

  const densityMult = DENSITY_MULTIPLIERS[density];
  const co2Mult = hasCO2 ? CO2_MULTIPLIER.withCO2 : CO2_MULTIPLIER.withoutCO2;
  const lightMult = LIGHT_MULTIPLIERS[light];

  return densityMult * co2Mult * lightMult;
};

// Get human-readable description of consumption level
export const getConsumptionDescription = (multiplier: number, lang: 'cs' | 'en' = 'cs'): string => {
  if (multiplier <= 0.5) return lang === 'cs' ? 'Velmi nízká spotřeba' : 'Very low consumption';
  if (multiplier <= 1.0) return lang === 'cs' ? 'Nízká spotřeba' : 'Low consumption';
  if (multiplier <= 2.0) return lang === 'cs' ? 'Střední spotřeba' : 'Medium consumption';
  if (multiplier <= 4.0) return lang === 'cs' ? 'Vysoká spotřeba' : 'High consumption';
  return lang === 'cs' ? 'Velmi vysoká spotřeba' : 'Very high consumption';
};

// Calculate ppm added to aquarium from a dose
export const calculateNutrientAddition = (
  doseAmount: number,
  nutrientPpm: number,
  aquariumVolume: number
): number => {
  // nutrientPpm is concentration per ml/g of fertilizer
  // Result is ppm increase in aquarium
  return (doseAmount * nutrientPpm) / aquariumVolume;
};

// Calculate recommended weekly dose to reach target
export const calculateRecommendedDose = (
  targetPpm: number,
  currentPpm: number,
  nutrientPpmPerMl: number,
  aquariumVolume: number,
  consumptionMultiplier: number = 1.0,
  daysUntilWaterChange: number = 7
): number => {
  const deficit = Math.max(0, targetPpm - currentPpm);
  if (nutrientPpmPerMl <= 0) return 0;
  
  // Account for uptake/decay based on consumption multiplier
  const weeklyTarget = deficit + (targetPpm * 0.3 * consumptionMultiplier * (daysUntilWaterChange / 7));
  
  return (weeklyTarget * aquariumVolume) / nutrientPpmPerMl;
};

// Determine status for a nutrient value
const getStatus = (value: number, min: number, max: number): NutrientStatus => {
  if (value < min * 0.5) return 'low';
  if (value > max * 1.5) return 'high';
  return 'optimal';
};

// Analyze current dosing and provide recommendations
export const analyzeEI = (
  aquariumVolume: number,
  fertilizers: Array<{
    id: string;
    name: string;
    unit: 'ml' | 'g';
    nitrogenPpm?: number;
    phosphorusPpm?: number;
    potassiumPpm?: number;
    ironPpm?: number;
    magnesiumPpm?: number;
  }>,
  weeklyDosing: Array<{
    fertilizerId: string;
    totalAmount: number;
  }>,
  aquarium?: Partial<Aquarium>,
  lang: 'cs' | 'en' = 'cs'
): EIAnalysis => {
  const consumptionMultiplier = calculateConsumptionMultiplier(aquarium || {});
  const consumptionDescription = getConsumptionDescription(consumptionMultiplier, lang);

  // Adjusted targets based on consumption
  const adjustedTargets = {
    nitrogenMin: EI_TARGETS.nitrogenMin * consumptionMultiplier,
    nitrogenMax: EI_TARGETS.nitrogenMax * consumptionMultiplier,
    phosphorusMin: EI_TARGETS.phosphorusMin * consumptionMultiplier,
    phosphorusMax: EI_TARGETS.phosphorusMax * consumptionMultiplier,
    potassiumMin: EI_TARGETS.potassiumMin * consumptionMultiplier,
    potassiumMax: EI_TARGETS.potassiumMax * consumptionMultiplier,
    ironMin: EI_TARGETS.ironMin * consumptionMultiplier,
    ironMax: EI_TARGETS.ironMax * consumptionMultiplier,
    magnesiumMin: EI_TARGETS.magnesiumMin * consumptionMultiplier,
    magnesiumMax: EI_TARGETS.magnesiumMax * consumptionMultiplier,
  };

  // Calculate current nutrient levels from dosing
  let weeklyN = 0, weeklyP = 0, weeklyK = 0, weeklyFe = 0, weeklyMg = 0;
  
  weeklyDosing.forEach(dose => {
    const fert = fertilizers.find(f => f.id === dose.fertilizerId);
    if (fert && dose.totalAmount > 0) {
      weeklyN += calculateNutrientAddition(dose.totalAmount, fert.nitrogenPpm || 0, aquariumVolume);
      weeklyP += calculateNutrientAddition(dose.totalAmount, fert.phosphorusPpm || 0, aquariumVolume);
      weeklyK += calculateNutrientAddition(dose.totalAmount, fert.potassiumPpm || 0, aquariumVolume);
      weeklyFe += calculateNutrientAddition(dose.totalAmount, fert.ironPpm || 0, aquariumVolume);
      weeklyMg += calculateNutrientAddition(dose.totalAmount, fert.magnesiumPpm || 0, aquariumVolume);
    }
  });
  
  const status = {
    nitrogen: getStatus(weeklyN, adjustedTargets.nitrogenMin, adjustedTargets.nitrogenMax),
    phosphorus: getStatus(weeklyP, adjustedTargets.phosphorusMin, adjustedTargets.phosphorusMax),
    potassium: getStatus(weeklyK, adjustedTargets.potassiumMin, adjustedTargets.potassiumMax),
    iron: getStatus(weeklyFe, adjustedTargets.ironMin, adjustedTargets.ironMax),
    magnesium: getStatus(weeklyMg, adjustedTargets.magnesiumMin, adjustedTargets.magnesiumMax),
  };
  
  // Generate recommendations
  const recommendations: DosingRecommendation[] = [];
  
  fertilizers.forEach(fert => {
    const currentDose = weeklyDosing.find(d => d.fertilizerId === fert.id);
    const currentAmount = currentDose?.totalAmount || 0;
    
    let recommendedIncrease = 0;
    let reasoning = '';
    
    if (fert.nitrogenPpm && fert.nitrogenPpm > 0 && status.nitrogen === 'low') {
      const needed = calculateRecommendedDose(
        adjustedTargets.nitrogenMin + 5, 
        weeklyN, 
        fert.nitrogenPpm, 
        aquariumVolume,
        consumptionMultiplier
      );
      recommendedIncrease = Math.max(recommendedIncrease, needed - currentAmount);
      reasoning = lang === 'cs' ? 'Zvýšit dávku pro optimální hladinu dusíku' : 'Increase dose for optimal nitrogen levels';
    }
    
    if (fert.phosphorusPpm && fert.phosphorusPpm > 0 && status.phosphorus === 'low') {
      const needed = calculateRecommendedDose(
        adjustedTargets.phosphorusMin + 0.5, 
        weeklyP, 
        fert.phosphorusPpm, 
        aquariumVolume,
        consumptionMultiplier
      );
      recommendedIncrease = Math.max(recommendedIncrease, needed - currentAmount);
      reasoning = reasoning || (lang === 'cs' ? 'Zvýšit dávku pro optimální hladinu fosfátu' : 'Increase dose for optimal phosphate levels');
    }
    
    if (fert.ironPpm && fert.ironPpm > 0 && status.iron === 'low') {
      const needed = calculateRecommendedDose(
        adjustedTargets.ironMin + 0.1, 
        weeklyFe, 
        fert.ironPpm, 
        aquariumVolume,
        consumptionMultiplier
      );
      recommendedIncrease = Math.max(recommendedIncrease, needed - currentAmount);
      reasoning = reasoning || (lang === 'cs' ? 'Zvýšit dávku pro optimální hladinu železa' : 'Increase dose for optimal iron levels');
    }

    if (fert.magnesiumPpm && fert.magnesiumPpm > 0 && status.magnesium === 'low') {
      const needed = calculateRecommendedDose(
        adjustedTargets.magnesiumMin + 2, 
        weeklyMg, 
        fert.magnesiumPpm, 
        aquariumVolume,
        consumptionMultiplier
      );
      recommendedIncrease = Math.max(recommendedIncrease, needed - currentAmount);
      reasoning = reasoning || (lang === 'cs' ? 'Zvýšit dávku pro optimální hladinu hořčíku' : 'Increase dose for optimal magnesium levels');
    }
    
    if (recommendedIncrease > 0) {
      recommendations.push({
        fertilizerId: fert.id,
        fertilizerName: fert.name,
        recommendedDose: Math.round((currentAmount + recommendedIncrease) / 7 * 10) / 10,
        unit: fert.unit,
        frequency: 'daily',
        reasoning,
      });
    }
  });
  
  // Generate tips
  const tips: string[] = [];
  
  // Context-aware tips based on aquarium setup
  if (lang === 'cs') {
    if (!aquarium?.hasCO2 && weeklyN > 20) {
      tips.push('💡 Bez CO₂ rostliny nespotřebují tolik dusíku - zvažte snížení dávky nebo přidání CO₂');
    }
    if (aquarium?.plantDensity === 'low' && status.nitrogen === 'high') {
      tips.push('⚠️ Málo rostlin = nízká spotřeba. Zvažte přidání více rostlin nebo snížení hnojení');
    }
    if (aquarium?.plantDensity === 'dutch' && (status.nitrogen === 'low' || status.phosphorus === 'low')) {
      tips.push('🌿 Dutch akvárium vyžaduje maximální dávkování - zvažte EI full dose');
    }
    if (aquarium?.hasCO2 && aquarium?.lightLevel === 'high' && status.iron === 'low') {
      tips.push('🔬 Vysoké světlo + CO₂ = rychlý růst. Železo se spotřebovává rychleji');
    }
    if (consumptionMultiplier >= 3) {
      tips.push('🚀 High-tech setup - počítejte s denním dávkováním živin');
    }
    if (consumptionMultiplier <= 0.5) {
      tips.push('🐢 Low-tech akvárium - stačí dávkovat 1-2× týdně');
    }
    
    // Standard tips
    if (status.nitrogen === 'low') {
      tips.push('💡 Nízká hladina dusíku může způsobit blednutí listů a pomalý růst.');
    }
    if (status.nitrogen === 'high') {
      tips.push('⚠️ Vysoká hladina dusíku - zvažte větší výměnu vody nebo snížení dávky.');
    }
    if (status.phosphorus === 'low') {
      tips.push('💡 Nedostatek fosfátu může vést k tmavnutí starších listů.');
    }
    if (status.iron === 'low') {
      tips.push('💡 Nedostatek železa způsobuje žloutnutí mladých listů (chloróza).');
    }
    if (status.potassium === 'low') {
      tips.push('💡 Nedostatek draslíku se projevuje dírami a hnědnutím okrajů listů.');
    }
    if (status.magnesium === 'low') {
      tips.push('💡 Nedostatek hořčíku způsobuje žloutnutí mezi žilkami starších listů.');
    }
    
    if (Object.values(status).every(s => s === 'optimal')) {
      tips.push('✅ Všechny živiny jsou v optimálním rozmezí. Pokračujte v aktuálním dávkování!');
    }
    
    tips.push('🔄 EI metoda doporučuje 50% výměnu vody týdně pro reset živin.');
  } else {
    // English tips
    if (!aquarium?.hasCO2 && weeklyN > 20) {
      tips.push('💡 Without CO₂, plants consume less nitrogen - consider reducing dose or adding CO₂');
    }
    if (aquarium?.plantDensity === 'low' && status.nitrogen === 'high') {
      tips.push('⚠️ Few plants = low consumption. Consider adding more plants or reducing fertilization');
    }
    if (aquarium?.plantDensity === 'dutch' && (status.nitrogen === 'low' || status.phosphorus === 'low')) {
      tips.push('🌿 Dutch aquarium requires maximum dosing - consider EI full dose');
    }
    if (aquarium?.hasCO2 && aquarium?.lightLevel === 'high' && status.iron === 'low') {
      tips.push('🔬 High light + CO₂ = fast growth. Iron is consumed faster');
    }
    if (consumptionMultiplier >= 3) {
      tips.push('🚀 High-tech setup - expect daily nutrient dosing');
    }
    if (consumptionMultiplier <= 0.5) {
      tips.push('🐢 Low-tech aquarium - dosing 1-2× per week is sufficient');
    }
    
    if (status.nitrogen === 'low') {
      tips.push('💡 Low nitrogen can cause pale leaves and slow growth.');
    }
    if (status.nitrogen === 'high') {
      tips.push('⚠️ High nitrogen levels - consider larger water change or reduce dosing.');
    }
    if (status.phosphorus === 'low') {
      tips.push('💡 Phosphate deficiency can cause darkening of older leaves.');
    }
    if (status.iron === 'low') {
      tips.push('💡 Iron deficiency causes yellowing of young leaves (chlorosis).');
    }
    if (status.potassium === 'low') {
      tips.push('💡 Potassium deficiency shows as holes and browning leaf edges.');
    }
    if (status.magnesium === 'low') {
      tips.push('💡 Magnesium deficiency causes yellowing between veins of older leaves.');
    }
    
    if (Object.values(status).every(s => s === 'optimal')) {
      tips.push('✅ All nutrients are in optimal range. Continue current dosing!');
    }
    
    tips.push('🔄 EI method recommends 50% weekly water change to reset nutrients.');
  }
  
  return {
    currentLevels: {
      nitrogen: weeklyN,
      phosphorus: weeklyP,
      potassium: weeklyK,
      iron: weeklyFe,
      magnesium: weeklyMg,
    },
    weeklyTotals: {
      nitrogen: weeklyN,
      phosphorus: weeklyP,
      potassium: weeklyK,
      iron: weeklyFe,
      magnesium: weeklyMg,
    },
    status,
    consumptionMultiplier,
    consumptionDescription,
    recommendations,
    tips,
  };
};

// Generate 7-day projection based on current dosing
export const projectNutrients = (
  startLevels: { nitrogen: number; phosphorus: number; potassium: number; iron: number; magnesium: number },
  dailyDosing: { nitrogen: number; phosphorus: number; potassium: number; iron: number; magnesium: number },
  aquarium?: Partial<Aquarium>,
  waterChangeDay: number = 7,
  waterChangePercent: number = 50
): NutrientProjection[] => {
  const consumptionMultiplier = calculateConsumptionMultiplier(aquarium || {});
  const projections: NutrientProjection[] = [];
  const today = new Date();
  
  let current = { ...startLevels };
  const baseDailyDecay = 0.05 * consumptionMultiplier; // Adjusted by consumption
  
  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    
    // Apply daily decay
    current.nitrogen *= (1 - baseDailyDecay);
    current.phosphorus *= (1 - baseDailyDecay);
    current.potassium *= (1 - baseDailyDecay);
    current.iron *= (1 - baseDailyDecay * 2); // Iron decays faster
    current.magnesium *= (1 - baseDailyDecay);
    
    // Add daily dose
    current.nitrogen += dailyDosing.nitrogen;
    current.phosphorus += dailyDosing.phosphorus;
    current.potassium += dailyDosing.potassium;
    current.iron += dailyDosing.iron;
    current.magnesium += dailyDosing.magnesium;
    
    // Water change resets levels
    if (day + 1 === waterChangeDay) {
      const keepPercent = 1 - (waterChangePercent / 100);
      current.nitrogen *= keepPercent;
      current.phosphorus *= keepPercent;
      current.potassium *= keepPercent;
      current.iron *= keepPercent;
      current.magnesium *= keepPercent;
    }
    
    projections.push({
      date: date.toISOString().split('T')[0],
      nitrogen: Math.round(current.nitrogen * 10) / 10,
      phosphorus: Math.round(current.phosphorus * 100) / 100,
      potassium: Math.round(current.potassium * 10) / 10,
      iron: Math.round(current.iron * 100) / 100,
      magnesium: Math.round(current.magnesium * 10) / 10,
    });
  }
  
  return projections;
};

// Estimative Index Calculator
// Based on Tom Barr's EI method for planted aquariums

export interface EITargets {
  nitrateMin: number; // ppm NO3
  nitrateMax: number;
  phosphateMin: number; // ppm PO4
  phosphateMax: number;
  potassiumMin: number; // ppm K
  potassiumMax: number;
  ironMin: number; // ppm Fe
  ironMax: number;
}

export const EI_TARGETS: EITargets = {
  nitrateMin: 10,
  nitrateMax: 30,
  phosphateMin: 1,
  phosphateMax: 3,
  potassiumMin: 10,
  potassiumMax: 30,
  ironMin: 0.1,
  ironMax: 0.5,
};

export interface DosingRecommendation {
  fertilizerId: string;
  fertilizerName: string;
  recommendedDose: number; // ml or g
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
}

export interface EIAnalysis {
  currentLevels: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    iron: number;
  };
  recommendations: DosingRecommendation[];
  weeklyTotals: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    iron: number;
  };
  status: {
    nitrogen: 'low' | 'optimal' | 'high';
    phosphorus: 'low' | 'optimal' | 'high';
    potassium: 'low' | 'optimal' | 'high';
    iron: 'low' | 'optimal' | 'high';
  };
  tips: string[];
}

// Calculate how much nutrient is added per dose to aquarium
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
  daysUntilWaterChange: number = 7
): number => {
  const deficit = Math.max(0, targetPpm - currentPpm);
  if (nutrientPpmPerMl <= 0) return 0;
  
  // Account for some uptake/decay (assume 30% weekly consumption)
  const weeklyTarget = deficit + (targetPpm * 0.3 * (daysUntilWaterChange / 7));
  
  return (weeklyTarget * aquariumVolume) / nutrientPpmPerMl;
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
  }>,
  weeklyDosing: Array<{
    fertilizerId: string;
    totalAmount: number;
  }>,
  lastWaterParams?: {
    nitrate: number;
  }
): EIAnalysis => {
  // Calculate current nutrient levels from dosing
  let weeklyN = 0, weeklyP = 0, weeklyK = 0, weeklyFe = 0;
  
  weeklyDosing.forEach(dose => {
    const fert = fertilizers.find(f => f.id === dose.fertilizerId);
    if (fert && dose.totalAmount > 0) {
      weeklyN += calculateNutrientAddition(dose.totalAmount, fert.nitrogenPpm || 0, aquariumVolume);
      weeklyP += calculateNutrientAddition(dose.totalAmount, fert.phosphorusPpm || 0, aquariumVolume);
      weeklyK += calculateNutrientAddition(dose.totalAmount, fert.potassiumPpm || 0, aquariumVolume);
      weeklyFe += calculateNutrientAddition(dose.totalAmount, fert.ironPpm || 0, aquariumVolume);
    }
  });
  
  // Determine status for each nutrient
  const getStatus = (value: number, min: number, max: number): 'low' | 'optimal' | 'high' => {
    if (value < min) return 'low';
    if (value > max) return 'high';
    return 'optimal';
  };
  
  const status = {
    nitrogen: getStatus(weeklyN, EI_TARGETS.nitrateMin, EI_TARGETS.nitrateMax),
    phosphorus: getStatus(weeklyP, EI_TARGETS.phosphateMin, EI_TARGETS.phosphateMax),
    potassium: getStatus(weeklyK, EI_TARGETS.potassiumMin, EI_TARGETS.potassiumMax),
    iron: getStatus(weeklyFe, EI_TARGETS.ironMin, EI_TARGETS.ironMax),
  };
  
  // Generate recommendations
  const recommendations: DosingRecommendation[] = [];
  
  fertilizers.forEach(fert => {
    const currentDose = weeklyDosing.find(d => d.fertilizerId === fert.id);
    const currentAmount = currentDose?.totalAmount || 0;
    
    // Find best use case for this fertilizer
    let recommendedIncrease = 0;
    let reasoning = '';
    
    if (fert.nitrogenPpm && fert.nitrogenPpm > 0 && status.nitrogen === 'low') {
      const needed = calculateRecommendedDose(
        EI_TARGETS.nitrateMin + 5, 
        weeklyN, 
        fert.nitrogenPpm, 
        aquariumVolume
      );
      recommendedIncrease = Math.max(recommendedIncrease, needed - currentAmount);
      reasoning = 'Zvýšit dávku pro optimální hladinu dusíku';
    }
    
    if (fert.phosphorusPpm && fert.phosphorusPpm > 0 && status.phosphorus === 'low') {
      const needed = calculateRecommendedDose(
        EI_TARGETS.phosphateMin + 0.5, 
        weeklyP, 
        fert.phosphorusPpm, 
        aquariumVolume
      );
      recommendedIncrease = Math.max(recommendedIncrease, needed - currentAmount);
      reasoning = reasoning || 'Zvýšit dávku pro optimální hladinu fosfátu';
    }
    
    if (fert.ironPpm && fert.ironPpm > 0 && status.iron === 'low') {
      const needed = calculateRecommendedDose(
        EI_TARGETS.ironMin + 0.1, 
        weeklyFe, 
        fert.ironPpm, 
        aquariumVolume
      );
      recommendedIncrease = Math.max(recommendedIncrease, needed - currentAmount);
      reasoning = reasoning || 'Zvýšit dávku pro optimální hladinu železa';
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
  
  // General EI tips
  if (Object.values(status).every(s => s === 'optimal')) {
    tips.push('✅ Všechny živiny jsou v optimálním rozmezí. Pokračujte v aktuálním dávkování!');
  }
  
  tips.push('🔄 EI metoda doporučuje 50% výměnu vody týdně pro reset živin.');
  
  return {
    currentLevels: {
      nitrogen: weeklyN,
      phosphorus: weeklyP,
      potassium: weeklyK,
      iron: weeklyFe,
    },
    recommendations,
    weeklyTotals: {
      nitrogen: weeklyN,
      phosphorus: weeklyP,
      potassium: weeklyK,
      iron: weeklyFe,
    },
    status,
    tips,
  };
};

// Generate 7-day projection based on current dosing
export const projectNutrients = (
  startLevels: { nitrogen: number; phosphorus: number; potassium: number; iron: number },
  dailyDosing: { nitrogen: number; phosphorus: number; potassium: number; iron: number },
  waterChangeDay: number = 7, // Day of water change (1-7)
  waterChangePercent: number = 50
): NutrientProjection[] => {
  const projections: NutrientProjection[] = [];
  const today = new Date();
  
  let current = { ...startLevels };
  const dailyDecay = 0.05; // 5% daily consumption/decay
  
  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    
    // Apply daily decay
    current.nitrogen *= (1 - dailyDecay);
    current.phosphorus *= (1 - dailyDecay);
    current.potassium *= (1 - dailyDecay);
    current.iron *= (1 - dailyDecay * 2); // Iron decays faster
    
    // Add daily dose
    current.nitrogen += dailyDosing.nitrogen;
    current.phosphorus += dailyDosing.phosphorus;
    current.potassium += dailyDosing.potassium;
    current.iron += dailyDosing.iron;
    
    // Water change resets levels
    if (day + 1 === waterChangeDay) {
      const keepPercent = 1 - (waterChangePercent / 100);
      current.nitrogen *= keepPercent;
      current.phosphorus *= keepPercent;
      current.potassium *= keepPercent;
      current.iron *= keepPercent;
    }
    
    projections.push({
      date: date.toISOString().split('T')[0],
      nitrogen: Math.round(current.nitrogen * 10) / 10,
      phosphorus: Math.round(current.phosphorus * 100) / 100,
      potassium: Math.round(current.potassium * 10) / 10,
      iron: Math.round(current.iron * 100) / 100,
    });
  }
  
  return projections;
};

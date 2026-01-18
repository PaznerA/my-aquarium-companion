// Localization system for AquariumJournal

export type Language = 'cs' | 'en';
export type UnitSystem = 'metric' | 'imperial';

export interface Translations {
  // Navigation
  nav: {
    dashboard: string;
    aquariums: string;
    lexicon: string;
    inventory: string;
    tools: string;
    settings: string;
    appName: string;
    appDescription: string;
  };
  // Tools
  tools: {
    title: string;
    subtitle: string;
    calculators: string;
    fertilizerCalculator: string;
    fertilizerCalculatorDesc: string;
    fertilizerCalculatorLongDesc: string;
    dosageCalculator: string;
    dosageCalculatorDesc: string;
    dosageCalculatorLongDesc: string;
    waterMixCalculator: string;
    waterMixCalculatorDesc: string;
    waterMixCalculatorLongDesc: string;
    tdsCalculator: string;
    tdsCalculatorDesc: string;
    tdsCalculatorLongDesc: string;
    new: string;
    comingSoon: string;
    manufacturerSpecs: string;
    enterManufacturerInfo: string;
    nutrientType: string;
    doseAmount: string;
    doseUnit: string;
    drops: string;
    tankVolume: string;
    dosingFrequency: string;
    daily: string;
    every2Days: string;
    weekly: string;
    biweekly: string;
    eiTarget: string;
    eiTargetTooltip: string;
    targetPpm: string;
    week: string;
    calculate: string;
    result: string;
    calculatedNutrientContent: string;
    perMl: string;
    perDose: string;
    perWeek: string;
    copyValue: string;
    saveAsFertilizer: string;
    fertilizerNamePlaceholder: string;
    saveFertilizer: string;
    enterDataToCalculate: string;
    howItWorks: string;
    howItWorksDesc: string;
    howItWorksStep1: string;
    howItWorksStep2: string;
    howItWorksStep3: string;
    calculationComplete: string;
    enterFertilizerName: string;
    fertilizerSaved: string;
    copiedToClipboard: string;
    singleNutrient: string;
    multiNutrient: string;
    multiNutrientDesc: string;
    selectAtLeastOne: string;
    aquariumParams: string;
    aquariumParamsDesc: string;
    selectAquarium: string;
    customParams: string;
    eiTargetPercent: string;
    lowTech: string;
    standard: string;
    highTech: string;
    selectFertilizers: string;
    selectFertilizersTitle: string;
    selectFertilizersDesc: string;
    noNutrientData: string;
    dosingRecommendations: string;
    dailyDose: string;
    weeklyDose: string;
    weeklyTotal: string;
    waterSources: string;
    waterSourcesDesc: string;
    tapWater: string;
    roWater: string;
    roWaterTooltip: string;
    totalVolume: string;
    targetParams: string;
    targetParamsDesc: string;
    presets: string;
    presetSoftWater: string;
    presetMediumWater: string;
    presetShrimp: string;
    presetDiscus: string;
    targetGh: string;
    targetKh: string;
    targetNotAchievable: string;
    optimizeFor: string;
    optimizeForDesc: string;
    balanced: string;
    mixResult: string;
    mixRatio: string;
    resultingParams: string;
    target: string;
    waterMixInfo: string;
    waterMixInfoDesc: string;
    waterMixTip1: string;
    waterMixTip2: string;
    waterMixTip3: string;
    remineralization: string;
    remineralizationDesc: string;
    remineralizerProduct: string;
    waterVolume: string;
    startingTds: string;
    startingTdsTooltip: string;
    calculateBy: string;
    byTds: string;
    byGh: string;
    targetTds: string;
    remineralizationResult: string;
    addToWater: string;
    comparisonWithPresets: string;
    tdsInfo: string;
    tdsInfoDesc: string;
    tdsTip1: string;
    tdsTip2: string;
    tdsTip3: string;
    enterValidTdsPerGram: string;
    enterValidGhPerGram: string;
    targetAlreadyReached: string;
  };
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    aquariums: string;
    events: string;
    addAquarium: string;
    addEvent: string;
    noAquariums: string;
    noAquariumsHint: string;
    noEvents: string;
    noEventsHint: string;
  };
  // Wikipedia
  wiki: {
    lookupInfo: string;
    notFound: string;
    fetchError: string;
    tryAgain: string;
    readMore: string;
  };
  // Stats
  stats: {
    aquariums: string;
    fish: string;
    plants: string;
    equipment: string;
  };
  // Settings
  settings: {
    title: string;
    subtitle: string;
    users: string;
    usersHint: string;
    addUser: string;
    defaultUser: string;
    active: string;
    theme: string;
    themeHint: string;
    language: string;
    languageHint: string;
    units: string;
    unitsHint: string;
    metricUnits: string;
    imperialUnits: string;
    fileSync: string;
    fileSyncHint: string;
    selectFolder: string;
    autoSync: string;
    lastSync: string;
    saveNow: string;
    loadFromFolder: string;
    changeFolder: string;
    disconnect: string;
    notSupported: string;
    backup: string;
    backupHint: string;
    export: string;
    import: string;
    dangerZone: string;
    dangerZoneHint: string;
    deleteAllData: string;
    deleteConfirm: string;
    about: string;
    aboutText: string;
    version: string;
    mockData: string;
    mockDataHint: string;
    loadMockData: string;
    mockDataConfirm: string;
  };
  // Inventory
  inventory: {
    title: string;
    subtitle: string;
    fertilizers: string;
    equipment: string;
    addFertilizer: string;
    addEquipment: string;
    editFertilizer: string;
    editEquipment: string;
    noFertilizers: string;
    noEquipment: string;
    name: string;
    brand: string;
    amount: string;
    unit: string;
    type: string;
    nutrientContent: string;
    add: string;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    iron: string;
    magnesium: string;
    // EI parameters
    plantDensity: string;
    plantDensityLow: string;
    plantDensityMedium: string;
    plantDensityHigh: string;
    plantDensityDutch: string;
    hasCO2: string;
    lightLevel: string;
    lightLevelLow: string;
    lightLevelMedium: string;
    lightLevelHigh: string;
    consumptionMultiplier: string;
  };
  // Equipment types
  equipmentTypes: {
    filter: string;
    heater: string;
    light: string;
    co2: string;
    pump: string;
    other: string;
  };
  // Aquarium
  aquarium: {
    title: string;
    subtitle: string;
    noAquariums: string;
    noAquariumsHint: string;
    volume: string;
    liters: string;
    gallons: string;
    newAquarium: string;
    editAquarium: string;
    editFish: string;
    editPlant: string;
    notFound: string;
    backToAquariums: string;
    journal: string;
    fish: string;
    plants: string;
    water: string;
    chart: string;
    gallery: string;
    addFish: string;
    addPlant: string;
    addMeasurement: string;
    noFish: string;
    noPlants: string;
    noMeasurements: string;
    name: string;
    species: string;
    count: string;
    date: string;
    historyStats: string;
    deleteConfirm: string;
    temperature: string;
    ammonia: string;
    nitrite: string;
    nitrate: string;
    sharing: string;
    privateOnly: string;
    shareWithAll: string;
    shareWithSelected: string;
    shareWithUsers: string;
    speciesInfo: string;
  };
  // Journal
  journal: {
    dosing: string;
    maintenance: string;
    waterChange: string;
    vacuuming: string;
    trimming: string;
    filterCleaning: string;
    photos: string;
    notes: string;
    notesPlaceholder: string;
    addFertilizersHint: string;
    global: string;
    noNotes: string;
    addNote: string;
    eiAnalysis: string;
    formSettings: string;
    fertilizersInForm: string;
    hideFertilizersHint: string;
    noFertilizersInInventory: string;
    formSections: string;
    fertilizerDosing: string;
    eventsSection: string;
    plannedEvents: string;
    noPlannedEvents: string;
    markComplete: string;
  };
  // Events
  events: {
    title: string;
    subtitle: string;
    newEvent: string;
    addEvent: string;
    editEvent: string;
    eventName: string;
    eventType: string;
    eventDate: string;
    recurring: string;
    noRecurring: string;
    create: string;
    maintenance: string;
    feeding: string;
    waterChange: string;
    dosing: string;
    treatment: string;
    other: string;
    daily: string;
    weekly: string;
    biweekly: string;
    monthly: string;
    global: string;
    today: string;
    upcoming: string;
    past: string;
    recurringSettings: string;
    noUpcoming: string;
    noUpcomingHint: string;
    noPast: string;
    noRecurringEvents: string;
    noRecurringHint: string;
    recurringHint: string;
    notesPlaceholder: string;
  };
  // Lexicon
  lexicon: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    all: string;
    allSpecies: string;
    favorites: string;
    noResults: string;
    noFavorites: string;
    noFavoritesHint: string;
    maxSize: string;
    lifespan: string;
    minSchool: string;
    minTank: string;
    light: string;
    required: string;
    notRequired: string;
    careNotes: string;
    compatibility: string;
    myNotes: string;
    addNotePlaceholder: string;
    addNote: string;
    speciesInfo: string;
    noSpeciesMatched: string;
    noSpeciesMatchedHint: string;
    issues: string;
    optimalParams: string;
    identifiedSpecies: string;
  };
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    close: string;
    yes: string;
    no: string;
    optional: string;
    loading: string;
    error: string;
    success: string;
    dataExported: string;
    dataImported: string;
    importFailed: string;
    dataDeleted: string;
    mockDataLoaded: string;
    synced: string;
    syncFailed: string;
    loadFailed: string;
    loaded: string;
    disconnected: string;
    folderChanged: string;
    add: string;
  };
}

export const translations: Record<Language, Translations> = {
  cs: {
    nav: {
      dashboard: 'Dashboard',
      aquariums: 'Akvária',
      lexicon: 'Lexikon',
      inventory: 'Zásoby',
      tools: 'Nástroje',
      settings: 'Nastavení',
      appName: 'AquariumJournal',
      appDescription: 'Správa akvárií',
    },
    tools: {
      title: 'Nástroje',
      subtitle: 'Kalkulátory a pokročilé funkce',
      calculators: 'Kalkulátory',
      fertilizerCalculator: 'Kalkulátor hnojiv',
      fertilizerCalculatorDesc: 'Zjistěte obsah živin z údajů výrobce',
      fertilizerCalculatorLongDesc: 'Extrahujte ppm hodnoty z dávkovacích instrukcí výrobce',
      dosageCalculator: 'Kalkulátor dávkování',
      dosageCalculatorDesc: 'Výpočet optimálního dávkování pro váš objem',
      dosageCalculatorLongDesc: 'Vypočtěte optimální dávkování na základě EI parametrů a nastavení akvária',
      waterMixCalculator: 'Míchání vody',
      waterMixCalculatorDesc: 'Výpočet poměru RO a kohoutové vody',
      waterMixCalculatorLongDesc: 'Namíchejte RO a kohoutovou vodu pro dosažení cílových GH/KH',
      tdsCalculator: 'TDS Kalkulátor',
      tdsCalculatorDesc: 'Remineralizace RO vody',
      tdsCalculatorLongDesc: 'Vypočtěte kolik remineralizéru přidat pro cílové TDS/GH',
      new: 'Nové',
      comingSoon: 'Připravujeme',
      manufacturerSpecs: 'Údaje výrobce',
      enterManufacturerInfo: 'Zadejte informace z etikety hnojiva',
      nutrientType: 'Typ živiny',
      doseAmount: 'Dávka',
      doseUnit: 'Jednotka',
      drops: 'kapky',
      tankVolume: 'Objem akvária',
      dosingFrequency: 'Frekvence dávkování',
      daily: 'Denně',
      every2Days: 'Každé 2 dny',
      weekly: 'Týdně',
      biweekly: 'Každé 2 týdny',
      eiTarget: 'Cíl EI',
      eiTargetTooltip: 'Jakou část Estimative Index výrobce udává. Např. "1/2 EI" = 50%',
      targetPpm: 'Cílové ppm',
      week: 'týden',
      calculate: 'Vypočítat',
      result: 'Výsledek',
      calculatedNutrientContent: 'Vypočtený obsah živin v hnojivu',
      perMl: 'na ml',
      perDose: 'Na dávku',
      perWeek: 'Týdně',
      copyValue: 'Kopírovat hodnotu',
      saveAsFertilizer: 'Uložit jako hnojivo',
      fertilizerNamePlaceholder: 'Název hnojiva...',
      saveFertilizer: 'Uložit do zásobníku',
      enterDataToCalculate: 'Zadejte údaje a klikněte na Vypočítat',
      howItWorks: 'Jak to funguje?',
      howItWorksDesc: 'Kalkulátor zpětně vypočítá obsah živin z dávkovacích doporučení výrobce.',
      howItWorksStep1: 'Zadejte doporučenou dávku (např. 1ml na 10L)',
      howItWorksStep2: 'Vyberte frekvenci a jaký EI cíl výrobce uvádí',
      howItWorksStep3: 'Kalkulátor vypočte ppm živiny na 1ml hnojiva',
      calculationComplete: 'Výpočet dokončen',
      enterFertilizerName: 'Zadejte název hnojiva',
      fertilizerSaved: 'Hnojivo uloženo do zásobníku',
      copiedToClipboard: 'Zkopírováno do schránky',
      singleNutrient: 'Jedna živina',
      multiNutrient: 'Více živin',
      multiNutrientDesc: 'Vyberte živiny obsažené v hnojivu a jejich EI cíle',
      selectAtLeastOne: 'Vyberte alespoň jednu živinu',
      aquariumParams: 'Parametry akvária',
      aquariumParamsDesc: 'Vyberte akvárium nebo zadejte vlastní parametry',
      selectAquarium: 'Vybrat akvárium',
      customParams: 'Vlastní parametry',
      eiTargetPercent: 'Cíl EI (%)',
      lowTech: 'low-tech',
      standard: 'standardní',
      highTech: 'high-tech',
      selectFertilizers: 'Vyberte alespoň jedno hnojivo',
      selectFertilizersTitle: 'Hnojiva',
      selectFertilizersDesc: 'Vyberte hnojiva pro výpočet dávkování',
      noNutrientData: 'Hnojivo nemá zadané hodnoty živin',
      dosingRecommendations: 'Doporučené dávkování',
      dailyDose: 'Denní dávka',
      weeklyDose: 'Týdenní dávka',
      weeklyTotal: 'Celkem týdně',
      waterSources: 'Zdroje vody',
      waterSourcesDesc: 'Zadejte parametry vaší kohoutové a RO vody',
      tapWater: 'Kohoutová voda',
      roWater: 'RO voda',
      roWaterTooltip: 'Reverzní osmóza - obvykle GH 0, KH 0',
      totalVolume: 'Celkový objem',
      targetParams: 'Cílové parametry',
      targetParamsDesc: 'Jaké GH/KH chcete dosáhnout',
      presets: 'Předvolby',
      presetSoftWater: 'Měkká voda',
      presetMediumWater: 'Střední',
      presetShrimp: 'Krevetky',
      presetDiscus: 'Diskusi',
      targetGh: 'Cílové GH',
      targetKh: 'Cílové KH',
      targetNotAchievable: 'Cíl nelze dosáhnout s danými zdroji',
      optimizeFor: 'Optimalizovat pro',
      optimizeForDesc: 'Vyberte parametr, který je důležitější',
      balanced: 'Vyvážené',
      mixResult: 'Výsledek míchání',
      mixRatio: 'Poměr míchání',
      resultingParams: 'Výsledné parametry',
      target: 'cíl',
      waterMixInfo: 'Jak to funguje?',
      waterMixInfoDesc: 'Kalkulátor vypočítá poměr RO a kohoutové vody pro dosažení cílových parametrů.',
      waterMixTip1: 'Změřte GH a KH vaší kohoutové vody pomocí kapkových testů',
      waterMixTip2: 'RO voda má obvykle GH 0 a KH 0 (pokud není remineralizovaná)',
      waterMixTip3: 'Pro krevetky a citlivé ryby je důležitá stabilita parametrů',
      remineralization: 'Remineralizace',
      remineralizationDesc: 'Přidejte minerály do RO vody',
      remineralizerProduct: 'Remineralizér',
      waterVolume: 'Objem vody',
      startingTds: 'Počáteční TDS',
      startingTdsTooltip: 'TDS vaší RO vody (obvykle 0-10 ppm)',
      calculateBy: 'Počítat podle',
      byTds: 'Podle TDS',
      byGh: 'Podle GH',
      targetTds: 'Cílové TDS',
      remineralizationResult: 'Výsledek remineralizace',
      addToWater: 'Přidejte do vody',
      comparisonWithPresets: 'Porovnání s předvolbami',
      tdsInfo: 'Jak to funguje?',
      tdsInfoDesc: 'Kalkulátor vypočítá kolik gramů remineralizéru přidat do RO vody.',
      tdsTip1: 'Použijte TDS metr pro měření čisté RO vody',
      tdsTip2: 'Různé remineralizéry mají různý poměr GH/KH',
      tdsTip3: 'Pro krevetky Caridina použijte pouze GH+ (bez KH)',
      enterValidTdsPerGram: 'Zadejte platnou hodnotu TDS na gram',
      enterValidGhPerGram: 'Zadejte platnou hodnotu GH na gram',
      targetAlreadyReached: 'Cílová hodnota je již dosažena',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Přehled vašich akvárií',
      aquariums: 'Akvária',
      events: 'Události',
      addAquarium: 'Přidat akvárium',
      addEvent: 'Přidat událost',
      noAquariums: 'Zatím nemáte žádné akvárium',
      noAquariumsHint: 'Přidejte své první akvárium',
      noEvents: 'Žádné nadcházející události',
      noEventsHint: 'Vytvořte připomenutí údržby',
    },
    stats: {
      aquariums: 'Akvária',
      fish: 'Ryby',
      plants: 'Rostliny',
      equipment: 'Vybavení',
    },
    settings: {
      title: 'Nastavení',
      subtitle: 'Správa aplikace a dat',
      users: 'Uživatelé',
      usersHint: 'Spravujte více profilů pro sdílené zařízení',
      addUser: 'Přidat',
      defaultUser: 'Výchozí uživatel',
      active: 'AKTIVNÍ',
      theme: 'Vzhled',
      themeHint: 'Přepnout mezi světlým a tmavým režimem',
      language: 'Jazyk',
      languageHint: 'Vyberte jazyk aplikace',
      units: 'Jednotky',
      unitsHint: 'Metrické (litry, °C) nebo imperiální (galony, °F)',
      metricUnits: 'Metrické (EU)',
      imperialUnits: 'Imperiální (US)',
      fileSync: 'Synchronizace se složkou',
      fileSyncHint: 'Automatické ukládání do lokální složky každých 30s',
      selectFolder: 'Vybrat složku pro synchronizaci',
      autoSync: 'Automatická synchronizace',
      lastSync: 'Poslední sync',
      saveNow: 'Uložit nyní',
      loadFromFolder: 'Načíst ze složky',
      changeFolder: 'Změnit složku',
      disconnect: 'Odpojit',
      notSupported: 'Váš prohlížeč nepodporuje File System Access API. Použijte Chrome, Edge nebo Brave.',
      backup: 'Ruční zálohování',
      backupHint: 'Exportujte nebo importujte data jako JSON soubor',
      export: 'Exportovat data',
      import: 'Importovat data',
      dangerZone: 'Nebezpečná zóna',
      dangerZoneHint: 'Tyto akce jsou nevratné',
      deleteAllData: 'Smazat všechna data',
      deleteConfirm: 'Opravdu chcete smazat všechna data? Tato akce je nevratná.',
      about: 'O aplikaci',
      aboutText: 'AquariumJournal je offline-first aplikace pro správu akvárií. Všechna data jsou uložena lokálně ve vašem prohlížeči.',
      version: 'Verze',
      mockData: 'Demo data',
      mockDataHint: 'Naplňte aplikaci ukázkovými daty pro testování',
      loadMockData: 'Načíst demo data',
      mockDataConfirm: 'Toto přidá demo data k vašim stávajícím datům. Pokračovat?',
    },
    inventory: {
      title: 'Zásoby',
      subtitle: 'Správa hnojiv a vybavení',
      fertilizers: 'Hnojiva',
      equipment: 'Technika',
      addFertilizer: 'Přidat hnojivo',
      addEquipment: 'Přidat vybavení',
      editFertilizer: 'Upravit hnojivo',
      editEquipment: 'Upravit vybavení',
      noFertilizers: 'Zatím žádná hnojiva',
      noEquipment: 'Zatím žádné vybavení',
      name: 'Název',
      brand: 'Značka',
      amount: 'Množství',
      unit: 'Jednotka',
      type: 'Typ',
      nutrientContent: 'Obsah živin (ppm per 1 {unit} pro EI kalkulátor)',
      add: 'Přidat',
      nitrogen: 'N (dusík)',
      phosphorus: 'P (fosfor)',
      potassium: 'K (draslík)',
      iron: 'Fe (železo)',
      magnesium: 'Mg (hořčík)',
      plantDensity: 'Hustota rostlin',
      plantDensityLow: 'Nízká',
      plantDensityMedium: 'Střední',
      plantDensityHigh: 'Vysoká',
      plantDensityDutch: 'Dutch (maximální)',
      hasCO2: 'CO₂ vstřikování',
      lightLevel: 'Intenzita světla',
      lightLevelLow: 'Nízká (~20-30 PAR)',
      lightLevelMedium: 'Střední (~40-60 PAR)',
      lightLevelHigh: 'Vysoká (~80+ PAR)',
      consumptionMultiplier: 'Spotřeba živin',
    },
    equipmentTypes: {
      filter: 'Filtr',
      heater: 'Topení',
      light: 'Osvětlení',
      co2: 'CO₂ systém',
      pump: 'Čerpadlo',
      other: 'Ostatní',
    },
    aquarium: {
      title: 'Akvária',
      subtitle: 'Správa vašich akvárií',
      noAquariums: 'Zatím nemáte žádné akvárium',
      noAquariumsHint: 'Klikněte na "Přidat akvárium" pro vytvoření prvního',
      volume: 'Objem',
      liters: 'litrů',
      gallons: 'galonů',
      newAquarium: 'Nové akvárium',
      editAquarium: 'Upravit akvárium',
      editFish: 'Upravit rybu',
      editPlant: 'Upravit rostlinu',
      notFound: 'Akvárium nenalezeno',
      backToAquariums: 'Zpět na akvária',
      journal: 'Deník',
      fish: 'Ryby',
      plants: 'Rostliny',
      water: 'Voda',
      chart: 'Graf',
      gallery: 'Galerie',
      addFish: 'Přidat rybu',
      addPlant: 'Přidat rostlinu',
      addMeasurement: 'Přidat měření',
      noFish: 'Zatím žádné ryby',
      noPlants: 'Zatím žádné rostliny',
      noMeasurements: 'Zatím žádná měření',
      name: 'Název',
      species: 'Druh',
      count: 'Počet',
      date: 'Datum',
      historyStats: 'Historie a statistiky',
      deleteConfirm: 'Opravdu chcete smazat toto akvárium?',
      temperature: 'Teplota',
      ammonia: 'Amoniak',
      nitrite: 'Dusitany',
      nitrate: 'Dusičnany',
      sharing: 'Sdílení',
      privateOnly: 'Pouze já',
      shareWithAll: 'Sdílet se všemi',
      shareWithSelected: 'Sdílet s vybranými',
      shareWithUsers: 'Vyberte uživatele',
      speciesInfo: 'Druhy',
    },
    journal: {
      dosing: 'Dávkování',
      maintenance: 'Údržba',
      waterChange: 'Výměna vody',
      vacuuming: 'Odsávání dna',
      trimming: 'Zastřihování rostlin',
      filterCleaning: 'Čištění filtru',
      photos: 'Fotografie',
      notes: 'Poznámky',
      notesPlaceholder: 'Poznámky k dnešnímu dni...',
      addFertilizersHint: 'Přidejte hnojiva v Zásobách',
      global: 'Globální',
      noNotes: 'Zatím žádné poznámky',
      addNote: 'Přidat poznámku...',
      eiAnalysis: 'EI',
      formSettings: 'Nastavení',
      fertilizersInForm: 'Hnojiva ve formuláři',
      hideFertilizersHint: 'Skryjte hnojiva, která nepoužíváte pro toto akvárium',
      noFertilizersInInventory: 'Žádná hnojiva v zásobách',
      formSections: 'Sekce formuláře',
      fertilizerDosing: 'Dávkování hnojiv',
      eventsSection: 'Události',
      plannedEvents: 'Plánované události',
      noPlannedEvents: 'Žádné plánované události pro tento den',
      markComplete: 'Označit jako dokončené',
    },
    events: {
      title: 'Události',
      subtitle: 'Plánování a historie událostí',
      newEvent: 'Nová událost',
      addEvent: 'Přidat událost',
      editEvent: 'Upravit událost',
      eventName: 'Název',
      eventType: 'Typ',
      eventDate: 'Datum',
      recurring: 'Opakování',
      noRecurring: 'Neopakuje se',
      create: 'Vytvořit',
      maintenance: 'Údržba',
      feeding: 'Krmení',
      waterChange: 'Výměna vody',
      dosing: 'Dávkování',
      treatment: 'Léčba',
      other: 'Ostatní',
      daily: 'Denně',
      weekly: 'Týdně',
      biweekly: 'Každé 2 týdny',
      monthly: 'Měsíčně',
      global: 'Globální',
      today: 'Dnes',
      upcoming: 'Nadcházející',
      past: 'Proběhlé',
      recurringSettings: 'Opakování',
      noUpcoming: 'Žádné nadcházející události',
      noUpcomingHint: 'Vytvořte novou událost pro připomenutí údržby',
      noPast: 'Žádné proběhlé události',
      noRecurringEvents: 'Žádné opakující se události',
      noRecurringHint: 'Nastavte opakování u události pro automatické připomínání',
      recurringHint: 'Zde můžete spravovat nastavení opakování jednotlivých událostí.',
      notesPlaceholder: 'Poznámky k události...',
    },
    lexicon: {
      title: 'Lexikon',
      subtitle: 'Encyklopedie ryb a rostlin',
      searchPlaceholder: 'Hledat druhy...',
      all: 'Vše',
      allSpecies: 'Všechny druhy',
      favorites: 'Oblíbené',
      noResults: 'Žádné výsledky',
      noFavorites: 'Žádné oblíbené',
      noFavoritesHint: 'Klikněte na hvězdičku pro přidání do oblíbených',
      maxSize: 'Max. velikost',
      lifespan: 'Délka života',
      minSchool: 'Min. hejno',
      minTank: 'Min. akvárium',
      light: 'Světlo',
      required: 'Vyžadováno',
      notRequired: 'Není nutné',
      careNotes: 'Péče',
      compatibility: 'Kompatibilita',
      myNotes: 'Moje poznámky',
      addNotePlaceholder: 'Přidat poznámku...',
      addNote: 'Přidat poznámku',
      speciesInfo: 'Informace o druzích',
      noSpeciesMatched: 'Žádné druhy nebyly rozpoznány',
      noSpeciesMatchedHint: 'Přidejte ryby nebo rostliny pro zobrazení informací',
      issues: 'Upozornění',
      optimalParams: 'Doporučené parametry',
      identifiedSpecies: 'Rozpoznané druhy',
    },
    common: {
      save: 'Uložit',
      cancel: 'Zrušit',
      delete: 'Smazat',
      edit: 'Upravit',
      close: 'Zavřít',
      yes: 'Ano',
      no: 'Ne',
      optional: 'volitelné',
      loading: 'Načítání...',
      error: 'Chyba',
      success: 'Úspěch',
      dataExported: 'Data byla exportována',
      dataImported: 'Data byla importována',
      importFailed: 'Nepodařilo se importovat data',
      dataDeleted: 'Data byla smazána',
      mockDataLoaded: 'Demo data byla načtena',
      synced: 'Synchronizováno',
      syncFailed: 'Synchronizace selhala',
      loadFailed: 'Načítání selhalo',
      loaded: 'Načteno',
      disconnected: 'Odpojeno',
      folderChanged: 'Složka změněna',
      add: 'Přidat',
    },
    wiki: {
      lookupInfo: 'Vyhledat informace',
      notFound: 'Článek na Wikipedii nenalezen',
      fetchError: 'Nepodařilo se načíst data z Wikipedie',
      tryAgain: 'Zkusit znovu',
      readMore: 'Přečíst více na Wikipedii',
    },
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      aquariums: 'Aquariums',
      lexicon: 'Lexicon',
      inventory: 'Inventory',
      tools: 'Tools',
      settings: 'Settings',
      appName: 'AquariumJournal',
      appDescription: 'Aquarium Management',
    },
    tools: {
      title: 'Tools',
      subtitle: 'Calculators and advanced features',
      calculators: 'Calculators',
      fertilizerCalculator: 'Fertilizer Calculator',
      fertilizerCalculatorDesc: 'Extract nutrient content from manufacturer data',
      fertilizerCalculatorLongDesc: 'Extract ppm values from manufacturer dosing instructions',
      dosageCalculator: 'Dosage Calculator',
      dosageCalculatorDesc: 'Calculate optimal dosing for your tank',
      dosageCalculatorLongDesc: 'Calculate optimal dosing based on EI parameters and aquarium setup',
      waterMixCalculator: 'Water Mixing',
      waterMixCalculatorDesc: 'Calculate RO and tap water ratio',
      waterMixCalculatorLongDesc: 'Mix RO and tap water to achieve target GH/KH',
      tdsCalculator: 'TDS Calculator',
      tdsCalculatorDesc: 'RO water remineralization',
      tdsCalculatorLongDesc: 'Calculate how much remineralizer to add for target TDS/GH',
      new: 'New',
      comingSoon: 'Coming Soon',
      manufacturerSpecs: 'Manufacturer Specs',
      enterManufacturerInfo: 'Enter info from fertilizer label',
      nutrientType: 'Nutrient Type',
      doseAmount: 'Dose Amount',
      doseUnit: 'Unit',
      drops: 'drops',
      tankVolume: 'Tank Volume',
      dosingFrequency: 'Dosing Frequency',
      daily: 'Daily',
      every2Days: 'Every 2 days',
      weekly: 'Weekly',
      biweekly: 'Every 2 weeks',
      eiTarget: 'EI Target',
      eiTargetTooltip: 'What portion of Estimative Index the manufacturer specifies. E.g. "1/2 EI" = 50%',
      targetPpm: 'Target ppm',
      week: 'week',
      calculate: 'Calculate',
      result: 'Result',
      calculatedNutrientContent: 'Calculated nutrient content in fertilizer',
      perMl: 'per ml',
      perDose: 'Per dose',
      perWeek: 'Per week',
      copyValue: 'Copy value',
      saveAsFertilizer: 'Save as fertilizer',
      fertilizerNamePlaceholder: 'Fertilizer name...',
      saveFertilizer: 'Save to inventory',
      enterDataToCalculate: 'Enter data and click Calculate',
      howItWorks: 'How does it work?',
      howItWorksDesc: 'The calculator reverse-engineers nutrient content from manufacturer dosing recommendations.',
      howItWorksStep1: 'Enter the recommended dose (e.g. 1ml per 10L)',
      howItWorksStep2: 'Select frequency and EI target specified by manufacturer',
      howItWorksStep3: 'Calculator computes ppm of nutrient per 1ml of fertilizer',
      calculationComplete: 'Calculation complete',
      enterFertilizerName: 'Enter fertilizer name',
      fertilizerSaved: 'Fertilizer saved to inventory',
      copiedToClipboard: 'Copied to clipboard',
      singleNutrient: 'Single Nutrient',
      multiNutrient: 'Multi Nutrient',
      multiNutrientDesc: 'Select nutrients in the fertilizer and their EI targets',
      selectAtLeastOne: 'Select at least one nutrient',
      aquariumParams: 'Aquarium Parameters',
      aquariumParamsDesc: 'Select an aquarium or enter custom parameters',
      selectAquarium: 'Select Aquarium',
      customParams: 'Custom Parameters',
      eiTargetPercent: 'EI Target (%)',
      lowTech: 'low-tech',
      standard: 'standard',
      highTech: 'high-tech',
      selectFertilizers: 'Select at least one fertilizer',
      selectFertilizersTitle: 'Fertilizers',
      selectFertilizersDesc: 'Select fertilizers for dosing calculation',
      noNutrientData: 'Fertilizer has no nutrient data',
      dosingRecommendations: 'Dosing Recommendations',
      dailyDose: 'Daily dose',
      weeklyDose: 'Weekly dose',
      weeklyTotal: 'Weekly Total',
      waterSources: 'Water Sources',
      waterSourcesDesc: 'Enter parameters of your tap and RO water',
      tapWater: 'Tap Water',
      roWater: 'RO Water',
      roWaterTooltip: 'Reverse osmosis - usually GH 0, KH 0',
      totalVolume: 'Total Volume',
      targetParams: 'Target Parameters',
      targetParamsDesc: 'What GH/KH you want to achieve',
      presets: 'Presets',
      presetSoftWater: 'Soft Water',
      presetMediumWater: 'Medium',
      presetShrimp: 'Shrimp',
      presetDiscus: 'Discus',
      targetGh: 'Target GH',
      targetKh: 'Target KH',
      targetNotAchievable: 'Target not achievable with given sources',
      optimizeFor: 'Optimize For',
      optimizeForDesc: 'Select which parameter is more important',
      balanced: 'Balanced',
      mixResult: 'Mix Result',
      mixRatio: 'Mix Ratio',
      resultingParams: 'Resulting Parameters',
      target: 'target',
      waterMixInfo: 'How does it work?',
      waterMixInfoDesc: 'The calculator computes the ratio of RO and tap water to achieve target parameters.',
      waterMixTip1: 'Measure your tap water GH and KH using drop tests',
      waterMixTip2: 'RO water usually has GH 0 and KH 0 (unless remineralized)',
      waterMixTip3: 'For shrimp and sensitive fish, parameter stability is crucial',
      remineralization: 'Remineralization',
      remineralizationDesc: 'Add minerals to RO water',
      remineralizerProduct: 'Remineralizer',
      waterVolume: 'Water Volume',
      startingTds: 'Starting TDS',
      startingTdsTooltip: 'TDS of your RO water (usually 0-10 ppm)',
      calculateBy: 'Calculate By',
      byTds: 'By TDS',
      byGh: 'By GH',
      targetTds: 'Target TDS',
      remineralizationResult: 'Remineralization Result',
      addToWater: 'Add to water',
      comparisonWithPresets: 'Comparison with presets',
      tdsInfo: 'How does it work?',
      tdsInfoDesc: 'The calculator computes how many grams of remineralizer to add to RO water.',
      tdsTip1: 'Use a TDS meter to measure pure RO water',
      tdsTip2: 'Different remineralizers have different GH/KH ratios',
      tdsTip3: 'For Caridina shrimp use GH+ only (no KH)',
      enterValidTdsPerGram: 'Enter a valid TDS per gram value',
      enterValidGhPerGram: 'Enter a valid GH per gram value',
      targetAlreadyReached: 'Target value is already reached',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of your aquariums',
      aquariums: 'Aquariums',
      events: 'Events',
      addAquarium: 'Add Aquarium',
      addEvent: 'Add Event',
      noAquariums: 'No aquariums yet',
      noAquariumsHint: 'Add your first aquarium',
      noEvents: 'No upcoming events',
      noEventsHint: 'Create maintenance reminders',
    },
    stats: {
      aquariums: 'Aquariums',
      fish: 'Fish',
      plants: 'Plants',
      equipment: 'Equipment',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage app and data',
      users: 'Users',
      usersHint: 'Manage multiple profiles for shared devices',
      addUser: 'Add',
      defaultUser: 'Default User',
      active: 'ACTIVE',
      theme: 'Appearance',
      themeHint: 'Switch between light and dark mode',
      language: 'Language',
      languageHint: 'Select application language',
      units: 'Units',
      unitsHint: 'Metric (liters, °C) or Imperial (gallons, °F)',
      metricUnits: 'Metric (EU)',
      imperialUnits: 'Imperial (US)',
      fileSync: 'Folder Sync',
      fileSyncHint: 'Auto-save to local folder every 30s',
      selectFolder: 'Select sync folder',
      autoSync: 'Auto sync',
      lastSync: 'Last sync',
      saveNow: 'Save now',
      loadFromFolder: 'Load from folder',
      changeFolder: 'Change folder',
      disconnect: 'Disconnect',
      notSupported: 'Your browser does not support File System Access API. Use Chrome, Edge or Brave.',
      backup: 'Manual Backup',
      backupHint: 'Export or import data as JSON file',
      export: 'Export data',
      import: 'Import data',
      dangerZone: 'Danger Zone',
      dangerZoneHint: 'These actions are irreversible',
      deleteAllData: 'Delete all data',
      deleteConfirm: 'Are you sure you want to delete all data? This action is irreversible.',
      about: 'About',
      aboutText: 'AquariumJournal is an offline-first aquarium management app. All data is stored locally in your browser.',
      version: 'Version',
      mockData: 'Demo Data',
      mockDataHint: 'Fill the app with sample data for testing',
      loadMockData: 'Load demo data',
      mockDataConfirm: 'This will add demo data to your existing data. Continue?',
    },
    inventory: {
      title: 'Inventory',
      subtitle: 'Manage fertilizers and equipment',
      fertilizers: 'Fertilizers',
      equipment: 'Equipment',
      addFertilizer: 'Add Fertilizer',
      addEquipment: 'Add Equipment',
      editFertilizer: 'Edit Fertilizer',
      editEquipment: 'Edit Equipment',
      noFertilizers: 'No fertilizers yet',
      noEquipment: 'No equipment yet',
      name: 'Name',
      brand: 'Brand',
      amount: 'Amount',
      unit: 'Unit',
      type: 'Type',
      nutrientContent: 'Nutrient content (ppm per 1 {unit} for EI calculator)',
      add: 'Add',
      nitrogen: 'N (Nitrogen)',
      phosphorus: 'P (Phosphorus)',
      potassium: 'K (Potassium)',
      iron: 'Fe (Iron)',
      magnesium: 'Mg (Magnesium)',
      plantDensity: 'Plant Density',
      plantDensityLow: 'Low',
      plantDensityMedium: 'Medium',
      plantDensityHigh: 'High',
      plantDensityDutch: 'Dutch (maximum)',
      hasCO2: 'CO₂ Injection',
      lightLevel: 'Light Intensity',
      lightLevelLow: 'Low (~20-30 PAR)',
      lightLevelMedium: 'Medium (~40-60 PAR)',
      lightLevelHigh: 'High (~80+ PAR)',
      consumptionMultiplier: 'Nutrient Consumption',
    },
    equipmentTypes: {
      filter: 'Filter',
      heater: 'Heater',
      light: 'Light',
      co2: 'CO₂ System',
      pump: 'Pump',
      other: 'Other',
    },
    aquarium: {
      title: 'Aquariums',
      subtitle: 'Manage your aquariums',
      noAquariums: 'No aquariums yet',
      noAquariumsHint: 'Click "Add Aquarium" to create your first one',
      volume: 'Volume',
      liters: 'liters',
      gallons: 'gallons',
      newAquarium: 'New Aquarium',
      editAquarium: 'Edit Aquarium',
      editFish: 'Edit Fish',
      editPlant: 'Edit Plant',
      notFound: 'Aquarium not found',
      backToAquariums: 'Back to aquariums',
      journal: 'Journal',
      fish: 'Fish',
      plants: 'Plants',
      water: 'Water',
      chart: 'Chart',
      gallery: 'Gallery',
      addFish: 'Add Fish',
      addPlant: 'Add Plant',
      addMeasurement: 'Add Measurement',
      noFish: 'No fish yet',
      noPlants: 'No plants yet',
      noMeasurements: 'No measurements yet',
      name: 'Name',
      species: 'Species',
      count: 'Count',
      date: 'Date',
      historyStats: 'History and Statistics',
      deleteConfirm: 'Are you sure you want to delete this aquarium?',
      temperature: 'Temperature',
      ammonia: 'Ammonia',
      nitrite: 'Nitrite',
      nitrate: 'Nitrate',
      sharing: 'Sharing',
      privateOnly: 'Only me',
      shareWithAll: 'Share with all',
      shareWithSelected: 'Share with selected',
      shareWithUsers: 'Select users',
      speciesInfo: 'Species',
    },
    journal: {
      dosing: 'Dosing',
      maintenance: 'Maintenance',
      waterChange: 'Water Change',
      vacuuming: 'Vacuuming',
      trimming: 'Plant Trimming',
      filterCleaning: 'Filter Cleaning',
      photos: 'Photos',
      notes: 'Notes',
      notesPlaceholder: 'Notes for today...',
      addFertilizersHint: 'Add fertilizers in Inventory',
      global: 'Global',
      noNotes: 'No notes yet',
      addNote: 'Add note...',
      eiAnalysis: 'EI',
      formSettings: 'Settings',
      fertilizersInForm: 'Fertilizers in Form',
      hideFertilizersHint: 'Hide fertilizers you don\'t use for this aquarium',
      noFertilizersInInventory: 'No fertilizers in inventory',
      formSections: 'Form Sections',
      fertilizerDosing: 'Fertilizer Dosing',
      eventsSection: 'Events',
      plannedEvents: 'Planned Events',
      noPlannedEvents: 'No planned events for this day',
      markComplete: 'Mark as complete',
    },
    events: {
      title: 'Events',
      subtitle: 'Event planning and history',
      newEvent: 'New Event',
      addEvent: 'Add Event',
      editEvent: 'Edit Event',
      eventName: 'Name',
      eventType: 'Type',
      eventDate: 'Date',
      recurring: 'Recurring',
      noRecurring: 'No recurring',
      create: 'Create',
      maintenance: 'Maintenance',
      feeding: 'Feeding',
      waterChange: 'Water Change',
      dosing: 'Dosing',
      treatment: 'Treatment',
      other: 'Other',
      daily: 'Daily',
      weekly: 'Weekly',
      biweekly: 'Every 2 weeks',
      monthly: 'Monthly',
      global: 'Global',
      today: 'Today',
      upcoming: 'Upcoming',
      past: 'Past',
      recurringSettings: 'Recurring',
      noUpcoming: 'No upcoming events',
      noUpcomingHint: 'Create an event for maintenance reminders',
      noPast: 'No past events',
      noRecurringEvents: 'No recurring events',
      noRecurringHint: 'Set up recurring events for automatic reminders',
      recurringHint: 'Manage recurring settings for individual events here.',
      notesPlaceholder: 'Event notes...',
    },
    lexicon: {
      title: 'Lexicon',
      subtitle: 'Fish and plant encyclopedia',
      searchPlaceholder: 'Search species...',
      all: 'All',
      allSpecies: 'All Species',
      favorites: 'Favorites',
      noResults: 'No results',
      noFavorites: 'No favorites',
      noFavoritesHint: 'Click the star to add to favorites',
      maxSize: 'Max size',
      lifespan: 'Lifespan',
      minSchool: 'Min school',
      minTank: 'Min tank',
      light: 'Light',
      required: 'Required',
      notRequired: 'Not required',
      careNotes: 'Care',
      compatibility: 'Compatibility',
      myNotes: 'My Notes',
      addNotePlaceholder: 'Add a note...',
      addNote: 'Add note',
      speciesInfo: 'Species Info',
      noSpeciesMatched: 'No species matched',
      noSpeciesMatchedHint: 'Add fish or plants to see info',
      issues: 'Warnings',
      optimalParams: 'Recommended parameters',
      identifiedSpecies: 'Identified species',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      yes: 'Yes',
      no: 'No',
      optional: 'optional',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      dataExported: 'Data exported',
      dataImported: 'Data imported',
      importFailed: 'Failed to import data',
      dataDeleted: 'Data deleted',
      mockDataLoaded: 'Demo data loaded',
      synced: 'Synced',
      syncFailed: 'Sync failed',
      loadFailed: 'Load failed',
      loaded: 'Loaded',
      disconnected: 'Disconnected',
      folderChanged: 'Folder changed',
      add: 'Add',
    },
    wiki: {
      lookupInfo: 'Lookup information',
      notFound: 'Wikipedia article not found',
      fetchError: 'Failed to load data from Wikipedia',
      tryAgain: 'Try again',
      readMore: 'Read more on Wikipedia',
    },
  },
};

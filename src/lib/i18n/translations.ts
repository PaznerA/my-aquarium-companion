// Localization system for AquariumJournal

export type Language = 'cs' | 'en';
export type UnitSystem = 'metric' | 'imperial';

export interface Translations {
  // Navigation
  nav: {
    dashboard: string;
    aquariums: string;
    inventory: string;
    settings: string;
    appName: string;
    appDescription: string;
  };
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    aquariums: string;
    tasks: string;
    addAquarium: string;
    addTask: string;
    noAquariums: string;
    noAquariumsHint: string;
    noTasks: string;
    noTasksHint: string;
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
  };
}

export const translations: Record<Language, Translations> = {
  cs: {
    nav: {
      dashboard: 'Dashboard',
      aquariums: 'Akvária',
      inventory: 'Zásoby',
      settings: 'Nastavení',
      appName: 'AquariumJournal',
      appDescription: 'Správa akvárií',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Přehled vašich akvárií',
      aquariums: 'Akvária',
      tasks: 'Úkoly',
      addAquarium: 'Přidat akvárium',
      addTask: 'Přidat úkol',
      noAquariums: 'Zatím nemáte žádné akvárium',
      noAquariumsHint: 'Přidejte své první akvárium',
      noTasks: 'Žádné nevyřízené úkoly',
      noTasksHint: 'Vytvořte připomenutí údržby',
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
    },
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      aquariums: 'Aquariums',
      inventory: 'Inventory',
      settings: 'Settings',
      appName: 'AquariumJournal',
      appDescription: 'Aquarium Management',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of your aquariums',
      aquariums: 'Aquariums',
      tasks: 'Tasks',
      addAquarium: 'Add Aquarium',
      addTask: 'Add Task',
      noAquariums: 'No aquariums yet',
      noAquariumsHint: 'Add your first aquarium',
      noTasks: 'No pending tasks',
      noTasksHint: 'Create maintenance reminders',
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
    },
  },
};

// Mock data generator for AquariumJournal
import { generateId, loadData, saveData, AppData, getDefaultFormSettings } from './storage';

export const generateMockData = (): void => {
  const currentData = loadData();
  const userId = currentData.currentUserId || currentData.users[0]?.id || generateId();
  
  // Ensure user exists
  if (currentData.users.length === 0) {
    currentData.users.push({
      id: userId,
      name: 'Demo User',
      createdAt: new Date().toISOString(),
    });
    currentData.currentUserId = userId;
  }

  const now = new Date();
  const daysAgo = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };

  // Create aquariums
  const aquarium1Id = generateId();
  const aquarium2Id = generateId();
  
  const newAquariums = [
    {
      id: aquarium1Id,
      name: 'Amazonka 200L',
      volume: 200,
      dateCreated: daysAgo(180),
      userId,
      formSettings: getDefaultFormSettings(),
    },
    {
      id: aquarium2Id,
      name: 'Nano Cube 30L',
      volume: 30,
      dateCreated: daysAgo(60),
      userId,
      formSettings: getDefaultFormSettings(),
    },
  ];

  // Create fish
  const newFish = [
    { id: generateId(), name: 'Neonka', species: 'Paracheirodon innesi', count: 15, dateAdded: daysAgo(150), aquariumId: aquarium1Id, userId },
    { id: generateId(), name: 'Skalára', species: 'Pterophyllum scalare', count: 4, dateAdded: daysAgo(120), aquariumId: aquarium1Id, userId },
    { id: generateId(), name: 'Korydora panda', species: 'Corydoras panda', count: 6, dateAdded: daysAgo(100), aquariumId: aquarium1Id, userId },
    { id: generateId(), name: 'Otocinclus', species: 'Otocinclus affinis', count: 3, dateAdded: daysAgo(80), aquariumId: aquarium1Id, userId },
    { id: generateId(), name: 'Betta', species: 'Betta splendens', count: 1, dateAdded: daysAgo(45), aquariumId: aquarium2Id, userId },
    { id: generateId(), name: 'Neokaridina', species: 'Neocaridina davidi', count: 10, dateAdded: daysAgo(40), aquariumId: aquarium2Id, userId },
  ];

  // Create plants
  const newPlants = [
    { id: generateId(), name: 'Vallisneria', species: 'Vallisneria spiralis', count: 5, dateAdded: daysAgo(170), aquariumId: aquarium1Id, userId },
    { id: generateId(), name: 'Anubia', species: 'Anubias barteri', count: 3, dateAdded: daysAgo(160), aquariumId: aquarium1Id, userId },
    { id: generateId(), name: 'Echinodorus', species: 'Echinodorus bleheri', count: 2, dateAdded: daysAgo(140), aquariumId: aquarium1Id, userId },
    { id: generateId(), name: 'Mech Java', species: 'Taxiphyllum barbieri', count: 4, dateAdded: daysAgo(55), aquariumId: aquarium2Id, userId },
    { id: generateId(), name: 'Bucephalandra', species: 'Bucephalandra sp.', count: 2, dateAdded: daysAgo(50), aquariumId: aquarium2Id, userId },
  ];

  // Create fertilizers
  const fert1Id = generateId();
  const fert2Id = generateId();
  const fert3Id = generateId();
  
  const newFertilizers = [
    { id: fert1Id, name: 'Macro NPK', brand: 'Seachem', volume: 500, unit: 'ml' as const, nitrogenPpm: 2.5, phosphorusPpm: 0.5, potassiumPpm: 3, userId },
    { id: fert2Id, name: 'Micro', brand: 'Seachem', volume: 250, unit: 'ml' as const, ironPpm: 0.1, userId },
    { id: fert3Id, name: 'Excel', brand: 'Seachem', volume: 500, unit: 'ml' as const, userId },
  ];

  // Create equipment
  const newEquipment = [
    { id: generateId(), name: 'Eheim Classic 350', type: 'filter' as const, brand: 'Eheim', aquariumId: aquarium1Id, isInventory: false, userId },
    { id: generateId(), name: 'Jäger 150W', type: 'heater' as const, brand: 'Eheim', aquariumId: aquarium1Id, isInventory: false, userId },
    { id: generateId(), name: 'Twinstar 600', type: 'light' as const, brand: 'Twinstar', aquariumId: aquarium1Id, isInventory: false, userId },
    { id: generateId(), name: 'CO2 set', type: 'co2' as const, brand: 'Dennerle', aquariumId: aquarium1Id, isInventory: false, userId },
    { id: generateId(), name: 'Fluval Spec', type: 'filter' as const, brand: 'Fluval', aquariumId: aquarium2Id, isInventory: false, userId },
    { id: generateId(), name: 'Chihiros C2', type: 'light' as const, brand: 'Chihiros', aquariumId: aquarium2Id, isInventory: false, userId },
    { id: generateId(), name: 'Náhradní filtr', type: 'filter' as const, brand: 'JBL', isInventory: true, userId },
  ];

  // Create water parameters (last 30 days for aquarium 1)
  const newWaterParams = [];
  for (let i = 0; i < 10; i++) {
    newWaterParams.push({
      id: generateId(),
      date: daysAgo(i * 3),
      ph: 6.8 + (Math.random() * 0.4 - 0.2),
      ammonia: 0,
      nitrite: 0,
      nitrate: 10 + (Math.random() * 15),
      temperature: 25 + (Math.random() * 1 - 0.5),
      kh: 4 + Math.floor(Math.random() * 2),
      gh: 6 + Math.floor(Math.random() * 2),
      aquariumId: aquarium1Id,
      userId,
    });
  }

  // Create journal entries (last 14 days)
  const newJournalEntries = [];
  for (let i = 0; i < 14; i++) {
    newJournalEntries.push({
      id: generateId(),
      date: daysAgo(i),
      aquariumId: aquarium1Id,
      userId,
      dosingEntries: [
        { fertilizerId: fert1Id, amount: i % 2 === 0 ? 5 : 0 },
        { fertilizerId: fert2Id, amount: i % 3 === 0 ? 2 : 0 },
        { fertilizerId: fert3Id, amount: 3 },
      ].filter(d => d.amount > 0),
      waterChanged: i % 7 === 0,
      waterChangePercent: i % 7 === 0 ? 30 : undefined,
      vacuumed: i % 7 === 0,
      trimmed: i % 14 === 0,
      filterCleaned: i === 14,
      photos: [],
      notes: i === 0 ? 'Ryby vypadají zdravě, rostliny rostou dobře.' : '',
    });
  }

  // Create events
  const newEvents = [
    { id: generateId(), title: 'Výměna vody', type: 'waterChange' as const, aquariumId: aquarium1Id, date: daysAgo(-1), completed: false, recurring: 'weekly' as const, userId },
    { id: generateId(), title: 'Čištění filtru', type: 'maintenance' as const, aquariumId: aquarium1Id, date: daysAgo(-7), completed: false, recurring: 'monthly' as const, userId },
    { id: generateId(), title: 'Test vody', type: 'maintenance' as const, aquariumId: aquarium1Id, date: daysAgo(-3), completed: false, recurring: 'weekly' as const, userId },
    { id: generateId(), title: 'Krmení kreveťek', type: 'feeding' as const, aquariumId: aquarium2Id, date: daysAgo(-2), completed: false, recurring: 'daily' as const, userId },
  ];

  // Create diary notes
  const newDiaryNotes = [
    { id: generateId(), date: daysAgo(7), content: 'Přidány 3 nové korydory. Adaptace proběhla bez problémů.', aquariumId: aquarium1Id, userId },
    { id: generateId(), date: daysAgo(14), content: 'Zastřihnuty rostliny - Vallisnerie se rozrostly na celou zadní stěnu.', aquariumId: aquarium1Id, userId },
    { id: generateId(), date: daysAgo(3), content: 'Betta vytváří bublinové hnízdo - dobrý znak zdraví.', aquariumId: aquarium2Id, userId },
  ];

  // Merge with existing data
  const updatedData: AppData = {
    ...currentData,
    aquariums: [...currentData.aquariums, ...newAquariums],
    fish: [...currentData.fish, ...newFish],
    plants: [...currentData.plants, ...newPlants],
    fertilizers: [...currentData.fertilizers, ...newFertilizers],
    equipment: [...currentData.equipment, ...newEquipment],
    waterParameters: [...currentData.waterParameters, ...newWaterParams],
    journalEntries: [...currentData.journalEntries, ...newJournalEntries],
    events: [...currentData.events, ...newEvents],
    diaryNotes: [...currentData.diaryNotes, ...newDiaryNotes],
  };

  saveData(updatedData);
};

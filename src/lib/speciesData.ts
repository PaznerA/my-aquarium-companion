// Scientific species database for fish and plants
// This provides detailed information about species for the Lexicon feature

import type { 
  SpeciesType, 
  Temperament, 
  Diet, 
  Difficulty, 
  GrowthRate, 
  PlantPlacement, 
  SpeciesSource,
  SpeciesWaterRequirements 
} from '@/types';

// Multi-name support for species - allows multiple common names per language
export interface SpeciesNames {
  en: string[];  // All English common names
  cs: string[];  // All Czech common names
}

export interface SpeciesInfo {
  id: string;
  scientificName: string;
  // Legacy single-name format (for backwards compatibility)
  commonNames: {
    en: string;
    cs: string;
  };
  // New multi-name format (optional, takes precedence when present)
  allNames?: SpeciesNames;
  type: SpeciesType;
  family: string;
  origin: string;
  // Source tracking for user-defined species
  source?: SpeciesSource;
  userId?: string;
  // Fish specific
  temperament?: Temperament;
  minTankSize?: number; // liters
  maxSize?: number; // cm
  lifespan?: string;
  diet?: Diet;
  schooling?: boolean;
  minSchoolSize?: number;
  // Plant specific
  difficulty?: Difficulty;
  growthRate?: GrowthRate;
  lightRequirement?: 'low' | 'medium' | 'high';
  co2Required?: boolean;
  propagation?: string;
  placement?: PlantPlacement;
  // Common
  waterParams: SpeciesWaterRequirements;
  description: {
    en: string;
    cs: string;
  };
  careNotes: {
    en: string[];
    cs: string[];
  };
  compatibility?: string[];
  imageUrl?: string;
}

export interface SpeciesNote {
  id: string;
  speciesId: string;
  content: string;
  createdAt: string;
  userId: string;
}

export interface SpeciesFavorite {
  speciesId: string;
  userId: string;
}

// Built-in species database - comprehensive collection of popular aquarium species
export const builtinSpeciesDatabase: SpeciesInfo[] = [
  // ==================== FISH ====================
  
  // Betta
  {
    id: 'betta-splendens',
    scientificName: 'Betta splendens',
    commonNames: { en: 'Betta / Siamese Fighting Fish', cs: 'Bojovnice pestrá' },
    type: 'fish',
    family: 'Osphronemidae',
    origin: 'Southeast Asia (Thailand, Cambodia)',
    source: 'builtin',
    temperament: 'aggressive',
    minTankSize: 20,
    maxSize: 7,
    lifespan: '3-5 years',
    diet: 'carnivore',
    schooling: false,
    waterParams: { tempMin: 24, tempMax: 30, phMin: 6.0, phMax: 8.0, ghMin: 5, ghMax: 20 },
    description: {
      en: 'Beautiful labyrinth fish known for elaborate finnage and territorial behavior. Males cannot be kept together.',
      cs: 'Krásná labyrintová ryba známá pro nádherné ploutve a teritoriální chování. Samci nemohou být drženi společně.',
    },
    careNotes: {
      en: [
        'Requires warm, stable temperatures',
        'Provide hiding spots with plants or decorations',
        'Avoid strong currents - they prefer calm water',
        'Feed high-quality protein-based foods',
        'Males are aggressive to other males and similar-looking fish',
      ],
      cs: [
        'Vyžaduje teplou, stabilní teplotu',
        'Poskytněte úkryty s rostlinami nebo dekoracemi',
        'Vyhněte se silným proudům - preferují klidnou vodu',
        'Krmte kvalitní proteinovou stravou',
        'Samci jsou agresivní k jiným samcům a podobně vypadajícím rybám',
      ],
    },
    compatibility: ['Corydoras', 'Snails', 'Shrimp (with caution)', 'Peaceful bottom-dwellers'],
  },
  
  // Tetras
  {
    id: 'paracheirodon-innesi',
    scientificName: 'Paracheirodon innesi',
    commonNames: { en: 'Neon Tetra', cs: 'Neonka obecná' },
    type: 'fish',
    family: 'Characidae',
    origin: 'South America (Amazon Basin)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 40,
    maxSize: 4,
    lifespan: '5-8 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 20, tempMax: 26, phMin: 5.5, phMax: 7.5, ghMin: 2, ghMax: 10 },
    description: {
      en: 'Iconic schooling fish with brilliant blue and red coloration. One of the most popular aquarium fish in the world.',
      cs: 'Ikonická hejnová ryba s jasně modrou a červenou barvou. Jedna z nejoblíbenějších akvarijních ryb na světě.',
    },
    careNotes: {
      en: [
        'Keep in schools of 6 or more',
        'Prefers soft, acidic water',
        'Provide planted areas for security',
        'Sensitive to water quality changes',
        'Best kept with other peaceful small fish',
      ],
      cs: [
        'Držte v hejnech po 6 a více',
        'Preferuje měkkou, kyselou vodu',
        'Poskytněte osázené oblasti pro bezpečí',
        'Citlivé na změny kvality vody',
        'Nejlépe chovat s jinými pokojnými malými rybami',
      ],
    },
    compatibility: ['Other tetras', 'Rasboras', 'Corydoras', 'Dwarf cichlids', 'Shrimp'],
  },
  {
    id: 'paracheirodon-axelrodi',
    scientificName: 'Paracheirodon axelrodi',
    commonNames: { en: 'Cardinal Tetra', cs: 'Neonka červená' },
    type: 'fish',
    family: 'Characidae',
    origin: 'South America (Orinoco, Rio Negro)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 60,
    maxSize: 5,
    lifespan: '4-5 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 23, tempMax: 27, phMin: 4.5, phMax: 7.0, ghMin: 1, ghMax: 5 },
    description: {
      en: 'Similar to neon tetra but with red extending full body length. Prefers softer, more acidic water.',
      cs: 'Podobná neonka obecné, ale s červenou barvou táhnoucí se po celé délce těla. Preferuje měkčí, kyselejší vodu.',
    },
    careNotes: {
      en: ['Keep in schools of 6+', 'Requires soft, acidic water', 'Sensitive to water changes', 'Dim lighting preferred'],
      cs: ['Držte v hejnech 6+', 'Vyžaduje měkkou, kyselou vodu', 'Citlivé na změny vody', 'Preferuje tlumené osvětlení'],
    },
    compatibility: ['Other tetras', 'Corydoras', 'Dwarf cichlids', 'Pencilfish'],
  },
  {
    id: 'hyphessobrycon-pulchripinnis',
    scientificName: 'Hyphessobrycon pulchripinnis',
    commonNames: { en: 'Lemon Tetra', cs: 'Tetra citronová' },
    type: 'fish',
    family: 'Characidae',
    origin: 'South America (Brazil)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 60,
    maxSize: 5,
    lifespan: '5-8 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 23, tempMax: 28, phMin: 5.5, phMax: 7.5, ghMin: 3, ghMax: 12 },
    description: {
      en: 'Beautiful yellow tetra with translucent body and bright eye coloration.',
      cs: 'Krásná žlutá tetra s průsvitným tělem a jasným zbarvením očí.',
    },
    careNotes: {
      en: ['School of 6+', 'Hardy and adaptable', 'Colors intensify with good diet', 'Great community fish'],
      cs: ['Hejno 6+', 'Odolná a přizpůsobivá', 'Barvy zintenzivní při dobré stravě', 'Skvělá společenská ryba'],
    },
    compatibility: ['Other tetras', 'Rasboras', 'Corydoras', 'Peaceful fish'],
  },
  {
    id: 'hemigrammus-bleheri',
    scientificName: 'Hemigrammus bleheri',
    commonNames: { en: 'Rummy Nose Tetra', cs: 'Tetra nosatá' },
    type: 'fish',
    family: 'Characidae',
    origin: 'South America (Amazon Basin)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 80,
    maxSize: 5,
    lifespan: '5-6 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 8,
    waterParams: { tempMin: 24, tempMax: 28, phMin: 5.5, phMax: 7.0, ghMin: 2, ghMax: 8 },
    description: {
      en: 'Distinctive red nose and striped tail. Known for tight schooling behavior.',
      cs: 'Charakteristický červený nos a pruhovaný ocas. Známá pro těsné hejnové chování.',
    },
    careNotes: {
      en: ['Excellent water quality indicator', 'Schools very tightly', 'Sensitive to poor water', 'Keep 8+ for best display'],
      cs: ['Výborný indikátor kvality vody', 'Velmi těsné hejno', 'Citlivé na špatnou vodu', 'Držte 8+ pro nejlepší efekt'],
    },
    compatibility: ['Other tetras', 'Discus', 'Angelfish', 'Corydoras'],
  },
  {
    id: 'hyphessobrycon-herbertaxelrodi',
    scientificName: 'Hyphessobrycon herbertaxelrodi',
    commonNames: { en: 'Black Neon Tetra', cs: 'Tetra černá' },
    type: 'fish',
    family: 'Characidae',
    origin: 'South America (Paraguay)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 60,
    maxSize: 4,
    lifespan: '5 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 23, tempMax: 27, phMin: 5.5, phMax: 7.5, ghMin: 4, ghMax: 12 },
    description: {
      en: 'Hardy tetra with distinctive black and white/green horizontal stripe.',
      cs: 'Odolná tetra s výrazným černým a bílo-zeleným horizontálním pruhem.',
    },
    careNotes: {
      en: ['Very hardy species', 'Good for beginners', 'Keep in schools', 'Adaptable to various conditions'],
      cs: ['Velmi odolný druh', 'Dobrý pro začátečníky', 'Držte v hejnech', 'Přizpůsobivá různým podmínkám'],
    },
    compatibility: ['Most peaceful community fish', 'Corydoras', 'Dwarf cichlids'],
  },
  {
    id: 'gymnocorymbus-ternetzi',
    scientificName: 'Gymnocorymbus ternetzi',
    commonNames: { en: 'Black Skirt Tetra', cs: 'Tetra černá sukně' },
    type: 'fish',
    family: 'Characidae',
    origin: 'South America (Paraguay, Argentina)',
    source: 'builtin',
    temperament: 'semi-aggressive',
    minTankSize: 80,
    maxSize: 6,
    lifespan: '5-6 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 5,
    waterParams: { tempMin: 20, tempMax: 26, phMin: 6.0, phMax: 8.0, ghMin: 5, ghMax: 20 },
    description: {
      en: 'Active tetra with flowing fins. Can be nippy to long-finned fish.',
      cs: 'Aktivní tetra s vlajícími ploutvemi. Může okusovat dlouhé ploutve jiných ryb.',
    },
    careNotes: {
      en: ['May nip fins', 'Keep in groups to reduce aggression', 'Hardy and adaptable', 'Avoid with slow/long-finned fish'],
      cs: ['Může okusovat ploutve', 'Držte ve skupinách pro snížení agrese', 'Odolná a přizpůsobivá', 'Vyhněte se pomalým/dlouhoploutvým rybám'],
    },
    compatibility: ['Other active tetras', 'Barbs', 'Larger danios'],
  },
  {
    id: 'inpaichthys-kerri',
    scientificName: 'Inpaichthys kerri',
    commonNames: { en: 'Blue Emperor Tetra', cs: 'Tetra císařská' },
    type: 'fish',
    family: 'Characidae',
    origin: 'South America (Brazil)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 60,
    maxSize: 5,
    lifespan: '3-5 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 24, tempMax: 28, phMin: 5.5, phMax: 7.0, ghMin: 2, ghMax: 10 },
    description: {
      en: 'Stunning purple-blue tetra, males are more colorful than females.',
      cs: 'Ohromující fialově-modrá tetra, samci jsou barevnější než samice.',
    },
    careNotes: {
      en: ['Males more colorful', 'Peaceful community fish', 'Prefers soft water', 'Dense planting appreciated'],
      cs: ['Samci barevnější', 'Klidná společenská ryba', 'Preferuje měkkou vodu', 'Oceňuje husté osázení'],
    },
    compatibility: ['Other tetras', 'Small peaceful fish', 'Shrimp'],
  },

  // Corydoras
  {
    id: 'corydoras-paleatus',
    scientificName: 'Corydoras paleatus',
    commonNames: { en: 'Peppered Corydoras', cs: 'Krunýřovec pepřový' },
    type: 'fish',
    family: 'Callichthyidae',
    origin: 'South America (Argentina, Brazil)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 60,
    maxSize: 7,
    lifespan: '5-10 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 18, tempMax: 26, phMin: 6.0, phMax: 8.0, ghMin: 5, ghMax: 20 },
    description: {
      en: 'Hardy bottom-dwelling catfish that helps keep the substrate clean. Very social and active.',
      cs: 'Odolný sumec žijící u dna, který pomáhá udržovat substrát čistý. Velmi společenský a aktivní.',
    },
    careNotes: {
      en: ['Requires sand or fine gravel substrate', 'Keep in groups of 6+', 'Provide sinking foods', 'Nocturnal but can be active during day', 'Hardy and great for beginners'],
      cs: ['Vyžaduje písek nebo jemný štěrk', 'Držte ve skupinách 6+', 'Poskytněte potápějící se krmivo', 'Noční, ale může být aktivní i ve dne', 'Odolné a skvělé pro začátečníky'],
    },
    compatibility: ['Most community fish', 'Other Corydoras', 'Tetras', 'Rasboras', 'Livebearers'],
  },
  {
    id: 'corydoras-aeneus',
    scientificName: 'Corydoras aeneus',
    commonNames: { en: 'Bronze Corydoras', cs: 'Krunýřovec bronzový' },
    type: 'fish',
    family: 'Callichthyidae',
    origin: 'South America (widespread)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 60,
    maxSize: 7,
    lifespan: '10+ years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 22, tempMax: 28, phMin: 6.0, phMax: 8.0, ghMin: 5, ghMax: 20 },
    description: {
      en: 'One of the most popular and hardy Corydoras species. Bronze/gold coloration.',
      cs: 'Jeden z nejpopulárnějších a nejodolnějších druhů Corydoras. Bronzové/zlaté zbarvení.',
    },
    careNotes: {
      en: ['Very hardy', 'Albino variety also available', 'Keep in groups', 'Sand substrate preferred'],
      cs: ['Velmi odolný', 'K dispozici i albín varianta', 'Držte ve skupinách', 'Preferován písečný substrát'],
    },
    compatibility: ['All peaceful community fish', 'Other Corydoras'],
  },
  {
    id: 'corydoras-sterbai',
    scientificName: 'Corydoras sterbai',
    commonNames: { en: 'Sterbai Corydoras', cs: 'Krunýřovec Sterbův' },
    type: 'fish',
    family: 'Callichthyidae',
    origin: 'South America (Brazil, Bolivia)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 80,
    maxSize: 8,
    lifespan: '10-15 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 24, tempMax: 28, phMin: 6.0, phMax: 7.5, ghMin: 2, ghMax: 15 },
    description: {
      en: 'Beautiful spotted pattern with orange pectoral fins. Tolerates warmer water, good for discus tanks.',
      cs: 'Krásný tečkovaný vzor s oranžovými prsními ploutvemi. Snáší teplejší vodu, vhodný pro diskusové nádrže.',
    },
    careNotes: {
      en: ['Tolerates higher temps', 'Great with discus', 'More expensive but worth it', 'Very attractive pattern'],
      cs: ['Snáší vyšší teploty', 'Skvělý s diskusy', 'Dražší ale stojí za to', 'Velmi atraktivní vzor'],
    },
    compatibility: ['Discus', 'Angelfish', 'Other warm-water fish'],
  },
  {
    id: 'corydoras-panda',
    scientificName: 'Corydoras panda',
    commonNames: { en: 'Panda Corydoras', cs: 'Krunýřovec panda' },
    type: 'fish',
    family: 'Callichthyidae',
    origin: 'South America (Peru)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 60,
    maxSize: 5,
    lifespan: '10 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 20, tempMax: 25, phMin: 6.0, phMax: 7.5, ghMin: 2, ghMax: 12 },
    description: {
      en: 'Adorable black and white markings resembling a panda. Prefers cooler water.',
      cs: 'Roztomilé černobílé zbarvení připomínající pandu. Preferuje chladnější vodu.',
    },
    careNotes: {
      en: ['Prefers cooler temps', 'Smaller than most Corydoras', 'Adorable appearance', 'More sensitive than others'],
      cs: ['Preferuje nižší teploty', 'Menší než většina Corydoras', 'Roztomilý vzhled', 'Citlivější než ostatní'],
    },
    compatibility: ['Cold-water community fish', 'Other small Corydoras'],
  },
  {
    id: 'corydoras-pygmaeus',
    scientificName: 'Corydoras pygmaeus',
    commonNames: { en: 'Pygmy Corydoras', cs: 'Krunýřovec pygmejský' },
    type: 'fish',
    family: 'Callichthyidae',
    origin: 'South America (Brazil)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 40,
    maxSize: 2.5,
    lifespan: '3-4 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 10,
    waterParams: { tempMin: 22, tempMax: 26, phMin: 6.0, phMax: 7.5, ghMin: 2, ghMax: 15 },
    description: {
      en: 'Tiny Corydoras that swims in midwater as well as bottom. Perfect for nano tanks.',
      cs: 'Drobný Corydoras, který plave ve středu i u dna. Perfektní pro nano akvária.',
    },
    careNotes: {
      en: ['Keep in large groups (10+)', 'Swims midwater unlike most Corydoras', 'Great for nano tanks', 'Tiny size - watch tankmates'],
      cs: ['Držte ve velkých skupinách (10+)', 'Plave ve středu na rozdíl od většiny Corydoras', 'Skvělý pro nano akvária', 'Drobná velikost - sledujte spolubydlící'],
    },
    compatibility: ['Small nano fish', 'Shrimp', 'Other tiny species'],
  },

  // Livebearers
  {
    id: 'poecilia-reticulata',
    scientificName: 'Poecilia reticulata',
    commonNames: { en: 'Guppy', cs: 'Živorodka duhová' },
    type: 'fish',
    family: 'Poeciliidae',
    origin: 'South America (Venezuela, Caribbean)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 30,
    maxSize: 5,
    lifespan: '2-3 years',
    diet: 'omnivore',
    schooling: false,
    waterParams: { tempMin: 22, tempMax: 28, phMin: 7.0, phMax: 8.5, ghMin: 10, ghMax: 30 },
    description: {
      en: 'Colorful and hardy livebearer, excellent for beginners. Males are more colorful than females.',
      cs: 'Barevná a odolná živorodka, vynikající pro začátečníky. Samci jsou barevnější než samice.',
    },
    careNotes: {
      en: ['Very easy to breed', 'Keep more females than males (2:1 ratio)', 'Prefers harder, alkaline water', 'Hardy and tolerates wide range of conditions', 'Prolific breeders - population control may be needed'],
      cs: ['Velmi snadno se množí', 'Držte více samic než samců (poměr 2:1)', 'Preferuje tvrdší, alkalickou vodu', 'Odolné a snáší širokou škálu podmínek', 'Plodné - může být nutná kontrola populace'],
    },
    compatibility: ['Other peaceful livebearers', 'Corydoras', 'Small tetras', 'Shrimp'],
  },
  {
    id: 'poecilia-sphenops',
    scientificName: 'Poecilia sphenops',
    commonNames: { en: 'Molly', cs: 'Živorodka ostrorypá' },
    type: 'fish',
    family: 'Poeciliidae',
    origin: 'Central America, Mexico',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 60,
    maxSize: 10,
    lifespan: '3-5 years',
    diet: 'omnivore',
    schooling: false,
    waterParams: { tempMin: 22, tempMax: 28, phMin: 7.5, phMax: 8.5, ghMin: 15, ghMax: 30 },
    description: {
      en: 'Hardy livebearer available in many color varieties. Can tolerate brackish water.',
      cs: 'Odolná živorodka dostupná v mnoha barevných variantách. Snáší brakickou vodu.',
    },
    careNotes: {
      en: ['Prefers hard, alkaline water', 'Can add salt to water', 'Algae grazer', 'Many color varieties'],
      cs: ['Preferuje tvrdou, alkalickou vodu', 'Lze přidat sůl do vody', 'Spásač řas', 'Mnoho barevných variant'],
    },
    compatibility: ['Other livebearers', 'Peaceful community fish'],
  },
  {
    id: 'xiphophorus-hellerii',
    scientificName: 'Xiphophorus hellerii',
    commonNames: { en: 'Swordtail', cs: 'Mečovka živorodá' },
    type: 'fish',
    family: 'Poeciliidae',
    origin: 'Central America (Mexico, Guatemala)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 80,
    maxSize: 12,
    lifespan: '3-5 years',
    diet: 'omnivore',
    schooling: false,
    waterParams: { tempMin: 21, tempMax: 28, phMin: 7.0, phMax: 8.5, ghMin: 12, ghMax: 30 },
    description: {
      en: 'Active livebearer with males sporting distinctive sword-shaped tail extension.',
      cs: 'Aktivní živorodka, samci mají charakteristický mečovitý výběžek ocasu.',
    },
    careNotes: {
      en: ['Males may fight', 'Active swimmers need space', 'Easy to breed', 'Multiple females per male'],
      cs: ['Samci se mohou prát', 'Aktivní plavci potřebují prostor', 'Snadno se množí', 'Více samic na samce'],
    },
    compatibility: ['Other livebearers', 'Barbs', 'Larger tetras'],
  },
  {
    id: 'xiphophorus-maculatus',
    scientificName: 'Xiphophorus maculatus',
    commonNames: { en: 'Platy', cs: 'Živorodka skvrnotolampa' },
    type: 'fish',
    family: 'Poeciliidae',
    origin: 'Central America (Mexico)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 40,
    maxSize: 6,
    lifespan: '3-5 years',
    diet: 'omnivore',
    schooling: false,
    waterParams: { tempMin: 20, tempMax: 26, phMin: 7.0, phMax: 8.2, ghMin: 10, ghMax: 25 },
    description: {
      en: 'Hardy and colorful livebearer, perfect for beginners. Many color varieties available.',
      cs: 'Odolná a barevná živorodka, ideální pro začátečníky. Dostupné mnoho barevných variant.',
    },
    careNotes: {
      en: ['Very hardy', 'Many color varieties', 'Easy to breed', 'Great for beginners'],
      cs: ['Velmi odolná', 'Mnoho barevných variant', 'Snadno se množí', 'Skvělá pro začátečníky'],
    },
    compatibility: ['All peaceful community fish'],
  },
  {
    id: 'poecilia-wingei',
    scientificName: 'Poecilia wingei',
    commonNames: { en: 'Endler\'s Livebearer', cs: 'Endlerka' },
    type: 'fish',
    family: 'Poeciliidae',
    origin: 'Venezuela',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 20,
    maxSize: 3,
    lifespan: '2-3 years',
    diet: 'omnivore',
    schooling: false,
    waterParams: { tempMin: 24, tempMax: 30, phMin: 7.0, phMax: 8.5, ghMin: 10, ghMax: 30 },
    description: {
      en: 'Tiny colorful livebearer, closely related to guppies. Males are incredibly colorful.',
      cs: 'Drobná barevná živorodka, blízce příbuzná gupkám. Samci jsou neuvěřitelně barvití.',
    },
    careNotes: {
      en: ['Perfect for nano tanks', 'Males very colorful', 'Can hybridize with guppies', 'Hardy and prolific'],
      cs: ['Perfektní pro nano akvária', 'Samci velmi barvití', 'Může se křížit s gupkami', 'Odolné a plodné'],
    },
    compatibility: ['Other tiny fish', 'Shrimp', 'Snails'],
  },

  // Rasboras
  {
    id: 'trigonostigma-heteromorpha',
    scientificName: 'Trigonostigma heteromorpha',
    commonNames: { en: 'Harlequin Rasbora', cs: 'Klínovka trojskvrnná' },
    type: 'fish',
    family: 'Cyprinidae',
    origin: 'Southeast Asia (Malaysia, Thailand)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 60,
    maxSize: 5,
    lifespan: '5-8 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 22, tempMax: 28, phMin: 5.0, phMax: 7.5, ghMin: 2, ghMax: 12 },
    description: {
      en: 'Classic schooling fish with distinctive black triangular patch. Very peaceful.',
      cs: 'Klasická hejnová ryba s charakteristickou černou trojúhelníkovou skvrnou. Velmi mírumilovná.',
    },
    careNotes: {
      en: ['Keep in schools of 6+', 'Soft water preferred', 'Peaceful and hardy', 'Great with plants'],
      cs: ['Držte v hejnech 6+', 'Preferuje měkkou vodu', 'Mírumilovná a odolná', 'Skvělá s rostlinami'],
    },
    compatibility: ['Tetras', 'Corydoras', 'Small peaceful fish'],
  },
  {
    id: 'boraras-brigittae',
    scientificName: 'Boraras brigittae',
    commonNames: { en: 'Chili Rasbora', cs: 'Rasbora chilli' },
    type: 'fish',
    family: 'Cyprinidae',
    origin: 'Southeast Asia (Borneo)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 20,
    maxSize: 2,
    lifespan: '4-8 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 10,
    waterParams: { tempMin: 20, tempMax: 28, phMin: 4.0, phMax: 7.0, ghMin: 1, ghMax: 10 },
    description: {
      en: 'Tiny ruby-red nano fish. One of the smallest aquarium fish available.',
      cs: 'Drobná rubínově červená nano ryba. Jedna z nejmenších dostupných akvarijních ryb.',
    },
    careNotes: {
      en: ['Perfect for nano tanks', 'Keep in large groups', 'Very small - watch tankmates', 'Soft acidic water preferred'],
      cs: ['Perfektní pro nano akvária', 'Držte ve velkých skupinách', 'Velmi malá - sledujte spolubydlící', 'Preferuje měkkou kyselou vodu'],
    },
    compatibility: ['Other nano fish', 'Shrimp', 'Small snails'],
  },
  {
    id: 'danio-margaritatus',
    scientificName: 'Danio margaritatus',
    commonNames: { en: 'Celestial Pearl Danio', cs: 'Danio perlové' },
    type: 'fish',
    family: 'Cyprinidae',
    origin: 'Southeast Asia (Myanmar)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 40,
    maxSize: 2.5,
    lifespan: '3-5 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 20, tempMax: 25, phMin: 6.5, phMax: 7.5, ghMin: 2, ghMax: 10 },
    description: {
      en: 'Stunning galaxy-like spots pattern. Males have red-orange fins.',
      cs: 'Ohromující vzor připomínající galaxii. Samci mají červeno-oranžové ploutve.',
    },
    careNotes: {
      en: ['Prefers cooler water', 'Dense planting recommended', 'Males display to each other', 'Shy - provide hiding spots'],
      cs: ['Preferuje chladnější vodu', 'Doporučeno husté osázení', 'Samci se předvádějí', 'Plachá - poskytněte úkryty'],
    },
    compatibility: ['Other nano fish', 'Shrimp', 'Peaceful species'],
  },

  // Barbs
  {
    id: 'puntigrus-tetrazona',
    scientificName: 'Puntigrus tetrazona',
    commonNames: { en: 'Tiger Barb', cs: 'Parmička pruhovaná' },
    type: 'fish',
    family: 'Cyprinidae',
    origin: 'Southeast Asia (Indonesia)',
    source: 'builtin',
    temperament: 'semi-aggressive',
    minTankSize: 80,
    maxSize: 7,
    lifespan: '5-7 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 20, tempMax: 26, phMin: 6.0, phMax: 8.0, ghMin: 4, ghMax: 15 },
    description: {
      en: 'Active striped barb known for fin-nipping. Keep in large groups to reduce aggression.',
      cs: 'Aktivní pruhovaná parmička známá okusováním ploutví. Držte ve velkých skupinách pro snížení agrese.',
    },
    careNotes: {
      en: ['Keep 6+ to reduce nipping', 'Avoid slow/long-finned fish', 'Active swimmers', 'Hardy species'],
      cs: ['Držte 6+ pro snížení okusování', 'Vyhněte se pomalým/dlouhoploutvým rybám', 'Aktivní plavci', 'Odolný druh'],
    },
    compatibility: ['Other barbs', 'Active fish', 'Robust species'],
  },
  {
    id: 'pethia-conchonius',
    scientificName: 'Pethia conchonius',
    commonNames: { en: 'Rosy Barb', cs: 'Parmička červená' },
    type: 'fish',
    family: 'Cyprinidae',
    origin: 'South Asia (India, Bangladesh)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 80,
    maxSize: 10,
    lifespan: '5 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 5,
    waterParams: { tempMin: 18, tempMax: 25, phMin: 6.0, phMax: 8.0, ghMin: 5, ghMax: 20 },
    description: {
      en: 'Beautiful golden/pink barb. Males develop intense coloration during breeding.',
      cs: 'Krásná zlatá/růžová parmička. Samci vyvinou intenzivní zbarvení během rozmnožování.',
    },
    careNotes: {
      en: ['Tolerates cooler water', 'Hardy species', 'Active schooler', 'Males very colorful'],
      cs: ['Snáší chladnější vodu', 'Odolný druh', 'Aktivní hejnová ryba', 'Samci velmi barvití'],
    },
    compatibility: ['Other barbs', 'Danios', 'Larger tetras'],
  },
  {
    id: 'puntius-titteya',
    scientificName: 'Puntius titteya',
    commonNames: { en: 'Cherry Barb', cs: 'Parmička třešňová' },
    type: 'fish',
    family: 'Cyprinidae',
    origin: 'Sri Lanka',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 60,
    maxSize: 5,
    lifespan: '5-7 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 23, tempMax: 27, phMin: 6.0, phMax: 7.5, ghMin: 4, ghMax: 15 },
    description: {
      en: 'Peaceful barb with males displaying bright cherry red coloration.',
      cs: 'Klidná parmička se samci vykazujícími jasně třešňově červené zbarvení.',
    },
    careNotes: {
      en: ['One of the most peaceful barbs', 'Males compete for color', 'Does not nip fins', 'Great community fish'],
      cs: ['Jedna z nejmírumilovnějších parmiček', 'Samci soutěží v barvě', 'Neokusuje ploutve', 'Skvělá společenská ryba'],
    },
    compatibility: ['Most peaceful community fish', 'Tetras', 'Rasboras'],
  },

  // Gouramis
  {
    id: 'trichogaster-lalius',
    scientificName: 'Trichogaster lalius',
    commonNames: { en: 'Dwarf Gourami', cs: 'Gurama Lalius' },
    type: 'fish',
    family: 'Osphronemidae',
    origin: 'South Asia (India, Pakistan)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 40,
    maxSize: 9,
    lifespan: '4-6 years',
    diet: 'omnivore',
    schooling: false,
    waterParams: { tempMin: 22, tempMax: 28, phMin: 6.0, phMax: 7.5, ghMin: 4, ghMax: 15 },
    description: {
      en: 'Beautiful colorful gourami with labyrinth organ for breathing air. Males more colorful.',
      cs: 'Krásná barevná gurama s labyrintovým orgánem pro dýchání vzduchu. Samci barevnější.',
    },
    careNotes: {
      en: ['Labyrinth fish - needs surface access', 'Males can be territorial', 'Prone to disease if stressed', 'Gentle filtration'],
      cs: ['Labyrintová ryba - potřebuje přístup k hladině', 'Samci mohou být teritoriální', 'Náchylné k nemocem při stresu', 'Jemná filtrace'],
    },
    compatibility: ['Peaceful community fish', 'Tetras', 'Corydoras'],
  },
  {
    id: 'trichopodus-trichopterus',
    scientificName: 'Trichopodus trichopterus',
    commonNames: { en: 'Three Spot Gourami', cs: 'Gurama mramovaná' },
    type: 'fish',
    family: 'Osphronemidae',
    origin: 'Southeast Asia',
    source: 'builtin',
    temperament: 'semi-aggressive',
    minTankSize: 100,
    maxSize: 15,
    lifespan: '4-6 years',
    diet: 'omnivore',
    schooling: false,
    waterParams: { tempMin: 24, tempMax: 28, phMin: 6.0, phMax: 8.0, ghMin: 5, ghMax: 20 },
    description: {
      en: 'Hardy gourami available in several color forms (blue, gold, opaline). Can be territorial.',
      cs: 'Odolná gurama dostupná v několika barevných formách (modrá, zlatá, opalínová). Může být teritoriální.',
    },
    careNotes: {
      en: ['Hardy species', 'Males can be aggressive', 'Needs space', 'Surface access required'],
      cs: ['Odolný druh', 'Samci mohou být agresivní', 'Potřebuje prostor', 'Vyžaduje přístup k hladině'],
    },
    compatibility: ['Larger community fish', 'Barbs', 'Larger tetras'],
  },
  {
    id: 'trichopodus-leerii',
    scientificName: 'Trichopodus leerii',
    commonNames: { en: 'Pearl Gourami', cs: 'Gurama perlová' },
    type: 'fish',
    family: 'Osphronemidae',
    origin: 'Southeast Asia (Malaysia, Thailand)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 100,
    maxSize: 12,
    lifespan: '5-8 years',
    diet: 'omnivore',
    schooling: false,
    waterParams: { tempMin: 24, tempMax: 28, phMin: 6.0, phMax: 7.5, ghMin: 5, ghMax: 15 },
    description: {
      en: 'Elegant gourami covered in pearl-like spots. One of the most peaceful gouramis.',
      cs: 'Elegantní gurama pokrytá perlovitými skvrnami. Jedna z nejmírumilovnějších guramů.',
    },
    careNotes: {
      en: ['Very peaceful for a gourami', 'Beautiful pearl pattern', 'Males have orange breast when breeding', 'Dense planting appreciated'],
      cs: ['Velmi klidná jako gurama', 'Krásný perlový vzor', 'Samci mají oranžovou hruď při rozmnožování', 'Oceňuje husté osázení'],
    },
    compatibility: ['Most peaceful community fish', 'Tetras', 'Rasboras'],
  },
  {
    id: 'trichopsis-pumila',
    scientificName: 'Trichopsis pumila',
    commonNames: { en: 'Sparkling Gourami', cs: 'Gurama jiskřivá' },
    type: 'fish',
    family: 'Osphronemidae',
    origin: 'Southeast Asia',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 20,
    maxSize: 4,
    lifespan: '4-5 years',
    diet: 'omnivore',
    schooling: false,
    waterParams: { tempMin: 23, tempMax: 28, phMin: 6.0, phMax: 7.5, ghMin: 4, ghMax: 12 },
    description: {
      en: 'Tiny gourami that makes audible "croaking" sounds. Beautiful iridescent scales.',
      cs: 'Drobná gurama vydávající slyšitelné "kvákání". Krásné irizující šupiny.',
    },
    careNotes: {
      en: ['Makes croaking sounds', 'Perfect for nano tanks', 'Very peaceful', 'Needs floating plants'],
      cs: ['Vydává zvuky kvákání', 'Perfektní pro nano akvária', 'Velmi mírumilovná', 'Potřebuje plovoucí rostliny'],
    },
    compatibility: ['Nano fish', 'Shrimp', 'Peaceful species'],
  },

  // Cichlids
  {
    id: 'mikrogeophagus-ramirezi',
    scientificName: 'Mikrogeophagus ramirezi',
    commonNames: { en: 'German Blue Ram', cs: 'Tlamovec Ramirezův' },
    type: 'fish',
    family: 'Cichlidae',
    origin: 'South America (Venezuela, Colombia)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 60,
    maxSize: 7,
    lifespan: '2-4 years',
    diet: 'omnivore',
    schooling: false,
    waterParams: { tempMin: 26, tempMax: 30, phMin: 5.0, phMax: 7.0, ghMin: 1, ghMax: 8 },
    description: {
      en: 'Stunning dwarf cichlid with bright blue coloration. Sensitive to water quality.',
      cs: 'Ohromující trpasličí cichlida s jasně modrým zbarvením. Citlivá na kvalitu vody.',
    },
    careNotes: {
      en: ['Needs warm water', 'Soft acidic water essential', 'Sensitive to stress', 'Stunning coloration'],
      cs: ['Potřebuje teplou vodu', 'Měkká kyselá voda je nezbytná', 'Citlivý na stres', 'Ohromující zbarvení'],
    },
    compatibility: ['Tetras', 'Corydoras', 'Peaceful community fish'],
  },
  {
    id: 'apistogramma-cacatuoides',
    scientificName: 'Apistogramma cacatuoides',
    commonNames: { en: 'Cockatoo Dwarf Cichlid', cs: 'Tlamovec kakaduí' },
    type: 'fish',
    family: 'Cichlidae',
    origin: 'South America (Amazon)',
    source: 'builtin',
    temperament: 'semi-aggressive',
    minTankSize: 60,
    maxSize: 8,
    lifespan: '3-5 years',
    diet: 'omnivore',
    schooling: false,
    waterParams: { tempMin: 23, tempMax: 28, phMin: 5.5, phMax: 7.5, ghMin: 2, ghMax: 12 },
    description: {
      en: 'Hardy dwarf cichlid with cockatoo-like dorsal fin. Males very colorful.',
      cs: 'Odolná trpasličí cichlida s hřbetní ploutví podobnou kakadu. Samci velmi barvití.',
    },
    careNotes: {
      en: ['One of hardiest Apistogramma', 'Males territorial when breeding', 'Caves needed for breeding', 'Colorful dorsal fin'],
      cs: ['Jeden z nejodolnějších Apistogramma', 'Samci teritoriální při rozmnožování', 'Jeskyně potřebné pro rozmnožování', 'Barevná hřbetní ploutev'],
    },
    compatibility: ['Tetras', 'Corydoras', 'Upper dwelling fish'],
  },
  {
    id: 'pterophyllum-scalare',
    scientificName: 'Pterophyllum scalare',
    commonNames: { en: 'Angelfish', cs: 'Skalára' },
    type: 'fish',
    family: 'Cichlidae',
    origin: 'South America (Amazon Basin)',
    source: 'builtin',
    temperament: 'semi-aggressive',
    minTankSize: 150,
    maxSize: 15,
    lifespan: '10-15 years',
    diet: 'omnivore',
    schooling: false,
    waterParams: { tempMin: 24, tempMax: 30, phMin: 6.0, phMax: 7.5, ghMin: 3, ghMax: 12 },
    description: {
      en: 'Elegant tall-bodied cichlid. Can eat small fish like neon tetras when adult.',
      cs: 'Elegantní vysoko-tělesná cichlida. Dospělí jedinci mohou sežrat malé ryby jako neonky.',
    },
    careNotes: {
      en: ['Tall tank needed', 'Will eat small fish', 'Can be aggressive when breeding', 'Pairs form bonds'],
      cs: ['Potřebuje vysoké akvárium', 'Sežere malé ryby', 'Může být agresivní při rozmnožování', 'Páry tvoří pouta'],
    },
    compatibility: ['Larger tetras', 'Corydoras', 'Other angelfish'],
  },
  {
    id: 'symphysodon-aequifasciatus',
    scientificName: 'Symphysodon aequifasciatus',
    commonNames: { en: 'Discus', cs: 'Diskus' },
    type: 'fish',
    family: 'Cichlidae',
    origin: 'South America (Amazon Basin)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 250,
    maxSize: 20,
    lifespan: '10-15 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 5,
    waterParams: { tempMin: 28, tempMax: 32, phMin: 5.0, phMax: 7.0, ghMin: 1, ghMax: 5 },
    description: {
      en: 'The king of freshwater aquarium fish. Requires pristine water conditions and expert care.',
      cs: 'Král sladkovodních akvarijních ryb. Vyžaduje dokonalé vodní podmínky a odbornou péči.',
    },
    careNotes: {
      en: ['High maintenance', 'Warm soft water essential', 'Keep in groups', 'Daily water changes recommended', 'Sensitive to stress'],
      cs: ['Vysoká údržba', 'Teplá měkká voda nezbytná', 'Držte ve skupinách', 'Doporučena denní výměna vody', 'Citlivý na stres'],
    },
    compatibility: ['Cardinal tetras', 'Sterbai corydoras', 'Other discus'],
  },

  // Loaches
  {
    id: 'chromobotia-macracanthus',
    scientificName: 'Chromobotia macracanthus',
    commonNames: { en: 'Clown Loach', cs: 'Sekavec šaškový' },
    type: 'fish',
    family: 'Botiidae',
    origin: 'Southeast Asia (Indonesia)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 400,
    maxSize: 30,
    lifespan: '20+ years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 5,
    waterParams: { tempMin: 24, tempMax: 30, phMin: 6.0, phMax: 7.5, ghMin: 5, ghMax: 15 },
    description: {
      en: 'Popular large loach known for snail eating. Grows very large and lives long.',
      cs: 'Oblíbený velký sekavec známý pro pojídání šneků. Dorůstá velmi velký a žije dlouho.',
    },
    careNotes: {
      en: ['Gets very large', 'Long-lived - commitment required', 'Excellent snail control', 'Keep in groups'],
      cs: ['Dorůstá velmi velký', 'Dlouhověký - vyžaduje závazek', 'Výborná kontrola šneků', 'Držte ve skupinách'],
    },
    compatibility: ['Large peaceful fish', 'Other clown loaches'],
  },
  {
    id: 'pangio-kuhlii',
    scientificName: 'Pangio kuhlii',
    commonNames: { en: 'Kuhli Loach', cs: 'Sekavec pruhovaný' },
    type: 'fish',
    family: 'Cobitidae',
    origin: 'Southeast Asia',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 60,
    maxSize: 10,
    lifespan: '10 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 5,
    waterParams: { tempMin: 24, tempMax: 28, phMin: 5.5, phMax: 7.0, ghMin: 2, ghMax: 10 },
    description: {
      en: 'Eel-like nocturnal loach. Loves to hide in substrate and decorations.',
      cs: 'Úhořovitý noční sekavec. Miluje skrývání v substrátu a dekoracích.',
    },
    careNotes: {
      en: ['Nocturnal - rarely seen during day', 'Needs hiding spots', 'Soft sand substrate', 'Keep in groups'],
      cs: ['Noční - zřídka viděn ve dne', 'Potřebuje úkryty', 'Měkký písečný substrát', 'Držte ve skupinách'],
    },
    compatibility: ['Peaceful community fish', 'Other loaches'],
  },

  // Catfish
  {
    id: 'ancistrus-sp',
    scientificName: 'Ancistrus sp.',
    commonNames: { en: 'Bristlenose Pleco', cs: 'Krunýřovec mřížkovaný' },
    type: 'fish',
    family: 'Loricariidae',
    origin: 'South America',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 80,
    maxSize: 15,
    lifespan: '10-15 years',
    diet: 'herbivore',
    schooling: false,
    waterParams: { tempMin: 22, tempMax: 28, phMin: 6.0, phMax: 8.0, ghMin: 5, ghMax: 20 },
    description: {
      en: 'Excellent algae eater that stays relatively small. Males develop distinctive bristles.',
      cs: 'Výborný požírač řas, který zůstává relativně malý. Samci vyvinou charakteristické výrůstky.',
    },
    careNotes: {
      en: ['Excellent algae control', 'Needs driftwood', 'Provide vegetables', 'Males have bristles'],
      cs: ['Výborná kontrola řas', 'Potřebuje dřevo', 'Poskytněte zeleninu', 'Samci mají výrůstky'],
    },
    compatibility: ['Most community fish', 'Other peaceful fish'],
  },
  {
    id: 'otocinclus-vittatus',
    scientificName: 'Otocinclus vittatus',
    commonNames: { en: 'Otocinclus', cs: 'Otocinclus' },
    type: 'fish',
    family: 'Loricariidae',
    origin: 'South America',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 40,
    maxSize: 4,
    lifespan: '3-5 years',
    diet: 'herbivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 21, tempMax: 26, phMin: 6.0, phMax: 7.5, ghMin: 2, ghMax: 15 },
    description: {
      en: 'Tiny algae-eating catfish. Perfect for planted tanks. Keep in groups.',
      cs: 'Drobný sumec pojídající řasy. Perfektní pro osázená akvária. Držte ve skupinách.',
    },
    careNotes: {
      en: ['Keep in groups of 6+', 'Sensitive to water quality', 'May need supplemental algae wafers', 'Great plant-safe algae eater'],
      cs: ['Držte ve skupinách 6+', 'Citlivý na kvalitu vody', 'Může potřebovat doplňkové řasové tablety', 'Skvělý bezpečný požírač řas'],
    },
    compatibility: ['All peaceful fish', 'Shrimp', 'Planted tanks'],
  },

  // Shrimp
  {
    id: 'caridina-multidentata',
    scientificName: 'Caridina multidentata',
    commonNames: { en: 'Amano Shrimp', cs: 'Krevetka Amano' },
    type: 'fish',
    family: 'Atyidae',
    origin: 'Japan, Taiwan',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 20,
    maxSize: 5,
    lifespan: '2-3 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 3,
    waterParams: { tempMin: 20, tempMax: 28, phMin: 6.5, phMax: 8.0, ghMin: 6, ghMax: 15 },
    description: {
      en: 'Excellent algae eater, named after Takashi Amano. Great for planted tanks.',
      cs: 'Výborný požírač řas, pojmenovaný po Takashi Amanovi. Skvělé pro osázená akvária.',
    },
    careNotes: {
      en: ['Excellent algae control', 'Sensitive to copper', 'Needs established tank', 'Cannot breed in freshwater'],
      cs: ['Výborná kontrola řas', 'Citlivé na měď', 'Potřebuje zaběhnuté akvárium', 'Nemůže se množit ve sladké vodě'],
    },
    compatibility: ['Small peaceful fish', 'Other shrimp', 'Snails'],
  },
  {
    id: 'neocaridina-davidi',
    scientificName: 'Neocaridina davidi',
    commonNames: { en: 'Cherry Shrimp', cs: 'Krevetka třešňová' },
    type: 'fish',
    family: 'Atyidae',
    origin: 'Taiwan',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 10,
    maxSize: 3,
    lifespan: '1-2 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 5,
    waterParams: { tempMin: 18, tempMax: 28, phMin: 6.5, phMax: 8.0, ghMin: 6, ghMax: 20 },
    description: {
      en: 'Hardy colorful shrimp available in many color varieties. Easy to breed.',
      cs: 'Odolná barevná krevetka dostupná v mnoha barevných variantách. Snadno se množí.',
    },
    careNotes: {
      en: ['Very hardy', 'Breeds easily in freshwater', 'Many color varieties', 'Avoid copper'],
      cs: ['Velmi odolná', 'Snadno se množí ve sladké vodě', 'Mnoho barevných variant', 'Vyhněte se mědi'],
    },
    compatibility: ['Nano fish', 'Other shrimp', 'Snails'],
  },
  {
    id: 'caridina-cantonensis',
    scientificName: 'Caridina cantonensis',
    commonNames: { en: 'Crystal Red Shrimp', cs: 'Krevetka Crystal Red' },
    type: 'fish',
    family: 'Atyidae',
    origin: 'Taiwan (bred)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 20,
    maxSize: 3,
    lifespan: '1-2 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 5,
    waterParams: { tempMin: 18, tempMax: 24, phMin: 5.5, phMax: 6.8, ghMin: 0, ghMax: 6 },
    description: {
      en: 'Beautiful red and white patterned shrimp. Requires soft acidic water.',
      cs: 'Krásná červeno-bílá vzorovaná krevetka. Vyžaduje měkkou kyselou vodu.',
    },
    careNotes: {
      en: ['Requires soft acidic water', 'Sensitive to parameters', 'Active substrate needed', 'Grades vary in value'],
      cs: ['Vyžaduje měkkou kyselou vodu', 'Citlivá na parametry', 'Potřebný aktivní substrát', 'Stupně se liší hodnotou'],
    },
    compatibility: ['Other Caridina shrimp', 'Very peaceful fish only'],
  },

  // Killifish
  {
    id: 'aphyosemion-australe',
    scientificName: 'Aphyosemion australe',
    commonNames: { en: 'Cape Lopez Lyretail', cs: 'Halakar lyrovitý' },
    type: 'fish',
    family: 'Nothobranchiidae',
    origin: 'West Africa (Gabon)',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 40,
    maxSize: 6,
    lifespan: '3-5 years',
    diet: 'carnivore',
    schooling: false,
    waterParams: { tempMin: 22, tempMax: 26, phMin: 5.5, phMax: 7.0, ghMin: 2, ghMax: 10 },
    description: {
      en: 'Beautiful killifish with lyre-shaped tail. Males very colorful.',
      cs: 'Krásný halakar s lyrovitým ocasem. Samci velmi barvití.',
    },
    careNotes: {
      en: ['Non-annual killifish', 'Males colorful', 'Soft water preferred', 'Small live foods appreciated'],
      cs: ['Nesezónní halakar', 'Samci barvití', 'Preferuje měkkou vodu', 'Oceňuje malé živé krmivo'],
    },
    compatibility: ['Peaceful nano fish', 'Tetras', 'Corydoras'],
  },

  // Rainbowfish
  {
    id: 'melanotaenia-praecox',
    scientificName: 'Melanotaenia praecox',
    commonNames: { en: 'Dwarf Neon Rainbowfish', cs: 'Duhovec neonový' },
    type: 'fish',
    family: 'Melanotaeniidae',
    origin: 'New Guinea',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 80,
    maxSize: 6,
    lifespan: '3-4 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 24, tempMax: 28, phMin: 6.5, phMax: 7.5, ghMin: 8, ghMax: 15 },
    description: {
      en: 'Stunning iridescent blue rainbowfish. Males have bright red or yellow fins.',
      cs: 'Ohromující irizující modrý duhovec. Samci mají jasně červené nebo žluté ploutve.',
    },
    careNotes: {
      en: ['Active swimmers', 'Keep in schools', 'Males spar peacefully', 'Colors best in morning'],
      cs: ['Aktivní plavci', 'Držte v hejnech', 'Samci se mírumilovně perou', 'Barvy nejlepší ráno'],
    },
    compatibility: ['Other rainbowfish', 'Larger tetras', 'Barbs'],
  },
  {
    id: 'melanotaenia-boesemani',
    scientificName: 'Melanotaenia boesemani',
    commonNames: { en: 'Boesemani Rainbowfish', cs: 'Duhovec Boesemanův' },
    type: 'fish',
    family: 'Melanotaeniidae',
    origin: 'New Guinea',
    source: 'builtin',
    temperament: 'peaceful',
    minTankSize: 150,
    maxSize: 11,
    lifespan: '5-8 years',
    diet: 'omnivore',
    schooling: true,
    minSchoolSize: 6,
    waterParams: { tempMin: 24, tempMax: 28, phMin: 7.0, phMax: 8.0, ghMin: 10, ghMax: 20 },
    description: {
      en: 'Spectacular two-tone rainbowfish - blue front half and orange rear half.',
      cs: 'Velkolepý dvoubarevný duhovec - modrá přední polovina a oranžová zadní polovina.',
    },
    careNotes: {
      en: ['Colors develop with age', 'Needs swimming space', 'Keep in schools', 'Harder water preferred'],
      cs: ['Barvy se vyvíjejí s věkem', 'Potřebuje prostor k plavání', 'Držte v hejnech', 'Preferuje tvrdší vodu'],
    },
    compatibility: ['Other rainbowfish', 'Larger community fish'],
  },

  // ==================== PLANTS ====================

  // Easy plants
  {
    id: 'anubias-barteri',
    scientificName: 'Anubias barteri',
    commonNames: { en: 'Anubias', cs: 'Anubias' },
    type: 'plant',
    family: 'Araceae',
    origin: 'West Africa',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'slow',
    lightRequirement: 'low',
    co2Required: false,
    placement: 'midground',
    propagation: 'Rhizome division',
    waterParams: { tempMin: 22, tempMax: 28, phMin: 6.0, phMax: 7.5 },
    description: {
      en: 'Hardy epiphytic plant that attaches to wood and rocks. Does not need to be planted in substrate.',
      cs: 'Odolná epifytická rostlina, která se přichytává na dřevo a kameny. Nemusí být zasazena do substrátu.',
    },
    careNotes: {
      en: ['Attach to hardscape, do not bury rhizome', 'Very low maintenance', 'Can grow in low light conditions', 'Slow growing - patience required', 'Prone to algae on leaves in high light'],
      cs: ['Připevněte na hardscape, nezakrývejte oddenek', 'Velmi nízká údržba', 'Může růst v podmínkách slabého osvětlení', 'Pomalý růst - vyžaduje trpělivost', 'Náchylné k řasám na listech při silném osvětlení'],
    },
  },
  {
    id: 'anubias-nana',
    scientificName: 'Anubias barteri var. nana',
    commonNames: { en: 'Anubias Nana', cs: 'Anubias Nana' },
    type: 'plant',
    family: 'Araceae',
    origin: 'West Africa',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'slow',
    lightRequirement: 'low',
    co2Required: false,
    placement: 'foreground',
    propagation: 'Rhizome division',
    waterParams: { tempMin: 22, tempMax: 28, phMin: 6.0, phMax: 7.5 },
    description: {
      en: 'Compact variety of Anubias, perfect for foreground or attaching to small decorations.',
      cs: 'Kompaktní varieta Anubias, perfektní pro popředí nebo připevnění na malé dekorace.',
    },
    careNotes: {
      en: ['Smaller than regular Anubias', 'Do not bury rhizome', 'Great for nano tanks', 'Very easy care'],
      cs: ['Menší než běžný Anubias', 'Nezakrývejte oddenek', 'Skvělý pro nano akvária', 'Velmi snadná péče'],
    },
  },
  {
    id: 'anubias-nana-petite',
    scientificName: 'Anubias barteri var. nana "Petite"',
    commonNames: { en: 'Anubias Nana Petite', cs: 'Anubias Nana Petite' },
    type: 'plant',
    family: 'Araceae',
    origin: 'West Africa (cultivar)',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'slow',
    lightRequirement: 'low',
    co2Required: false,
    placement: 'foreground',
    propagation: 'Rhizome division',
    waterParams: { tempMin: 22, tempMax: 28, phMin: 6.0, phMax: 7.5 },
    description: {
      en: 'Extremely small Anubias variety. Perfect for nano aquariums and aquascaping details.',
      cs: 'Extrémně malá varieta Anubias. Perfektní pro nano akvária a detaily aquascapingu.',
    },
    careNotes: {
      en: ['Tiniest Anubias variety', 'Perfect for nano tanks', 'Very slow growing', 'Attach to small stones'],
      cs: ['Nejmenší varieta Anubias', 'Perfektní pro nano akvária', 'Velmi pomalý růst', 'Připevněte na malé kameny'],
    },
  },
  {
    id: 'cryptocoryne-wendtii',
    scientificName: 'Cryptocoryne wendtii',
    commonNames: { en: 'Cryptocoryne', cs: 'Kryptokorýna' },
    type: 'plant',
    family: 'Araceae',
    origin: 'Sri Lanka',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'slow',
    lightRequirement: 'low',
    co2Required: false,
    placement: 'midground',
    propagation: 'Runners',
    waterParams: { tempMin: 22, tempMax: 28, phMin: 6.0, phMax: 8.0, ghMin: 2, ghMax: 15 },
    description: {
      en: 'Popular and easy aquarium plant with various color forms. Excellent for beginners.',
      cs: 'Populární a snadná akvarijní rostlina s různými barevnými formami. Vynikající pro začátečníky.',
    },
    careNotes: {
      en: ['May experience "crypt melt" after planting', 'Root feeder - benefits from root tabs', 'Tolerates wide range of conditions', 'Leave undisturbed once established', 'Spreads through runners over time'],
      cs: ['Může zažít "crypt melt" po zasazení', 'Kořenový příjem - prospívají kořenové tablety', 'Snáší širokou škálu podmínek', 'Po usazení nechte v klidu', 'Šíří se výběžky v průběhu času'],
    },
  },
  {
    id: 'cryptocoryne-parva',
    scientificName: 'Cryptocoryne parva',
    commonNames: { en: 'Dwarf Crypt', cs: 'Kryptokorýna drobná' },
    type: 'plant',
    family: 'Araceae',
    origin: 'Sri Lanka',
    source: 'builtin',
    difficulty: 'medium',
    growthRate: 'slow',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'foreground',
    propagation: 'Runners',
    waterParams: { tempMin: 22, tempMax: 28, phMin: 6.0, phMax: 8.0 },
    description: {
      en: 'Smallest Cryptocoryne species. Perfect for foreground carpeting.',
      cs: 'Nejmenší druh Cryptocoryne. Perfektní pro koberec v popředí.',
    },
    careNotes: {
      en: ['Very slow growing', 'Needs more light than other crypts', 'Patient required', 'Root tabs beneficial'],
      cs: ['Velmi pomalý růst', 'Potřebuje více světla než jiné krypty', 'Vyžaduje trpělivost', 'Kořenové tablety prospěšné'],
    },
  },
  {
    id: 'microsorum-pteropus',
    scientificName: 'Microsorum pteropus',
    commonNames: { en: 'Java Fern', cs: 'Javánská kapradina' },
    type: 'plant',
    family: 'Polypodiaceae',
    origin: 'Southeast Asia',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'slow',
    lightRequirement: 'low',
    co2Required: false,
    placement: 'midground',
    propagation: 'Rhizome division, adventitious plantlets',
    waterParams: { tempMin: 20, tempMax: 28, phMin: 5.5, phMax: 8.0 },
    description: {
      en: 'Very hardy epiphytic fern. Grows attached to hardscape, not planted in substrate.',
      cs: 'Velmi odolná epifytická kapradina. Roste přichycená na hardscape, nezasazená do substrátu.',
    },
    careNotes: {
      en: ['Do not bury rhizome - attach to wood or rocks', 'Produces baby plants on leaves', 'Very low light tolerant', 'Black spots may appear - normal spore development', 'Hardy and nearly indestructible'],
      cs: ['Nezakrývejte oddenek - připevněte na dřevo nebo kameny', 'Produkuje dětské rostliny na listech', 'Toleruje velmi slabé světlo', 'Mohou se objevit černé skvrny - normální vývoj spór', 'Odolná a téměř nezničitelná'],
    },
  },
  {
    id: 'microsorum-pteropus-windelov',
    scientificName: 'Microsorum pteropus "Windelov"',
    commonNames: { en: 'Java Fern Windelov', cs: 'Javánská kapradina Windelov' },
    type: 'plant',
    family: 'Polypodiaceae',
    origin: 'Southeast Asia (cultivar)',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'slow',
    lightRequirement: 'low',
    co2Required: false,
    placement: 'midground',
    propagation: 'Rhizome division',
    waterParams: { tempMin: 20, tempMax: 28, phMin: 5.5, phMax: 8.0 },
    description: {
      en: 'Beautiful variety with finely divided, lace-like leaf tips.',
      cs: 'Krásná varieta s jemně dělenými, krajkovitými špičkami listů.',
    },
    careNotes: {
      en: ['Same care as regular Java Fern', 'More delicate appearance', 'Attach to hardscape', 'Very hardy'],
      cs: ['Stejná péče jako běžná Javánská kapradina', 'Jemnější vzhled', 'Připevněte na hardscape', 'Velmi odolná'],
    },
  },
  {
    id: 'taxiphyllum-barbieri',
    scientificName: 'Taxiphyllum barbieri',
    commonNames: { en: 'Java Moss', cs: 'Javánský mech' },
    type: 'plant',
    family: 'Hypnaceae',
    origin: 'Southeast Asia',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'medium',
    lightRequirement: 'low',
    co2Required: false,
    placement: 'foreground',
    propagation: 'Division',
    waterParams: { tempMin: 15, tempMax: 28, phMin: 5.5, phMax: 8.0 },
    description: {
      en: 'Extremely versatile moss. Attaches to any surface. Great for shrimp tanks.',
      cs: 'Extrémně všestranný mech. Přichytí se na jakýkoli povrch. Skvělý pro krevetí nádrže.',
    },
    careNotes: {
      en: ['Attach to hardscape or let float', 'Great for shrimp breeding', 'Can trap debris - clean occasionally', 'Very adaptable'],
      cs: ['Připevněte na hardscape nebo nechte plavat', 'Skvělý pro chov krevet', 'Může zachytávat nečistoty - občas vyčistěte', 'Velmi přizpůsobivý'],
    },
  },
  {
    id: 'vesicularia-montagnei',
    scientificName: 'Vesicularia montagnei',
    commonNames: { en: 'Christmas Moss', cs: 'Vánoční mech' },
    type: 'plant',
    family: 'Hypnaceae',
    origin: 'Southeast Asia',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'slow',
    lightRequirement: 'low',
    co2Required: false,
    placement: 'foreground',
    propagation: 'Division',
    waterParams: { tempMin: 18, tempMax: 28, phMin: 5.5, phMax: 7.5 },
    description: {
      en: 'Beautiful moss with triangular branching pattern resembling Christmas tree.',
      cs: 'Krásný mech s trojúhelníkovým větvením připomínajícím vánoční stromeček.',
    },
    careNotes: {
      en: ['More structured than Java Moss', 'Attach to mesh or hardscape', 'Great for aquascaping', 'Cooler water preferred'],
      cs: ['Strukturovanější než Javánský mech', 'Připevněte na síťku nebo hardscape', 'Skvělý pro aquascaping', 'Preferuje chladnější vodu'],
    },
  },
  {
    id: 'aegagropila-linnaei',
    scientificName: 'Aegagropila linnaei',
    commonNames: { en: 'Marimo Moss Ball', cs: 'Marimo řasová koule' },
    type: 'plant',
    family: 'Cladophoraceae',
    origin: 'Japan, Northern Europe',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'slow',
    lightRequirement: 'low',
    co2Required: false,
    placement: 'foreground',
    propagation: 'Division',
    waterParams: { tempMin: 5, tempMax: 25, phMin: 6.0, phMax: 8.0 },
    description: {
      en: 'Unique spherical algae ball. Decorative and helps slightly with water quality.',
      cs: 'Unikátní kulovitá řasová koule. Dekorativní a mírně pomáhá s kvalitou vody.',
    },
    careNotes: {
      en: ['Not a true plant - it\'s algae', 'Roll occasionally to maintain shape', 'Prefers cooler water', 'Low light best'],
      cs: ['Není to pravá rostlina - je to řasa', 'Občas otočte pro zachování tvaru', 'Preferuje chladnější vodu', 'Nejlepší slabé světlo'],
    },
  },
  {
    id: 'ceratophyllum-demersum',
    scientificName: 'Ceratophyllum demersum',
    commonNames: { en: 'Hornwort', cs: 'Růžkatec ponořený' },
    type: 'plant',
    family: 'Ceratophyllaceae',
    origin: 'Worldwide',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'fast',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'background',
    propagation: 'Stem cuttings',
    waterParams: { tempMin: 15, tempMax: 30, phMin: 6.0, phMax: 8.5 },
    description: {
      en: 'Fast-growing floating or anchored stem plant. Excellent for nutrient absorption.',
      cs: 'Rychle rostoucí plovoucí nebo ukotvená stonková rostlina. Výborná pro absorpci živin.',
    },
    careNotes: {
      en: ['No true roots - floats or anchor', 'Grows very fast', 'Excellent nitrogen absorber', 'Can shed needles when stressed'],
      cs: ['Nemá pravé kořeny - plave nebo se ukotví', 'Roste velmi rychle', 'Výborný absorbér dusíku', 'Může shazovat jehličky při stresu'],
    },
  },
  {
    id: 'egeria-densa',
    scientificName: 'Egeria densa',
    commonNames: { en: 'Brazilian Waterweed', cs: 'Vodní mor brazilský' },
    type: 'plant',
    family: 'Hydrocharitaceae',
    origin: 'South America',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'fast',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'background',
    propagation: 'Stem cuttings',
    waterParams: { tempMin: 10, tempMax: 26, phMin: 6.0, phMax: 8.5 },
    description: {
      en: 'Very fast growing oxygenating plant. Great for new aquariums.',
      cs: 'Velmi rychle rostoucí okysličující rostlina. Skvělá pro nová akvária.',
    },
    careNotes: {
      en: ['Grows extremely fast', 'Great for cycling new tanks', 'Easy to propagate', 'May need regular trimming'],
      cs: ['Roste extrémně rychle', 'Skvělá pro zajetí nových nádrží', 'Snadno se množí', 'Může vyžadovat pravidelné zastřihování'],
    },
  },
  {
    id: 'vallisneria-spiralis',
    scientificName: 'Vallisneria spiralis',
    commonNames: { en: 'Italian Vallisneria', cs: 'Vallisnérie točivá' },
    type: 'plant',
    family: 'Hydrocharitaceae',
    origin: 'Tropical regions worldwide',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'fast',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'background',
    propagation: 'Runners',
    waterParams: { tempMin: 15, tempMax: 30, phMin: 6.5, phMax: 8.5, ghMin: 5, ghMax: 20 },
    description: {
      en: 'Classic background plant with long grass-like leaves. Fast growing and easy to propagate.',
      cs: 'Klasická pozadí rostlina s dlouhými travnatými listy. Rychle roste a snadno se množí.',
    },
    careNotes: {
      en: ['Can grow very tall - may need trimming', 'Spreads rapidly through runners', 'Good nutrient absorption', 'Sensitive to Excel/liquid carbon', 'Provides hiding spots for fish'],
      cs: ['Může dorůst velmi vysoká - může vyžadovat zastřihování', 'Rychle se šíří výběžky', 'Dobrá absorpce živin', 'Citlivá na Excel/tekutý uhlík', 'Poskytuje úkryty pro ryby'],
    },
  },
  {
    id: 'vallisneria-americana',
    scientificName: 'Vallisneria americana',
    commonNames: { en: 'Jungle Val', cs: 'Vallisnérie americká' },
    type: 'plant',
    family: 'Hydrocharitaceae',
    origin: 'North America',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'fast',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'background',
    propagation: 'Runners',
    waterParams: { tempMin: 15, tempMax: 30, phMin: 6.5, phMax: 8.5 },
    description: {
      en: 'Large variety of Vallisneria with very long leaves. Can reach water surface in most tanks.',
      cs: 'Velká varieta Vallisnérie s velmi dlouhými listy. Může dosáhnout hladiny ve většině nádrží.',
    },
    careNotes: {
      en: ['Grows very tall', 'Creates jungle-like background', 'Spreads by runners', 'May need frequent trimming'],
      cs: ['Roste velmi vysoko', 'Vytváří džungli v pozadí', 'Šíří se výběžky', 'Může vyžadovat časté zastřihování'],
    },
  },
  {
    id: 'sagittaria-subulata',
    scientificName: 'Sagittaria subulata',
    commonNames: { en: 'Dwarf Sagittaria', cs: 'Střelka šídlolistá' },
    type: 'plant',
    family: 'Alismataceae',
    origin: 'North America',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'fast',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'foreground',
    propagation: 'Runners',
    waterParams: { tempMin: 18, tempMax: 28, phMin: 6.0, phMax: 8.0 },
    description: {
      en: 'Grass-like plant perfect for creating natural meadow effect in foreground.',
      cs: 'Travnatá rostlina perfektní pro vytvoření přirozeného lučního efektu v popředí.',
    },
    careNotes: {
      en: ['Spreads quickly by runners', 'Great foreground plant', 'Easy care', 'Height varies with light'],
      cs: ['Rychle se šíří výběžky', 'Skvělá rostlina do popředí', 'Snadná péče', 'Výška se liší podle světla'],
    },
  },
  {
    id: 'echinodorus-bleheri',
    scientificName: 'Echinodorus bleheri',
    commonNames: { en: 'Amazon Sword', cs: 'Šípovka amazonská' },
    type: 'plant',
    family: 'Alismataceae',
    origin: 'South America',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'medium',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'background',
    propagation: 'Adventitious plants, runners',
    waterParams: { tempMin: 20, tempMax: 28, phMin: 6.5, phMax: 7.5 },
    description: {
      en: 'Classic large rosette plant. Makes an impressive centerpiece in larger tanks.',
      cs: 'Klasická velká růžicová rostlina. Vytváří impozantní středobod ve větších nádržích.',
    },
    careNotes: {
      en: ['Gets very large', 'Heavy root feeder', 'Root tabs essential', 'Great centerpiece plant'],
      cs: ['Dorůstá velmi velké', 'Silný kořenový příjem', 'Kořenové tablety nezbytné', 'Skvělá rostlina jako střed'],
    },
  },
  {
    id: 'echinodorus-tenellus',
    scientificName: 'Echinodorus tenellus',
    commonNames: { en: 'Pygmy Chain Sword', cs: 'Šípovka drobná' },
    type: 'plant',
    family: 'Alismataceae',
    origin: 'North and South America',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'fast',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'foreground',
    propagation: 'Runners',
    waterParams: { tempMin: 18, tempMax: 28, phMin: 6.0, phMax: 8.0 },
    description: {
      en: 'Small chain sword that forms dense carpet. Very easy and fast spreading.',
      cs: 'Malá řetězová šípovka, která tvoří hustý koberec. Velmi snadná a rychle se šíří.',
    },
    careNotes: {
      en: ['Spreads rapidly', 'Great for carpet', 'Root feeder', 'Very easy care'],
      cs: ['Rychle se šíří', 'Skvělá pro koberec', 'Kořenový příjem', 'Velmi snadná péče'],
    },
  },
  {
    id: 'hydrocotyle-tripartita',
    scientificName: 'Hydrocotyle tripartita',
    commonNames: { en: 'Hydrocotyle Japan', cs: 'Hydrocotyle Japan' },
    type: 'plant',
    family: 'Araliaceae',
    origin: 'Southeast Asia',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'fast',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'foreground',
    propagation: 'Runners',
    waterParams: { tempMin: 20, tempMax: 28, phMin: 5.5, phMax: 8.0 },
    description: {
      en: 'Compact clover-like plant. Creates beautiful cascading effect.',
      cs: 'Kompaktní jetelová rostlina. Vytváří krásný kaskádový efekt.',
    },
    careNotes: {
      en: ['Grows compact in high light', 'Great for aquascaping', 'Easy to trim and shape', 'CO2 enhances growth'],
      cs: ['Roste kompaktně při silném světle', 'Skvělá pro aquascaping', 'Snadno se zastřihuje a tvaruje', 'CO2 zvyšuje růst'],
    },
  },
  {
    id: 'bacopa-caroliniana',
    scientificName: 'Bacopa caroliniana',
    commonNames: { en: 'Lemon Bacopa', cs: 'Bacopa karolínská' },
    type: 'plant',
    family: 'Plantaginaceae',
    origin: 'North America',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'medium',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'background',
    propagation: 'Stem cuttings',
    waterParams: { tempMin: 15, tempMax: 28, phMin: 6.0, phMax: 8.0 },
    description: {
      en: 'Hardy stem plant with lemon-scented leaves. Great for beginners.',
      cs: 'Odolná stonková rostlina s citrónově vonnými listy. Skvělá pro začátečníky.',
    },
    careNotes: {
      en: ['Lemon scent when crushed', 'Hardy and adaptable', 'Easy to propagate', 'Leaves turn red in high light'],
      cs: ['Citronová vůně při pomačkání', 'Odolná a přizpůsobivá', 'Snadno se množí', 'Listy červenají při silném světle'],
    },
  },
  {
    id: 'limnophila-sessiliflora',
    scientificName: 'Limnophila sessiliflora',
    commonNames: { en: 'Asian Ambulia', cs: 'Limnofila přisedlá' },
    type: 'plant',
    family: 'Plantaginaceae',
    origin: 'Southeast Asia',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'fast',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'background',
    propagation: 'Stem cuttings',
    waterParams: { tempMin: 22, tempMax: 28, phMin: 6.0, phMax: 8.0 },
    description: {
      en: 'Feathery stem plant, great alternative to Cabomba. Much easier to grow.',
      cs: 'Péřovitá stonková rostlina, skvělá alternativa k Cabombě. Mnohem snazší pěstování.',
    },
    careNotes: {
      en: ['Easier than Cabomba', 'Fast grower', 'Good nutrient absorber', 'May need regular trimming'],
      cs: ['Snazší než Cabomba', 'Rychlý růst', 'Dobrý absorbér živin', 'Může vyžadovat pravidelné zastřihování'],
    },
  },

  // Medium difficulty plants
  {
    id: 'rotala-rotundifolia',
    scientificName: 'Rotala rotundifolia',
    commonNames: { en: 'Dwarf Rotala', cs: 'Rotala okrouhlolistá' },
    type: 'plant',
    family: 'Lythraceae',
    origin: 'Southeast Asia',
    source: 'builtin',
    difficulty: 'medium',
    growthRate: 'fast',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'background',
    propagation: 'Stem cuttings',
    waterParams: { tempMin: 18, tempMax: 28, phMin: 5.5, phMax: 7.5 },
    description: {
      en: 'Versatile stem plant that can range from green to red depending on light and nutrients.',
      cs: 'Všestranná stonková rostlina, která může být zelená až červená v závislosti na světle a živinách.',
    },
    careNotes: {
      en: ['Higher light brings out red coloration', 'Regular trimming encourages bushier growth', 'Benefits from CO2 but not required', 'Plant in groups for best effect', 'Fast growth makes it a good nutrient sponge'],
      cs: ['Vyšší světlo vyvolá červené zbarvení', 'Pravidelné zastřihování podporuje hustější růst', 'Prospívá CO2, ale není nutné', 'Sázejte ve skupinách pro nejlepší efekt', 'Rychlý růst z ní dělá dobrou houbičku na živiny'],
    },
  },
  {
    id: 'rotala-indica',
    scientificName: 'Rotala indica',
    commonNames: { en: 'Indian Toothcup', cs: 'Rotala indická' },
    type: 'plant',
    family: 'Lythraceae',
    origin: 'Southeast Asia',
    source: 'builtin',
    difficulty: 'medium',
    growthRate: 'fast',
    lightRequirement: 'high',
    co2Required: false,
    placement: 'background',
    propagation: 'Stem cuttings',
    waterParams: { tempMin: 22, tempMax: 28, phMin: 5.5, phMax: 7.5 },
    description: {
      en: 'Beautiful stem plant that turns pink to red under high light.',
      cs: 'Krásná stonková rostlina, která se zbarví do růžova až červena při silném světle.',
    },
    careNotes: {
      en: ['Needs high light for color', 'CO2 recommended', 'Fast grower', 'Regular trimming needed'],
      cs: ['Potřebuje silné světlo pro barvu', 'Doporučeno CO2', 'Rychlý růst', 'Potřebuje pravidelné zastřihování'],
    },
  },
  {
    id: 'ludwigia-repens',
    scientificName: 'Ludwigia repens',
    commonNames: { en: 'Creeping Ludwigia', cs: 'Ludvígie plazivá' },
    type: 'plant',
    family: 'Onagraceae',
    origin: 'North America',
    source: 'builtin',
    difficulty: 'medium',
    growthRate: 'medium',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'background',
    propagation: 'Stem cuttings',
    waterParams: { tempMin: 15, tempMax: 28, phMin: 6.0, phMax: 8.0 },
    description: {
      en: 'Red-leaved stem plant, relatively easy for a red plant.',
      cs: 'Červenolistá stonková rostlina, relativně snadná jako červená rostlina.',
    },
    careNotes: {
      en: ['One of easier red plants', 'More light = more red', 'Iron dosing helps color', 'Regular trimming needed'],
      cs: ['Jedna ze snazších červených rostlin', 'Více světla = více červené', 'Dávkování železa pomáhá barvě', 'Potřebuje pravidelné zastřihování'],
    },
  },
  {
    id: 'alternanthera-reineckii',
    scientificName: 'Alternanthera reineckii',
    commonNames: { en: 'Scarlet Temple', cs: 'Alternanthera červená' },
    type: 'plant',
    family: 'Amaranthaceae',
    origin: 'South America',
    source: 'builtin',
    difficulty: 'medium',
    growthRate: 'medium',
    lightRequirement: 'high',
    co2Required: true,
    placement: 'midground',
    propagation: 'Stem cuttings',
    waterParams: { tempMin: 22, tempMax: 28, phMin: 5.5, phMax: 7.5 },
    description: {
      en: 'Stunning red stem plant. Needs high light and CO2 for best coloration.',
      cs: 'Ohromující červená stonková rostlina. Potřebuje silné světlo a CO2 pro nejlepší zbarvení.',
    },
    careNotes: {
      en: ['High light essential', 'CO2 recommended', 'Iron supplements help', 'Stunning red color when healthy'],
      cs: ['Silné světlo nezbytné', 'Doporučeno CO2', 'Doplňky železa pomáhají', 'Ohromující červená barva při zdraví'],
    },
  },
  {
    id: 'staurogyne-repens',
    scientificName: 'Staurogyne repens',
    commonNames: { en: 'Staurogyne Repens', cs: 'Staurogyne plazivá' },
    type: 'plant',
    family: 'Acanthaceae',
    origin: 'South America (Brazil)',
    source: 'builtin',
    difficulty: 'medium',
    growthRate: 'slow',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'foreground',
    propagation: 'Stem cuttings',
    waterParams: { tempMin: 20, tempMax: 28, phMin: 5.5, phMax: 7.5 },
    description: {
      en: 'Compact low-growing plant perfect for foreground. Forms dense bushes.',
      cs: 'Kompaktní nízko rostoucí rostlina perfektní pro popředí. Tvoří husté keře.',
    },
    careNotes: {
      en: ['Great foreground plant', 'Stays low', 'Moderate requirements', 'CO2 helps but not essential'],
      cs: ['Skvělá rostlina do popředí', 'Zůstává nízká', 'Střední požadavky', 'CO2 pomáhá ale není nezbytné'],
    },
  },
  {
    id: 'pogostemon-helferi',
    scientificName: 'Pogostemon helferi',
    commonNames: { en: 'Downoi', cs: 'Pogostemon hvězdnatý' },
    type: 'plant',
    family: 'Lamiaceae',
    origin: 'Thailand',
    source: 'builtin',
    difficulty: 'medium',
    growthRate: 'slow',
    lightRequirement: 'medium',
    co2Required: true,
    placement: 'foreground',
    propagation: 'Side shoots',
    waterParams: { tempMin: 22, tempMax: 28, phMin: 6.0, phMax: 7.5 },
    description: {
      en: 'Unique star-shaped leaves in rosette form. Very distinctive appearance.',
      cs: 'Unikátní hvězdicovité listy v růžicové formě. Velmi charakteristický vzhled.',
    },
    careNotes: {
      en: ['Unique star-shaped leaves', 'CO2 recommended', 'Rich substrate needed', 'Slow but steady growth'],
      cs: ['Unikátní hvězdicovité listy', 'Doporučeno CO2', 'Potřebný bohatý substrát', 'Pomalý ale stálý růst'],
    },
  },
  {
    id: 'bucephalandra-sp',
    scientificName: 'Bucephalandra sp.',
    commonNames: { en: 'Bucephalandra', cs: 'Bucephalandra' },
    type: 'plant',
    family: 'Araceae',
    origin: 'Borneo',
    source: 'builtin',
    difficulty: 'medium',
    growthRate: 'slow',
    lightRequirement: 'low',
    co2Required: false,
    placement: 'midground',
    propagation: 'Rhizome division',
    waterParams: { tempMin: 22, tempMax: 28, phMin: 5.5, phMax: 7.5 },
    description: {
      en: 'Rare and beautiful rhizome plant from Borneo. Many color varieties available.',
      cs: 'Vzácná a krásná oddenková rostlina z Bornea. Dostupné mnoho barevných variant.',
    },
    careNotes: {
      en: ['Attach to hardscape', 'Do not bury rhizome', 'Many varieties', 'Slow but steady growth'],
      cs: ['Připevněte na hardscape', 'Nezakrývejte oddenek', 'Mnoho variet', 'Pomalý ale stálý růst'],
    },
  },

  // Hard/High-tech plants
  {
    id: 'eleocharis-parvula',
    scientificName: 'Eleocharis parvula',
    commonNames: { en: 'Dwarf Hairgrass', cs: 'Bahenka trpasličí' },
    type: 'plant',
    family: 'Cyperaceae',
    origin: 'Worldwide',
    source: 'builtin',
    difficulty: 'medium',
    growthRate: 'medium',
    lightRequirement: 'high',
    co2Required: true,
    placement: 'carpet',
    propagation: 'Runners',
    waterParams: { tempMin: 10, tempMax: 28, phMin: 6.0, phMax: 7.5 },
    description: {
      en: 'Popular carpeting plant that creates a grass-like lawn effect. Requires high light and CO2.',
      cs: 'Populární kobercová rostlina, která vytváří efekt trávníku. Vyžaduje vysoké světlo a CO2.',
    },
    careNotes: {
      en: ['Requires high light for carpet formation', 'CO2 injection recommended', 'Plant in small clumps for faster spread', 'Nutrient-rich substrate beneficial', 'May take time to establish'],
      cs: ['Vyžaduje vysoké světlo pro tvorbu koberce', 'Doporučeno vstřikování CO2', 'Sázejte v malých trsech pro rychlejší rozšíření', 'Substrát bohatý na živiny je prospěšný', 'Může trvat, než se usadí'],
    },
  },
  {
    id: 'hemianthus-callitrichoides',
    scientificName: 'Hemianthus callitrichoides',
    commonNames: { en: 'Dwarf Baby Tears / HC Cuba', cs: 'Hemianthus Cuba' },
    type: 'plant',
    family: 'Linderniaceae',
    origin: 'Cuba',
    source: 'builtin',
    difficulty: 'hard',
    growthRate: 'slow',
    lightRequirement: 'high',
    co2Required: true,
    placement: 'carpet',
    propagation: 'Division',
    waterParams: { tempMin: 20, tempMax: 28, phMin: 5.5, phMax: 7.5 },
    description: {
      en: 'The smallest aquarium plant. Creates stunning carpets but very demanding.',
      cs: 'Nejmenší akvarijní rostlina. Vytváří ohromující koberce, ale velmi náročná.',
    },
    careNotes: {
      en: ['Smallest aquatic plant', 'High light and CO2 essential', 'Demanding but rewarding', 'Prone to algae if neglected'],
      cs: ['Nejmenší vodní rostlina', 'Silné světlo a CO2 nezbytné', 'Náročná ale odměňující', 'Náchylná k řasám při zanedbání'],
    },
  },
  {
    id: 'micranthemum-monte-carlo',
    scientificName: 'Micranthemum tweediei "Monte Carlo"',
    commonNames: { en: 'Monte Carlo', cs: 'Monte Carlo' },
    type: 'plant',
    family: 'Linderniaceae',
    origin: 'Argentina',
    source: 'builtin',
    difficulty: 'medium',
    growthRate: 'medium',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'carpet',
    propagation: 'Runners',
    waterParams: { tempMin: 20, tempMax: 28, phMin: 6.0, phMax: 7.5 },
    description: {
      en: 'Easier alternative to HC Cuba. Creates beautiful carpets with less demanding care.',
      cs: 'Snazší alternativa k HC Cuba. Vytváří krásné koberce s méně náročnou péčí.',
    },
    careNotes: {
      en: ['Easier than HC Cuba', 'CO2 helpful but not essential', 'Forms dense carpet', 'Good for beginners in carpeting'],
      cs: ['Snazší než HC Cuba', 'CO2 užitečné ale ne nezbytné', 'Tvoří hustý koberec', 'Dobrá pro začátečníky v kobercích'],
    },
  },
  {
    id: 'glossostigma-elatinoides',
    scientificName: 'Glossostigma elatinoides',
    commonNames: { en: 'Glossostigma', cs: 'Glossostigma' },
    type: 'plant',
    family: 'Phrymaceae',
    origin: 'New Zealand, Australia',
    source: 'builtin',
    difficulty: 'hard',
    growthRate: 'fast',
    lightRequirement: 'high',
    co2Required: true,
    placement: 'carpet',
    propagation: 'Runners',
    waterParams: { tempMin: 15, tempMax: 26, phMin: 5.5, phMax: 7.0 },
    description: {
      en: 'Classic Iwagumi carpeting plant. Creates very low, dense carpet.',
      cs: 'Klasická Iwagumi kobercová rostlina. Vytváří velmi nízký, hustý koberec.',
    },
    careNotes: {
      en: ['Needs very high light', 'CO2 essential', 'Will grow upward without enough light', 'Demanding but beautiful'],
      cs: ['Potřebuje velmi silné světlo', 'CO2 nezbytné', 'Bude růst nahoru bez dostatku světla', 'Náročná ale krásná'],
    },
  },
  {
    id: 'utricularia-graminifolia',
    scientificName: 'Utricularia graminifolia',
    commonNames: { en: 'Bladderwort', cs: 'Bublinatka travnatá' },
    type: 'plant',
    family: 'Lentibulariaceae',
    origin: 'Southeast Asia',
    source: 'builtin',
    difficulty: 'hard',
    growthRate: 'medium',
    lightRequirement: 'high',
    co2Required: true,
    placement: 'carpet',
    propagation: 'Runners',
    waterParams: { tempMin: 22, tempMax: 28, phMin: 5.0, phMax: 7.0 },
    description: {
      en: 'Carnivorous grass-like carpeting plant. Creates unique wavy carpet effect.',
      cs: 'Masožravá travnatá kobercová rostlina. Vytváří unikátní vlnitý kobercový efekt.',
    },
    careNotes: {
      en: ['Carnivorous - traps tiny organisms', 'High light and CO2 required', 'Soft acidic water', 'Creates unique wavy carpet'],
      cs: ['Masožravá - chytá drobné organismy', 'Vyžaduje silné světlo a CO2', 'Měkká kyselá voda', 'Vytváří unikátní vlnitý koberec'],
    },
  },
  {
    id: 'rotala-macrandra',
    scientificName: 'Rotala macrandra',
    commonNames: { en: 'Giant Red Rotala', cs: 'Rotala červená' },
    type: 'plant',
    family: 'Lythraceae',
    origin: 'India',
    source: 'builtin',
    difficulty: 'hard',
    growthRate: 'fast',
    lightRequirement: 'high',
    co2Required: true,
    placement: 'background',
    propagation: 'Stem cuttings',
    waterParams: { tempMin: 22, tempMax: 28, phMin: 5.0, phMax: 7.0 },
    description: {
      en: 'One of the most beautiful red aquarium plants. Very demanding.',
      cs: 'Jedna z nejkrásnějších červených akvarijních rostlin. Velmi náročná.',
    },
    careNotes: {
      en: ['Demanding but stunning', 'High light and CO2 essential', 'Iron and nutrients needed', 'Soft acidic water preferred'],
      cs: ['Náročná ale ohromující', 'Silné světlo a CO2 nezbytné', 'Potřebuje železo a živiny', 'Preferuje měkkou kyselou vodu'],
    },
  },

  // Floating plants
  {
    id: 'limnobium-laevigatum',
    scientificName: 'Limnobium laevigatum',
    commonNames: { en: 'Amazon Frogbit', cs: 'Žabí kopřiva' },
    type: 'plant',
    family: 'Hydrocharitaceae',
    origin: 'Central and South America',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'fast',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'floating',
    propagation: 'Runners',
    waterParams: { tempMin: 15, tempMax: 30, phMin: 6.0, phMax: 8.0 },
    description: {
      en: 'Floating plant with round leaves and dangling roots. Great for providing shade.',
      cs: 'Plovoucí rostlina s kulatými listy a visícími kořeny. Skvělá pro poskytnutí stínu.',
    },
    careNotes: {
      en: ['Keep leaves dry from above', 'Provides shade and cover', 'Long roots - good for fry', 'Remove excess regularly'],
      cs: ['Udržujte listy suché shora', 'Poskytuje stín a kryt', 'Dlouhé kořeny - dobré pro potěr', 'Pravidelně odstraňujte přebytky'],
    },
  },
  {
    id: 'pistia-stratiotes',
    scientificName: 'Pistia stratiotes',
    commonNames: { en: 'Water Lettuce', cs: 'Vodní salát' },
    type: 'plant',
    family: 'Araceae',
    origin: 'Tropical worldwide',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'fast',
    lightRequirement: 'high',
    co2Required: false,
    placement: 'floating',
    propagation: 'Runners',
    waterParams: { tempMin: 22, tempMax: 30, phMin: 6.5, phMax: 7.5 },
    description: {
      en: 'Beautiful rosette floating plant resembling lettuce. Needs high light.',
      cs: 'Krásná růžicová plovoucí rostlina připomínající salát. Potřebuje silné světlo.',
    },
    careNotes: {
      en: ['Needs strong light', 'Keep leaves dry', 'Good nutrient absorber', 'May be restricted in some areas'],
      cs: ['Potřebuje silné světlo', 'Udržujte listy suché', 'Dobrý absorbér živin', 'Může být omezena v některých oblastech'],
    },
  },
  {
    id: 'salvinia-minima',
    scientificName: 'Salvinia minima',
    commonNames: { en: 'Water Spangles', cs: 'Nepukalka malá' },
    type: 'plant',
    family: 'Salviniaceae',
    origin: 'Americas',
    source: 'builtin',
    difficulty: 'easy',
    growthRate: 'fast',
    lightRequirement: 'medium',
    co2Required: false,
    placement: 'floating',
    propagation: 'Division',
    waterParams: { tempMin: 15, tempMax: 28, phMin: 6.0, phMax: 8.0 },
    description: {
      en: 'Small floating fern with water-repellent leaves. Multiplies quickly.',
      cs: 'Malá plovoucí kapradina s vodoodpudivými listy. Rychle se množí.',
    },
    careNotes: {
      en: ['Very easy floating plant', 'Multiplies rapidly', 'Good for shrimp tanks', 'Remove excess regularly'],
      cs: ['Velmi snadná plovoucí rostlina', 'Rychle se množí', 'Dobrá pro krevetí nádrže', 'Pravidelně odstraňujte přebytky'],
    },
  },
  {
    id: 'phyllanthus-fluitans',
    scientificName: 'Phyllanthus fluitans',
    commonNames: { en: 'Red Root Floater', cs: 'Plovoucí červený kořen' },
    type: 'plant',
    family: 'Phyllanthaceae',
    origin: 'South America',
    source: 'builtin',
    difficulty: 'medium',
    growthRate: 'medium',
    lightRequirement: 'high',
    co2Required: false,
    placement: 'floating',
    propagation: 'Runners',
    waterParams: { tempMin: 22, tempMax: 30, phMin: 6.0, phMax: 7.5 },
    description: {
      en: 'Beautiful floating plant with red undersides and roots in high light.',
      cs: 'Krásná plovoucí rostlina s červenou spodní stranou a kořeny při silném světle.',
    },
    careNotes: {
      en: ['Needs high light for red color', 'Keep leaves dry', 'Slower than some floaters', 'Iron helps coloration'],
      cs: ['Potřebuje silné světlo pro červenou barvu', 'Udržujte listy suché', 'Pomalejší než některé plovoucí', 'Železo pomáhá zbarvení'],
    },
  },
];

// Storage key for user-defined species
const USER_SPECIES_KEY = 'aquarium-journal-user-species';

// Get user-defined species from localStorage
export const getUserSpecies = (userId?: string): SpeciesInfo[] => {
  try {
    const stored = localStorage.getItem(USER_SPECIES_KEY);
    if (!stored) return [];
    const allUserSpecies: SpeciesInfo[] = JSON.parse(stored);
    if (userId) {
      return allUserSpecies.filter(s => s.userId === userId);
    }
    return allUserSpecies;
  } catch {
    return [];
  }
};

// Save user-defined species
export const saveUserSpecies = (species: SpeciesInfo): void => {
  try {
    const allUserSpecies = getUserSpecies();
    const existingIndex = allUserSpecies.findIndex(s => s.id === species.id);
    if (existingIndex >= 0) {
      allUserSpecies[existingIndex] = species;
    } else {
      allUserSpecies.push(species);
    }
    localStorage.setItem(USER_SPECIES_KEY, JSON.stringify(allUserSpecies));
  } catch (error) {
    console.error('Failed to save user species:', error);
  }
};

// Delete user-defined species
export const deleteUserSpecies = (speciesId: string): void => {
  try {
    const allUserSpecies = getUserSpecies();
    const filtered = allUserSpecies.filter(s => s.id !== speciesId);
    localStorage.setItem(USER_SPECIES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete user species:', error);
  }
};

// Combined species database (builtin + user-defined)
export const getSpeciesDatabase = (userId?: string): SpeciesInfo[] => {
  const userSpecies = getUserSpecies(userId);
  return [...builtinSpeciesDatabase, ...userSpecies];
};

// Legacy export for backward compatibility
export const speciesDatabase = builtinSpeciesDatabase;

// Helper function to get all names for a species
export const getAllNames = (species: SpeciesInfo, language: 'en' | 'cs'): string[] => {
  if (species.allNames) {
    return species.allNames[language];
  }
  // Fallback to legacy format - split by common separators
  const primaryName = species.commonNames[language];
  return primaryName.split(/\s*[\/,]\s*/).map(n => n.trim()).filter(Boolean);
};

// Get primary display name
export const getPrimaryName = (species: SpeciesInfo, language: 'en' | 'cs'): string => {
  if (species.allNames && species.allNames[language].length > 0) {
    return species.allNames[language][0];
  }
  // Get first name from legacy format
  const names = getAllNames(species, language);
  return names[0] || species.commonNames[language];
};

// Get all searchable names for a species (all languages + scientific)
export const getAllSearchableNames = (species: SpeciesInfo): string[] => {
  const names: string[] = [species.scientificName.toLowerCase()];
  
  // Add all English names
  getAllNames(species, 'en').forEach(n => names.push(n.toLowerCase()));
  // Add all Czech names
  getAllNames(species, 'cs').forEach(n => names.push(n.toLowerCase()));
  
  return [...new Set(names)]; // Remove duplicates
};

// Search function for species (searches both builtin and user species)
export const searchSpecies = (query: string, type?: 'fish' | 'plant', userId?: string): SpeciesInfo[] => {
  const allSpecies = getSpeciesDatabase(userId);
  const lowerQuery = query.toLowerCase();
  return allSpecies.filter(species => {
    if (type && species.type !== type) return false;
    
    // Search in all names
    const allNames = getAllSearchableNames(species);
    if (allNames.some(name => name.includes(lowerQuery))) return true;
    
    // Also search in family
    if (species.family.toLowerCase().includes(lowerQuery)) return true;
    
    return false;
  });
};

// Find species by name (for matching aquarium inhabitants)
export const findSpeciesByName = (name: string, type: 'fish' | 'plant', userId?: string): SpeciesInfo | undefined => {
  const allSpecies = getSpeciesDatabase(userId);
  const lowerName = name.toLowerCase();
  return allSpecies.find(species => {
    if (species.type !== type) return false;
    
    const allNames = getAllSearchableNames(species);
    return allNames.some(n => n.includes(lowerName));
  });
};

// Create a new user species from Wikipedia, FishBase, or manual input
export const createUserSpecies = (
  data: Partial<SpeciesInfo>,
  userId: string,
  source: 'user' | 'wikipedia' | 'fishbase' = 'user'
): SpeciesInfo => {
  const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Build allNames from commonNames if not provided
  let allNames = data.allNames;
  if (!allNames && data.commonNames) {
    allNames = {
      en: data.commonNames.en.split(/\s*[\/,]\s*/).map(n => n.trim()).filter(Boolean),
      cs: data.commonNames.cs.split(/\s*[\/,]\s*/).map(n => n.trim()).filter(Boolean),
    };
  }
  
  const newSpecies: SpeciesInfo = {
    id,
    scientificName: data.scientificName || 'Unknown',
    commonNames: data.commonNames || { en: 'Unknown', cs: 'Neznámý' },
    allNames,
    type: data.type || 'fish',
    family: data.family || 'Unknown',
    origin: data.origin || 'Unknown',
    source,
    userId,
    waterParams: data.waterParams || { tempMin: 22, tempMax: 28, phMin: 6.0, phMax: 8.0 },
    description: data.description || { en: '', cs: '' },
    careNotes: data.careNotes || { en: [], cs: [] },
    ...data,
  };
  return newSpecies;
};

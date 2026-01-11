// Scientific species database for fish and plants
// This provides detailed information about species for the Lexicon feature

export interface SpeciesInfo {
  id: string;
  scientificName: string;
  commonNames: {
    en: string;
    cs: string;
  };
  type: 'fish' | 'plant';
  family: string;
  origin: string;
  // Fish specific
  temperament?: 'peaceful' | 'semi-aggressive' | 'aggressive';
  minTankSize?: number; // liters
  maxSize?: number; // cm
  lifespan?: string;
  diet?: 'omnivore' | 'herbivore' | 'carnivore' | 'specialized';
  schooling?: boolean;
  minSchoolSize?: number;
  // Plant specific
  difficulty?: 'easy' | 'medium' | 'hard';
  growthRate?: 'slow' | 'medium' | 'fast';
  lightRequirement?: 'low' | 'medium' | 'high';
  co2Required?: boolean;
  propagation?: string;
  placement?: 'foreground' | 'midground' | 'background' | 'floating' | 'carpet';
  // Common
  waterParams: {
    tempMin: number;
    tempMax: number;
    phMin: number;
    phMax: number;
    ghMin?: number;
    ghMax?: number;
    khMin?: number;
    khMax?: number;
  };
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

// Sample species database - in a real app this would come from an API
export const speciesDatabase: SpeciesInfo[] = [
  // Fish
  {
    id: 'betta-splendens',
    scientificName: 'Betta splendens',
    commonNames: { en: 'Betta / Siamese Fighting Fish', cs: 'Bojovnice pestrá' },
    type: 'fish',
    family: 'Osphronemidae',
    origin: 'Southeast Asia (Thailand, Cambodia)',
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
  {
    id: 'paracheirodon-innesi',
    scientificName: 'Paracheirodon innesi',
    commonNames: { en: 'Neon Tetra', cs: 'Neonka obecná' },
    type: 'fish',
    family: 'Characidae',
    origin: 'South America (Amazon Basin)',
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
    id: 'corydoras-paleatus',
    scientificName: 'Corydoras paleatus',
    commonNames: { en: 'Peppered Corydoras', cs: 'Krunýřovec pepřový' },
    type: 'fish',
    family: 'Callichthyidae',
    origin: 'South America (Argentina, Brazil)',
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
      en: [
        'Requires sand or fine gravel substrate',
        'Keep in groups of 6+',
        'Provide sinking foods',
        'Nocturnal but can be active during day',
        'Hardy and great for beginners',
      ],
      cs: [
        'Vyžaduje písek nebo jemný štěrk',
        'Držte ve skupinách 6+',
        'Poskytněte potápějící se krmivo',
        'Noční, ale může být aktivní i ve dne',
        'Odolné a skvělé pro začátečníky',
      ],
    },
    compatibility: ['Most community fish', 'Other Corydoras', 'Tetras', 'Rasboras', 'Livebearers'],
  },
  {
    id: 'caridina-multidentata',
    scientificName: 'Caridina multidentata',
    commonNames: { en: 'Amano Shrimp', cs: 'Krevetka Amano' },
    type: 'fish', // Technically crustacean but for simplicity
    family: 'Atyidae',
    origin: 'Japan, Taiwan',
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
      en: [
        'Excellent algae control',
        'Sensitive to copper - avoid medications with copper',
        'Needs established tank with biofilm',
        'Cannot breed in freshwater',
        'Peaceful with all fish that won\'t eat them',
      ],
      cs: [
        'Výborná kontrola řas',
        'Citlivé na měď - vyhněte se lékům s mědí',
        'Potřebuje zaběhnuté akvárium s biofilmem',
        'Nemůže se množit ve sladké vodě',
        'Mírumilovné se všemi rybami, které je nesežerou',
      ],
    },
    compatibility: ['Small peaceful fish', 'Other shrimp', 'Snails'],
  },
  {
    id: 'poecilia-reticulata',
    scientificName: 'Poecilia reticulata',
    commonNames: { en: 'Guppy', cs: 'Živorodka duhová' },
    type: 'fish',
    family: 'Poeciliidae',
    origin: 'South America (Venezuela, Caribbean)',
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
      en: [
        'Very easy to breed',
        'Keep more females than males (2:1 ratio)',
        'Prefers harder, alkaline water',
        'Hardy and tolerates wide range of conditions',
        'Prolific breeders - population control may be needed',
      ],
      cs: [
        'Velmi snadno se množí',
        'Držte více samic než samců (poměr 2:1)',
        'Preferuje tvrdší, alkalickou vodu',
        'Odolné a snáší širokou škálu podmínek',
        'Plodné - může být nutná kontrola populace',
      ],
    },
    compatibility: ['Other peaceful livebearers', 'Corydoras', 'Small tetras', 'Shrimp'],
  },
  // Plants
  {
    id: 'anubias-barteri',
    scientificName: 'Anubias barteri',
    commonNames: { en: 'Anubias', cs: 'Anubias' },
    type: 'plant',
    family: 'Araceae',
    origin: 'West Africa',
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
      en: [
        'Attach to hardscape, do not bury rhizome',
        'Very low maintenance',
        'Can grow in low light conditions',
        'Slow growing - patience required',
        'Prone to algae on leaves in high light',
      ],
      cs: [
        'Připevněte na hardscape, nezakrývejte oddenek',
        'Velmi nízká údržba',
        'Může růst v podmínkách slabého osvětlení',
        'Pomalý růst - vyžaduje trpělivost',
        'Náchylné k řasám na listech při silném osvětlení',
      ],
    },
  },
  {
    id: 'cryptocoryne-wendtii',
    scientificName: 'Cryptocoryne wendtii',
    commonNames: { en: 'Cryptocoryne', cs: 'Kryptokorýna' },
    type: 'plant',
    family: 'Araceae',
    origin: 'Sri Lanka',
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
      en: [
        'May experience "crypt melt" after planting - leaves die but plant recovers',
        'Root feeder - benefits from root tabs',
        'Tolerates wide range of conditions',
        'Leave undisturbed once established',
        'Spreads through runners over time',
      ],
      cs: [
        'Může zažít "crypt melt" po zasazení - listy odumřou, ale rostlina se zotaví',
        'Kořenový příjem živin - prospívají kořenové tablety',
        'Snáší širokou škálu podmínek',
        'Po usazení nechte v klidu',
        'Šíří se výběžky v průběhu času',
      ],
    },
  },
  {
    id: 'vallisneria-spiralis',
    scientificName: 'Vallisneria spiralis',
    commonNames: { en: 'Italian Vallisneria', cs: 'Vallisnérie točivá' },
    type: 'plant',
    family: 'Hydrocharitaceae',
    origin: 'Tropical regions worldwide',
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
      en: [
        'Can grow very tall - may need trimming',
        'Spreads rapidly through runners',
        'Good nutrient absorption helps control algae',
        'Sensitive to Excel/liquid carbon',
        'Provides hiding spots for fish',
      ],
      cs: [
        'Může dorůst velmi vysoká - může vyžadovat zastřihování',
        'Rychle se šíří výběžky',
        'Dobrá absorpce živin pomáhá kontrolovat řasy',
        'Citlivá na Excel/tekutý uhlík',
        'Poskytuje úkryty pro ryby',
      ],
    },
  },
  {
    id: 'microsorum-pteropus',
    scientificName: 'Microsorum pteropus',
    commonNames: { en: 'Java Fern', cs: 'Javánská kapradina' },
    type: 'plant',
    family: 'Polypodiaceae',
    origin: 'Southeast Asia',
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
      en: [
        'Do not bury rhizome - attach to wood or rocks',
        'Produces baby plants on leaves',
        'Very low light tolerant',
        'Black spots may appear - this is normal spore development',
        'Hardy and nearly indestructible',
      ],
      cs: [
        'Nezakrývejte oddenek - připevněte na dřevo nebo kameny',
        'Produkuje dětské rostliny na listech',
        'Toleruje velmi slabé světlo',
        'Mohou se objevit černé skvrny - to je normální vývoj spór',
        'Odolná a téměř nezničitelná',
      ],
    },
  },
  {
    id: 'rotala-rotundifolia',
    scientificName: 'Rotala rotundifolia',
    commonNames: { en: 'Dwarf Rotala', cs: 'Rotala okrouhlolistá' },
    type: 'plant',
    family: 'Lythraceae',
    origin: 'Southeast Asia',
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
      en: [
        'Higher light brings out red coloration',
        'Regular trimming encourages bushier growth',
        'Benefits from CO2 but not required',
        'Plant in groups for best effect',
        'Fast growth makes it a good nutrient sponge',
      ],
      cs: [
        'Vyšší světlo vyvolá červené zbarvení',
        'Pravidelné zastřihování podporuje hustější růst',
        'Prospívá CO2, ale není nutné',
        'Sázejte ve skupinách pro nejlepší efekt',
        'Rychlý růst z ní dělá dobrou houbičku na živiny',
      ],
    },
  },
  {
    id: 'eleocharis-parvula',
    scientificName: 'Eleocharis parvula',
    commonNames: { en: 'Dwarf Hairgrass', cs: 'Bahenka trpasličí' },
    type: 'plant',
    family: 'Cyperaceae',
    origin: 'Worldwide',
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
      en: [
        'Requires high light for carpet formation',
        'CO2 injection recommended',
        'Plant in small clumps for faster spread',
        'Nutrient-rich substrate beneficial',
        'May take time to establish',
      ],
      cs: [
        'Vyžaduje vysoké světlo pro tvorbu koberce',
        'Doporučeno vstřikování CO2',
        'Sázejte v malých trsech pro rychlejší rozšíření',
        'Substrát bohatý na živiny je prospěšný',
        'Může trvat, než se usadí',
      ],
    },
  },
];

// Search function for species
export const searchSpecies = (query: string, type?: 'fish' | 'plant'): SpeciesInfo[] => {
  const lowerQuery = query.toLowerCase();
  return speciesDatabase.filter(species => {
    if (type && species.type !== type) return false;
    return (
      species.scientificName.toLowerCase().includes(lowerQuery) ||
      species.commonNames.en.toLowerCase().includes(lowerQuery) ||
      species.commonNames.cs.toLowerCase().includes(lowerQuery) ||
      species.family.toLowerCase().includes(lowerQuery)
    );
  });
};

// Find species by name (for matching aquarium inhabitants)
export const findSpeciesByName = (name: string, type: 'fish' | 'plant'): SpeciesInfo | undefined => {
  const lowerName = name.toLowerCase();
  return speciesDatabase.find(species => {
    if (species.type !== type) return false;
    return (
      species.scientificName.toLowerCase().includes(lowerName) ||
      species.commonNames.en.toLowerCase().includes(lowerName) ||
      species.commonNames.cs.toLowerCase().includes(lowerName)
    );
  });
};

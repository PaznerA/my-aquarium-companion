// FishBase API integration for aquarium fish species
// API docs: https://fishbase.ropensci.org/

export interface FishBaseSpecies {
  id: number;
  scientificName: string;
  commonName?: string;
  family?: string;
  genus?: string;
  species?: string;
  maxLengthCm?: number;
  tempMin?: number;
  tempMax?: number;
  phMin?: number;
  phMax?: number;
  freshwater?: boolean;
  saltwater?: boolean;
  aquarium?: boolean;
  dangerous?: string;
}

export interface FishBaseSearchResult {
  id: number;
  label: string;
  labelHtml: string;
  scientificName: string;
  commonName?: string;
  family?: string;
  genus?: string;
  maxLength?: number;
  aquarium?: boolean;
}

// Cache for API results
const fishbaseCache = new Map<string, { results: FishBaseSearchResult[]; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Search FishBase for fish species
 * Uses the species endpoint with filtering
 */
export async function searchFishBase(query: string): Promise<FishBaseSearchResult[]> {
  if (!query || query.length < 2) return [];

  const cacheKey = query.toLowerCase();
  const cached = fishbaseCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.results;
  }

  try {
    // FishBase API - search by genus/species name
    const url = new URL('https://fishbase.ropensci.org/species');
    url.searchParams.set('Genus', query);
    url.searchParams.set('limit', '10');
    url.searchParams.set('fields', 'SpecCode,Genus,Species,FBname,Family,Length,Aquarium,Fresh,Saltwater');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Try species name search as fallback
      const speciesUrl = new URL('https://fishbase.ropensci.org/species');
      speciesUrl.searchParams.set('Species', query);
      speciesUrl.searchParams.set('limit', '10');
      speciesUrl.searchParams.set('fields', 'SpecCode,Genus,Species,FBname,Family,Length,Aquarium,Fresh,Saltwater');
      
      const speciesResponse = await fetch(speciesUrl.toString(), {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      if (!speciesResponse.ok) {
        console.warn('FishBase API error:', speciesResponse.status);
        return [];
      }
      
      const speciesData = await speciesResponse.json();
      return processFishBaseResponse(speciesData.data || [], cacheKey);
    }

    const data = await response.json();
    return processFishBaseResponse(data.data || [], cacheKey);
  } catch (error) {
    console.warn('FishBase search error:', error);
    return [];
  }
}

function processFishBaseResponse(data: any[], cacheKey: string): FishBaseSearchResult[] {
  const results: FishBaseSearchResult[] = data
    .filter((item: any) => item.Genus && item.Species)
    .map((item: any) => {
      const scientificName = `${item.Genus} ${item.Species}`;
      const commonName = item.FBname;
      
      return {
        id: item.SpecCode,
        label: commonName ? `${scientificName} (${commonName})` : scientificName,
        labelHtml: `<i>${scientificName}</i>${commonName ? ` <span class="text-muted-foreground">(${commonName})</span>` : ''}`,
        scientificName,
        commonName,
        family: item.Family,
        genus: item.Genus,
        maxLength: item.Length ? parseFloat(item.Length) : undefined,
        aquarium: item.Aquarium === -1 || item.Aquarium === 'aquarium',
      };
    });

  // Deduplicate
  const seen = new Set<string>();
  const uniqueResults = results.filter(r => {
    const key = r.scientificName.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  fishbaseCache.set(cacheKey, { results: uniqueResults, timestamp: Date.now() });
  return uniqueResults;
}

/**
 * Get detailed species info from FishBase
 */
export async function getFishBaseDetails(specCode: number): Promise<FishBaseSpecies | null> {
  try {
    const response = await fetch(`https://fishbase.ropensci.org/species/${specCode}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      console.warn('FishBase detail error:', response.status);
      return null;
    }

    const data = await response.json();
    const item = data.data?.[0];
    
    if (!item) return null;

    return {
      id: item.SpecCode,
      scientificName: `${item.Genus} ${item.Species}`,
      commonName: item.FBname,
      family: item.Family,
      genus: item.Genus,
      species: item.Species,
      maxLengthCm: item.Length ? parseFloat(item.Length) : undefined,
      tempMin: item.TempMin ? parseFloat(item.TempMin) : undefined,
      tempMax: item.TempMax ? parseFloat(item.TempMax) : undefined,
      phMin: item.pHMin ? parseFloat(item.pHMin) : undefined,
      phMax: item.pHMax ? parseFloat(item.pHMax) : undefined,
      freshwater: item.Fresh === -1,
      saltwater: item.Saltwater === -1,
      aquarium: item.Aquarium === -1,
      dangerous: item.Dangerous,
    };
  } catch (error) {
    console.warn('FishBase detail error:', error);
    return null;
  }
}

/**
 * Get common names for a species from FishBase
 */
export async function getFishBaseCommonNames(specCode: number): Promise<{ name: string; language: string }[]> {
  try {
    const response = await fetch(`https://fishbase.ropensci.org/comnames?SpecCode=${specCode}&limit=20`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return (data.data || []).map((item: any) => ({
      name: item.ComName,
      language: item.Language,
    }));
  } catch (error) {
    console.warn('FishBase common names error:', error);
    return [];
  }
}

/**
 * Clear the FishBase cache
 */
export function clearFishBaseCache(): void {
  fishbaseCache.clear();
}

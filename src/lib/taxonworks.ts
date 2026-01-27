// Taxonomy API integration for scientific name autocomplete
// Using GBIF (Global Biodiversity Information Facility) - free public API

export interface TaxonWorksSuggestion {
  id: number;
  label: string;
  labelHtml: string;
  scientificName: string;
  rank?: string;
  family?: string;
}

// Cache for API results
const taxonCache = new Map<string, { results: TaxonWorksSuggestion[]; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Search GBIF for taxon names
 * Uses the species/suggest endpoint for fast suggestions
 * https://www.gbif.org/developer/species
 */
export async function searchTaxonWorks(
  query: string,
  type?: 'fish' | 'plant'
): Promise<TaxonWorksSuggestion[]> {
  if (!query || query.length < 2) return [];

  const cacheKey = `${query}-${type || 'all'}`;
  const cached = taxonCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.results;
  }

  try {
    // Build GBIF API URL
    const url = new URL('https://api.gbif.org/v1/species/suggest');
    url.searchParams.set('q', query);
    url.searchParams.set('limit', '10');
    
    // Filter by kingdom based on type
    if (type === 'plant') {
      url.searchParams.set('kingdom', 'Plantae');
    } else if (type === 'fish') {
      url.searchParams.set('kingdom', 'Animalia');
      // Fish are in phylum Chordata, class Actinopterygii (mostly)
      url.searchParams.set('phylum', 'Chordata');
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('GBIF API error:', response.status);
      return [];
    }

    const data = await response.json();

    // Transform GBIF response to our format
    const results: TaxonWorksSuggestion[] = (data || [])
      .filter((item: { rank?: string }) => {
        // Filter to species and genus level only
        const rank = item.rank?.toLowerCase();
        return rank === 'species' || rank === 'genus';
      })
      .map((item: {
        key: number;
        scientificName: string;
        canonicalName?: string;
        rank?: string;
        family?: string;
        authorship?: string;
      }) => {
        const displayName = item.canonicalName || item.scientificName;
        const authorship = item.authorship ? ` <span class="text-muted-foreground">${item.authorship}</span>` : '';
        
        return {
          id: item.key,
          label: displayName,
          labelHtml: `<i>${displayName}</i>${authorship}`,
          scientificName: displayName,
          rank: item.rank?.toLowerCase(),
          family: item.family,
        };
      });

    // Deduplicate by scientific name
    const seen = new Set<string>();
    const uniqueResults = results.filter(r => {
      const key = r.scientificName.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    taxonCache.set(cacheKey, { results: uniqueResults, timestamp: Date.now() });
    return uniqueResults;
  } catch (error) {
    console.warn('GBIF search error:', error);
    return [];
  }
}

/**
 * Get detailed information about a specific taxon from GBIF
 */
export async function getTaxonDetails(
  id: number
): Promise<{
  scientificName: string;
  rank: string;
  family?: string;
  parentName?: string;
  author?: string;
  year?: number;
} | null> {
  try {
    const response = await fetch(`https://api.gbif.org/v1/species/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('GBIF API error:', response.status);
      return null;
    }

    const data = await response.json();

    return {
      scientificName: data.canonicalName || data.scientificName,
      rank: data.rank || 'unknown',
      family: data.family,
      parentName: data.parent,
      author: data.authorship,
      year: data.publishedIn ? parseInt(data.publishedIn) : undefined,
    };
  } catch (error) {
    console.warn('GBIF detail error:', error);
    return null;
  }
}

/**
 * Search taxonomy databases
 */
export async function searchTaxonomyDatabases(
  query: string,
  type?: 'fish' | 'plant'
): Promise<TaxonWorksSuggestion[]> {
  return searchTaxonWorks(query, type);
}

/**
 * Clear the taxonomy cache
 */
export function clearTaxonCache(): void {
  taxonCache.clear();
}

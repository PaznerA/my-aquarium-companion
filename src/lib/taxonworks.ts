// TaxonWorks API integration for scientific name autocomplete
// API docs: https://api.taxonworks.org/

export interface TaxonWorksSuggestion {
  id: number;
  label: string;
  labelHtml: string;
  scientificName: string;
  rank?: string;
  family?: string;
}

export interface TaxonWorksConfig {
  baseUrl: string;
  projectToken?: string;
}

// Default configuration - using Species File Group public instance
const DEFAULT_CONFIG: TaxonWorksConfig = {
  baseUrl: 'https://sfg.taxonworks.org/api/v1',
  // Public project token for Species File Group (fish, invertebrates)
  projectToken: undefined,
};

// Cache for API results
const taxonCache = new Map<string, { results: TaxonWorksSuggestion[]; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Clean HTML tags from label
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Extract scientific name from TaxonWorks label
 * The label format is typically "Genus species Author, Year"
 */
function extractScientificName(label: string): string {
  // Remove HTML first
  const clean = stripHtml(label);
  
  // Scientific name is usually the first 2 words (Genus species) or 1 word (Genus)
  // Authors and years come after
  const parts = clean.split(/\s+/);
  
  // Check if second word is lowercase (species epithet) or uppercase (likely author)
  if (parts.length >= 2) {
    const secondWord = parts[1];
    if (secondWord && /^[a-z]/.test(secondWord)) {
      // It's a species epithet
      return `${parts[0]} ${parts[1]}`;
    }
  }
  
  // Just return the first word (genus or higher taxon)
  return parts[0] || clean;
}

/**
 * Search TaxonWorks for taxon names
 * Uses the autocomplete endpoint for fast suggestions
 */
export async function searchTaxonWorks(
  query: string,
  type?: 'fish' | 'plant',
  config: TaxonWorksConfig = DEFAULT_CONFIG
): Promise<TaxonWorksSuggestion[]> {
  if (!query || query.length < 2) return [];

  const cacheKey = `${query}-${type || 'all'}`;
  const cached = taxonCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.results;
  }

  try {
    // Build URL with query parameters
    const url = new URL(`${config.baseUrl}/taxon_names/autocomplete`);
    url.searchParams.set('term', query);
    
    if (config.projectToken) {
      url.searchParams.set('project_token', config.projectToken);
    }

    // Add type-specific filters if available
    // Note: TaxonWorks uses nomenclatural_code for classification
    // ICN = International Code of Nomenclature for algae, fungi, and plants
    // ICZN = International Code of Zoological Nomenclature
    if (type === 'plant') {
      url.searchParams.set('nomenclatural_code', 'icn');
    } else if (type === 'fish') {
      url.searchParams.set('nomenclatural_code', 'iczn');
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('TaxonWorks API error:', response.status);
      return [];
    }

    const data = await response.json();

    // Transform response to our format
    const results: TaxonWorksSuggestion[] = (data || []).map((item: {
      id: number;
      label: string;
      label_html?: string;
      rank?: string;
      family?: string;
    }) => ({
      id: item.id,
      label: item.label,
      labelHtml: item.label_html || item.label,
      scientificName: extractScientificName(item.label),
      rank: item.rank,
      family: item.family,
    }));

    taxonCache.set(cacheKey, { results, timestamp: Date.now() });
    return results;
  } catch (error) {
    console.warn('TaxonWorks search error:', error);
    return [];
  }
}

/**
 * Get detailed information about a specific taxon
 */
export async function getTaxonDetails(
  id: number,
  config: TaxonWorksConfig = DEFAULT_CONFIG
): Promise<{
  scientificName: string;
  rank: string;
  family?: string;
  parentName?: string;
  author?: string;
  year?: number;
} | null> {
  try {
    const url = new URL(`${config.baseUrl}/taxon_names/${id}`);
    
    if (config.projectToken) {
      url.searchParams.set('project_token', config.projectToken);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('TaxonWorks API error:', response.status);
      return null;
    }

    const data = await response.json();

    return {
      scientificName: data.cached || data.name,
      rank: data.rank || 'unknown',
      family: data.cached_valid_taxon_name_id ? undefined : data.family,
      parentName: data.parent?.cached,
      author: data.cached_author_year,
      year: data.year_of_publication,
    };
  } catch (error) {
    console.warn('TaxonWorks detail error:', error);
    return null;
  }
}

/**
 * Search multiple taxonomy databases in parallel
 * This provides better coverage for different taxa
 */
export async function searchTaxonomyDatabases(
  query: string,
  type?: 'fish' | 'plant'
): Promise<TaxonWorksSuggestion[]> {
  // For now, just use the main TaxonWorks instance
  // In the future, we could add GBIF, ITIS, WoRMS, etc.
  const results = await searchTaxonWorks(query, type);
  
  // Deduplicate by scientific name
  const seen = new Set<string>();
  return results.filter(r => {
    const key = r.scientificName.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Clear the TaxonWorks cache
 */
export function clearTaxonCache(): void {
  taxonCache.clear();
}

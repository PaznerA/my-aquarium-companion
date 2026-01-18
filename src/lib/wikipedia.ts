// Wikipedia REST API service for species information lookup

export interface WikipediaResult {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  originalimage?: {
    source: string;
    width: number;
    height: number;
  };
  content_urls?: {
    desktop: {
      page: string;
    };
    mobile: {
      page: string;
    };
  };
  description?: string;
}

export interface WikipediaSearchResult {
  found: boolean;
  data?: WikipediaResult;
  error?: string;
  searchedTerms?: string[];
}

/**
 * Fetch species information from Wikipedia REST API
 * Tries multiple search terms: scientific name, common name in EN, common name in CS
 */
export async function fetchWikipediaInfo(
  scientificName?: string,
  commonNameEn?: string,
  commonNameCs?: string
): Promise<WikipediaSearchResult> {
  const searchTerms: string[] = [];
  
  // Priority order: scientific name first (most reliable), then English, then Czech
  if (scientificName) searchTerms.push(scientificName);
  if (commonNameEn) searchTerms.push(commonNameEn);
  if (commonNameCs) searchTerms.push(commonNameCs);

  if (searchTerms.length === 0) {
    return { found: false, error: 'No search terms provided', searchedTerms: [] };
  }

  for (const term of searchTerms) {
    try {
      const result = await fetchWikipediaSummary(term);
      if (result) {
        return { found: true, data: result, searchedTerms: searchTerms };
      }
    } catch (error) {
      console.warn(`Wikipedia search failed for "${term}":`, error);
    }
  }

  // If English Wikipedia didn't work for Czech name, try Czech Wikipedia
  if (commonNameCs) {
    try {
      const result = await fetchWikipediaSummary(commonNameCs, 'cs');
      if (result) {
        return { found: true, data: result, searchedTerms: searchTerms };
      }
    } catch (error) {
      console.warn(`Czech Wikipedia search failed for "${commonNameCs}":`, error);
    }
  }

  return { 
    found: false, 
    error: 'No Wikipedia article found', 
    searchedTerms: searchTerms 
  };
}

/**
 * Fetch summary from Wikipedia REST API for a single term
 */
async function fetchWikipediaSummary(
  title: string,
  lang: 'en' | 'cs' = 'en'
): Promise<WikipediaResult | null> {
  // Normalize the title for URL
  const normalizedTitle = title
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[()]/g, '');

  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(normalizedTitle)}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      // Wikipedia API requires a User-Agent
      'Api-User-Agent': 'AquaLogApp/1.0 (aquarium-management-app)',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // Article not found, try next term
    }
    throw new Error(`Wikipedia API error: ${response.status}`);
  }

  const data = await response.json();
  
  // Check if this is a disambiguation page or missing article
  if (data.type === 'disambiguation' || data.type === 'not_found') {
    return null;
  }

  return data as WikipediaResult;
}

/**
 * Direct search by any name (for manual search)
 */
export async function searchWikipedia(query: string): Promise<WikipediaSearchResult> {
  return fetchWikipediaInfo(query);
}

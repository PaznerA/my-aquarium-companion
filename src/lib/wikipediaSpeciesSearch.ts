// Wikipedia-based species search for autocomplete fallback
// This provides species information from Wikipedia when not found in local database

import { fetchWikipediaInfo, type WikipediaResult } from './wikipedia';
import type { SpeciesInfo } from './speciesData';

export interface WikipediaSpeciesSuggestion {
  title: string;
  extract: string;
  thumbnail?: string;
  url?: string;
}

// Cache for Wikipedia searches to reduce API calls
const wikiCache = new Map<string, { result: WikipediaSpeciesSuggestion | null; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Search Wikipedia for species information
 * Returns a suggestion object if found, null otherwise
 */
export async function searchWikipediaForSpecies(
  query: string,
  type?: 'fish' | 'plant'
): Promise<WikipediaSpeciesSuggestion | null> {
  if (!query || query.length < 3) return null;

  const cacheKey = `${query}-${type || 'all'}`;
  const cached = wikiCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.result;
  }

  try {
    // Add type-specific search terms for better results
    let searchQuery = query;
    if (type === 'fish') {
      // Try with "fish" suffix if the query doesn't already contain it
      if (!query.toLowerCase().includes('fish')) {
        searchQuery = `${query} fish`;
      }
    } else if (type === 'plant') {
      if (!query.toLowerCase().includes('plant') && !query.toLowerCase().includes('aquatic')) {
        searchQuery = `${query} aquarium plant`;
      }
    }

    const result = await fetchWikipediaInfo(searchQuery);
    
    if (result.found && result.data) {
      const suggestion: WikipediaSpeciesSuggestion = {
        title: result.data.title,
        extract: result.data.extract || '',
        thumbnail: result.data.thumbnail?.source,
        url: result.data.content_urls?.desktop?.page,
      };
      
      wikiCache.set(cacheKey, { result: suggestion, timestamp: Date.now() });
      return suggestion;
    }

    // Also try the original query without type suffix
    if (searchQuery !== query) {
      const fallbackResult = await fetchWikipediaInfo(query);
      if (fallbackResult.found && fallbackResult.data) {
        const suggestion: WikipediaSpeciesSuggestion = {
          title: fallbackResult.data.title,
          extract: fallbackResult.data.extract || '',
          thumbnail: fallbackResult.data.thumbnail?.source,
          url: fallbackResult.data.content_urls?.desktop?.page,
        };
        
        wikiCache.set(cacheKey, { result: suggestion, timestamp: Date.now() });
        return suggestion;
      }
    }

    wikiCache.set(cacheKey, { result: null, timestamp: Date.now() });
    return null;
  } catch (error) {
    console.warn('Wikipedia species search error:', error);
    wikiCache.set(cacheKey, { result: null, timestamp: Date.now() });
    return null;
  }
}

/**
 * Convert Wikipedia suggestion to partial SpeciesInfo
 * Used when user wants to add a Wikipedia result to their species list
 */
export function wikiSuggestionToSpeciesInfo(
  suggestion: WikipediaSpeciesSuggestion,
  type: 'fish' | 'plant'
): Partial<SpeciesInfo> {
  return {
    scientificName: suggestion.title,
    commonNames: {
      en: suggestion.title,
      cs: suggestion.title, // User should update this
    },
    type,
    family: 'Unknown',
    origin: 'Unknown',
    description: {
      en: suggestion.extract,
      cs: '',
    },
    imageUrl: suggestion.thumbnail,
    waterParams: {
      tempMin: 22,
      tempMax: 28,
      phMin: 6.0,
      phMax: 8.0,
    },
    careNotes: {
      en: [],
      cs: [],
    },
  };
}

/**
 * Clear the Wikipedia search cache
 */
export function clearWikiCache(): void {
  wikiCache.clear();
}

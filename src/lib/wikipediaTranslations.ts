// Wikipedia Language Links API for fetching translations of species names

export interface WikipediaTranslation {
  lang: string;
  langname: string;
  title: string;
}

export interface TranslationsResult {
  en: string[];
  cs: string[];
  scientificName?: string;
  description?: {
    en: string;
    cs: string;
  };
}

/**
 * Fetch language links (translations) for a Wikipedia article
 * This uses the MediaWiki API to get the titles in different languages
 */
export async function fetchWikipediaTranslations(
  searchQuery: string,
  sourceLang: 'en' | 'cs' = 'en'
): Promise<TranslationsResult> {
  const result: TranslationsResult = {
    en: [],
    cs: [],
  };

  try {
    // First, get the English Wikipedia article
    const enSummary = await fetchSummary(searchQuery, 'en');
    if (!enSummary) {
      // Try Czech Wikipedia
      const csSummary = await fetchSummary(searchQuery, 'cs');
      if (csSummary) {
        result.cs.push(csSummary.title);
        result.description = { en: '', cs: csSummary.extract || '' };
        
        // Try to find English version via langlinks
        const langLinks = await fetchLangLinks(csSummary.title, 'cs');
        const enLink = langLinks.find(l => l.lang === 'en');
        if (enLink) {
          result.en.push(enLink.title);
          // Fetch English description
          const enDesc = await fetchSummary(enLink.title, 'en');
          if (enDesc) {
            result.description.en = enDesc.extract || '';
          }
        }
      }
      return result;
    }

    // We found English article
    result.en.push(enSummary.title);
    result.scientificName = extractScientificName(enSummary.extract || '');
    result.description = { 
      en: enSummary.extract || '', 
      cs: '' 
    };

    // Fetch language links to get Czech translation
    const langLinks = await fetchLangLinks(enSummary.title, 'en');
    const csLink = langLinks.find(l => l.lang === 'cs');
    if (csLink) {
      result.cs.push(csLink.title);
      // Fetch Czech description
      const csDesc = await fetchSummary(csLink.title, 'cs');
      if (csDesc) {
        result.description.cs = csDesc.extract || '';
      }
    }

    // Try to find alternative common names from the extract
    const alternativeNames = extractAlternativeNames(enSummary.extract || '', 'en');
    result.en.push(...alternativeNames.filter(n => !result.en.includes(n)));

    return result;
  } catch (error) {
    console.error('Error fetching Wikipedia translations:', error);
    return result;
  }
}

/**
 * Fetch summary from Wikipedia REST API
 */
async function fetchSummary(title: string, lang: 'en' | 'cs'): Promise<{
  title: string;
  extract?: string;
} | null> {
  const normalizedTitle = title.trim().replace(/\s+/g, '_');
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(normalizedTitle)}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Api-User-Agent': 'AquaLogApp/1.0 (aquarium-management-app)',
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (data.type === 'disambiguation' || data.type === 'not_found') {
    return null;
  }

  return {
    title: data.title,
    extract: data.extract,
  };
}

/**
 * Fetch language links using MediaWiki Action API
 */
async function fetchLangLinks(title: string, lang: 'en' | 'cs'): Promise<WikipediaTranslation[]> {
  const normalizedTitle = title.trim().replace(/\s+/g, '_');
  const url = `https://${lang}.wikipedia.org/w/api.php?` + new URLSearchParams({
    action: 'query',
    titles: normalizedTitle,
    prop: 'langlinks',
    lllimit: '50',
    format: 'json',
    origin: '*',
  });

  const response = await fetch(url);
  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const pages = data.query?.pages;
  if (!pages) return [];

  const pageId = Object.keys(pages)[0];
  const langlinks = pages[pageId]?.langlinks || [];

  return langlinks.map((ll: { lang: string; '*': string }) => ({
    lang: ll.lang,
    langname: ll.lang,
    title: ll['*'],
  }));
}

/**
 * Try to extract scientific name from Wikipedia extract
 * Usually appears in italics or parentheses at the beginning
 */
function extractScientificName(extract: string): string | undefined {
  // Look for patterns like "The neon tetra (Paracheirodon innesi)" or similar
  const patterns = [
    /\(([A-Z][a-z]+ [a-z]+)\)/,  // (Genus species)
    /\(([A-Z][a-z]+ [a-z]+ [a-z]+)\)/, // (Genus species subspecies)
  ];

  for (const pattern of patterns) {
    const match = extract.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return undefined;
}

/**
 * Extract alternative common names from Wikipedia extract
 */
function extractAlternativeNames(extract: string, lang: 'en' | 'cs'): string[] {
  const names: string[] = [];

  // Look for patterns like "also known as X, Y, and Z"
  const alsoKnownAs = extract.match(/also (?:known|called) as ([^.]+)/i);
  if (alsoKnownAs) {
    const namesPart = alsoKnownAs[1];
    const splitNames = namesPart.split(/,\s*(?:and\s+)?|(?:\s+and\s+)/);
    names.push(...splitNames.map(n => n.trim()).filter(n => n.length > 0 && n.length < 50));
  }

  // Look for "or X" pattern
  const orPattern = extract.match(/,\s*or\s+([^,.\(]+)/i);
  if (orPattern) {
    const name = orPattern[1].trim();
    if (name.length > 0 && name.length < 50) {
      names.push(name);
    }
  }

  return names.slice(0, 5); // Limit to 5 alternative names
}

/**
 * Search Wikipedia and get translations in one call
 */
export async function searchWikipediaWithTranslations(
  query: string
): Promise<TranslationsResult & { 
  found: boolean; 
  thumbnail?: string;
  wikiUrl?: string;
}> {
  const translations = await fetchWikipediaTranslations(query);
  
  const found = translations.en.length > 0 || translations.cs.length > 0;
  
  // Try to get thumbnail
  let thumbnail: string | undefined;
  let wikiUrl: string | undefined;
  
  if (translations.en.length > 0) {
    try {
      const normalizedTitle = translations.en[0].trim().replace(/\s+/g, '_');
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(normalizedTitle)}`;
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Api-User-Agent': 'AquaLogApp/1.0 (aquarium-management-app)',
        },
      });
      if (response.ok) {
        const data = await response.json();
        thumbnail = data.thumbnail?.source;
        wikiUrl = data.content_urls?.desktop?.page;
      }
    } catch (e) {
      // Ignore thumbnail fetch errors
    }
  }

  return {
    ...translations,
    found,
    thumbnail,
    wikiUrl,
  };
}

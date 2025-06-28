// Geo-location utilities for country preselection
// Uses a simple IP-based geolocation approach with fallbacks

export interface CountryInfo {
  code: string;
  name: string;
  neighbors: string[];
}

// European country mapping with neighbors
export const europeanCountries: Record<string, CountryInfo> = {
  'AT': { code: 'AT', name: 'Austria', neighbors: ['DE', 'CH', 'IT', 'SI', 'HU', 'CZ', 'SK'] },
  'BE': { code: 'BE', name: 'Belgium', neighbors: ['NL', 'DE', 'FR'] },
  'BG': { code: 'BG', name: 'Bulgaria', neighbors: ['RO', 'RS', 'EL', 'TR'] },
  'CH': { code: 'CH', name: 'Switzerland', neighbors: ['DE', 'AT', 'IT', 'FR'] },
  'CY': { code: 'CY', name: 'Cyprus', neighbors: ['EL', 'TR'] },
  'CZ': { code: 'CZ', name: 'Czech Republic', neighbors: ['DE', 'AT', 'SK', 'PL'] },
  'DE': { code: 'DE', name: 'Germany', neighbors: ['DK', 'PL', 'CZ', 'AT', 'CH', 'FR', 'BE', 'NL'] },
  'DK': { code: 'DK', name: 'Denmark', neighbors: ['DE', 'SE', 'NO'] },
  'EE': { code: 'EE', name: 'Estonia', neighbors: ['LV', 'FI'] },
  'EL': { code: 'EL', name: 'Greece', neighbors: ['BG', 'MK', 'AL', 'TR', 'CY'] },
  'ES': { code: 'ES', name: 'Spain', neighbors: ['FR', 'PT'] },
  'FI': { code: 'FI', name: 'Finland', neighbors: ['SE', 'NO', 'EE'] },
  'FR': { code: 'FR', name: 'France', neighbors: ['ES', 'CH', 'IT', 'DE', 'BE'] },
  'HR': { code: 'HR', name: 'Croatia', neighbors: ['SI', 'HU', 'RS', 'BA'] },
  'HU': { code: 'HU', name: 'Hungary', neighbors: ['AT', 'SK', 'RO', 'RS', 'HR', 'SI'] },
  'IE': { code: 'IE', name: 'Ireland', neighbors: ['UK'] },
  'IS': { code: 'IS', name: 'Iceland', neighbors: ['NO', 'DK'] },
  'IT': { code: 'IT', name: 'Italy', neighbors: ['FR', 'CH', 'AT', 'SI'] },
  'LT': { code: 'LT', name: 'Lithuania', neighbors: ['LV', 'PL', 'BY'] },
  'LU': { code: 'LU', name: 'Luxembourg', neighbors: ['BE', 'FR', 'DE'] },
  'LV': { code: 'LV', name: 'Latvia', neighbors: ['EE', 'LT'] },
  'MT': { code: 'MT', name: 'Malta', neighbors: ['IT'] },
  'NL': { code: 'NL', name: 'Netherlands', neighbors: ['DE', 'BE'] },
  'NO': { code: 'NO', name: 'Norway', neighbors: ['SE', 'FI', 'DK', 'IS'] },
  'PL': { code: 'PL', name: 'Poland', neighbors: ['DE', 'CZ', 'SK', 'LT'] },
  'PT': { code: 'PT', name: 'Portugal', neighbors: ['ES'] },
  'RO': { code: 'RO', name: 'Romania', neighbors: ['HU', 'RS', 'BG'] },
  'RS': { code: 'RS', name: 'Serbia', neighbors: ['HU', 'RO', 'BG', 'HR'] },
  'SE': { code: 'SE', name: 'Sweden', neighbors: ['NO', 'FI', 'DK'] },
  'SI': { code: 'SI', name: 'Slovenia', neighbors: ['AT', 'IT', 'HR', 'HU'] },
  'SK': { code: 'SK', name: 'Slovakia', neighbors: ['CZ', 'AT', 'HU', 'PL'] },
  'TR': { code: 'TR', name: 'Turkey', neighbors: ['BG', 'EL', 'CY'] },
  'UK': { code: 'UK', name: 'United Kingdom', neighbors: ['IE', 'FR', 'BE', 'NL'] }
};

// Fallback mapping for common country codes to our dataset codes
const countryCodeMapping: Record<string, string> = {
  'GB': 'UK',
  'GR': 'EL',
  'BY': 'BY', // Belarus (not in our dataset but might be detected)
  'UA': 'UA', // Ukraine (not in our dataset but might be detected)
  'MK': 'MK', // North Macedonia (not in our dataset but might be detected)
  'AL': 'AL', // Albania (not in our dataset but might be detected)
  'BA': 'BA', // Bosnia (not in our dataset but might be detected)
};

// Get user's country using multiple detection methods
export const detectUserCountry = async (): Promise<string | null> => {
  try {
    // Method 1: Try timezone-based detection first (fastest)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneCountry = getCountryFromTimezone(timezone);
    if (timezoneCountry && europeanCountries[timezoneCountry]) {
      console.log('🌍 Country detected via timezone:', timezoneCountry);
      return timezoneCountry;
    }

    // Method 2: Try IP-based geolocation (requires internet)
    const ipCountry = await getCountryFromIP();
    if (ipCountry && europeanCountries[ipCountry]) {
      console.log('🌍 Country detected via IP:', ipCountry);
      return ipCountry;
    }

    // Method 3: Try browser language as last resort
    const langCountry = getCountryFromLanguage();
    if (langCountry && europeanCountries[langCountry]) {
      console.log('🌍 Country detected via language:', langCountry);
      return langCountry;
    }

    console.log('🌍 No European country detected, using default selection');
    return null;
  } catch (error) {
    console.log('🌍 Geo-detection failed, using default selection:', error);
    return null;
  }
};

// Get country from timezone (fast, works offline)
const getCountryFromTimezone = (timezone: string): string | null => {
  const timezoneMap: Record<string, string> = {
    'Europe/Vienna': 'AT',
    'Europe/Brussels': 'BE',
    'Europe/Sofia': 'BG',
    'Europe/Zurich': 'CH',
    'Asia/Nicosia': 'CY',
    'Europe/Prague': 'CZ',
    'Europe/Berlin': 'DE',
    'Europe/Copenhagen': 'DK',
    'Europe/Tallinn': 'EE',
    'Europe/Athens': 'EL',
    'Europe/Madrid': 'ES',
    'Europe/Helsinki': 'FI',
    'Europe/Paris': 'FR',
    'Europe/Zagreb': 'HR',
    'Europe/Budapest': 'HU',
    'Europe/Dublin': 'IE',
    'Atlantic/Reykjavik': 'IS',
    'Europe/Rome': 'IT',
    'Europe/Vilnius': 'LT',
    'Europe/Luxembourg': 'LU',
    'Europe/Riga': 'LV',
    'Europe/Malta': 'MT',
    'Europe/Amsterdam': 'NL',
    'Europe/Oslo': 'NO',
    'Europe/Warsaw': 'PL',
    'Europe/Lisbon': 'PT',
    'Europe/Bucharest': 'RO',
    'Europe/Belgrade': 'RS',
    'Europe/Stockholm': 'SE',
    'Europe/Ljubljana': 'SI',
    'Europe/Bratislava': 'SK',
    'Europe/Istanbul': 'TR',
    'Europe/London': 'UK'
  };

  return timezoneMap[timezone] || null;
};

// Get country from IP using a free geolocation service
const getCountryFromIP = async (): Promise<string | null> => {
  try {
    // Use ipapi.co (free, no API key required, HTTPS)
    const response = await fetch('https://ipapi.co/country_code/', {
      method: 'GET',
      headers: { 'Accept': 'text/plain' }
    });
    
    if (response.ok) {
      const countryCode = (await response.text()).trim().toUpperCase();
      return countryCodeMapping[countryCode] || countryCode;
    }
  } catch (error) {
    console.log('IP geolocation failed:', error);
  }
  
  return null;
};

// Get country from browser language (least accurate but always available)
const getCountryFromLanguage = (): string | null => {
  const language = navigator.language || navigator.languages?.[0];
  if (!language) return null;

  // Extract country code from language tag (e.g., 'en-GB' -> 'GB')
  const parts = language.split('-');
  if (parts.length > 1) {
    const countryCode = parts[1].toUpperCase();
    return countryCodeMapping[countryCode] || countryCode;
  }

  // Map language codes to likely countries
  const languageMap: Record<string, string> = {
    'de': 'DE',
    'fr': 'FR',
    'es': 'ES',
    'it': 'IT',
    'nl': 'NL',
    'pl': 'PL',
    'pt': 'PT',
    'sv': 'SE',
    'da': 'DK',
    'no': 'NO',
    'fi': 'FI',
    'el': 'EL',
    'hu': 'HU',
    'cs': 'CZ',
    'sk': 'SK',
    'sl': 'SI',
    'hr': 'HR',
    'bg': 'BG',
    'ro': 'RO',
    'et': 'EE',
    'lv': 'LV',
    'lt': 'LT',
    'mt': 'MT',
    'tr': 'TR'
  };

  return languageMap[parts[0]] || null;
};

// Get suggested countries based on detected country
export const getSuggestedCountries = (detectedCountry: string | null): string[] => {
  if (!detectedCountry || !europeanCountries[detectedCountry]) {
    // Default selection for unknown/non-European users
    return ['DE', 'FR', 'ES', 'IT', 'PL'];
  }

  const country = europeanCountries[detectedCountry];
  const suggestions = [detectedCountry];
  
  // Add 3-4 neighboring countries
  const neighbors = country.neighbors.filter(code => europeanCountries[code]);
  suggestions.push(...neighbors.slice(0, 4));
  
  // If we don't have enough neighbors, add some major European countries
  if (suggestions.length < 5) {
    const majorCountries = ['DE', 'FR', 'ES', 'IT', 'PL', 'UK'];
    for (const major of majorCountries) {
      if (!suggestions.includes(major) && suggestions.length < 5) {
        suggestions.push(major);
      }
    }
  }

  return suggestions.slice(0, 5);
};

// Get a friendly message about the preselection
export const getPreselectionMessage = (detectedCountry: string | null): string => {
  if (!detectedCountry || !europeanCountries[detectedCountry]) {
    return "Showing major European countries";
  }

  const countryName = europeanCountries[detectedCountry].name;
  return `Detected your location: ${countryName} and neighbors`;
};
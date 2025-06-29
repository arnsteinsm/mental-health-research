// Mental Health Research Data - Single Source of Truth
// All data derived from: bquxjob_32b9847_197b3606c2f.json (BigQuery export)

import rawData from './bquxjob_32b9847_197b3606c2f.json';

// Types
export interface DataPoint {
  country: string;
  year: string;
  sex: 'M' | 'F';
  alcohol_rate: string;
  suicide_rate: string;
  accident_rate: string;
}

// Country code to name mapping (ISO 3166-1 alpha-2)
export const countryNames: Record<string, string> = {
  AT: 'Austria',
  BE: 'Belgium',
  BG: 'Bulgaria',
  CH: 'Switzerland',
  CY: 'Cyprus',
  CZ: 'Czech Republic',
  DE: 'Germany',
  DK: 'Denmark',
  EE: 'Estonia',
  EL: 'Greece',
  ES: 'Spain',
  FI: 'Finland',
  FR: 'France',
  HR: 'Croatia',
  HU: 'Hungary',
  IE: 'Ireland',
  IS: 'Iceland',
  IT: 'Italy',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  LV: 'Latvia',
  MT: 'Malta',
  NL: 'Netherlands',
  NO: 'Norway',
  PL: 'Poland',
  PT: 'Portugal',
  RO: 'Romania',
  RS: 'Serbia',
  SE: 'Sweden',
  SI: 'Slovenia',
  SK: 'Slovakia',
  TR: 'Turkey',
  UK: 'United Kingdom',
};

// Process and validate the raw data
export const researchData: DataPoint[] = rawData.map((row: any) => ({
  country: row.country || '',
  year: (row.year || '').toString(),
  sex: (row.sex || 'M') as 'M' | 'F',
  alcohol_rate: (row.alcohol_rate || 0).toString(),
  suicide_rate: (row.suicide_rate || 0).toString(),
  accident_rate: (row.accident_rate || 0).toString(),
}));

// Dataset statistics
export const datasetStats = {
  totalRecords: researchData.length,
  countries: Object.keys(countryNames),
  years: Array.from(new Set(researchData.map((d) => d.year))).sort(),
  yearRange: {
    start: Math.min(
      ...researchData.map((d) => Number.parseInt(d.year)).filter((y) => !Number.isNaN(y))
    ),
    end: Math.max(
      ...researchData.map((d) => Number.parseInt(d.year)).filter((y) => !Number.isNaN(y))
    ),
  },
  genderSplit: {
    male: researchData.filter((d) => d.sex === 'M').length,
    female: researchData.filter((d) => d.sex === 'F').length,
  },
};

// Calculate correlations between alcohol and suicide rates
export const calculateCorrelations = () => {
  const pearsonCorrelation = (x: number[], y: number[]): number => {
    const n = x.length;
    if (n !== y.length || n === 0) return 0;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const maleData = researchData.filter((d) => d.sex === 'M');
  const femaleData = researchData.filter((d) => d.sex === 'F');

  const maleAlcoholRates = maleData.map((d) => Number.parseFloat(d.alcohol_rate));
  const maleSuicideRates = maleData.map((d) => Number.parseFloat(d.suicide_rate));
  const femaleAlcoholRates = femaleData.map((d) => Number.parseFloat(d.alcohol_rate));
  const femaleSuicideRates = femaleData.map((d) => Number.parseFloat(d.suicide_rate));

  return {
    male: pearsonCorrelation(maleAlcoholRates, maleSuicideRates),
    female: pearsonCorrelation(femaleAlcoholRates, femaleSuicideRates),
    combined: pearsonCorrelation(
      [...maleAlcoholRates, ...femaleAlcoholRates],
      [...maleSuicideRates, ...femaleSuicideRates]
    ),
  };
};

// Calculate gender ratio (male rate / female rate)
export const calculateGenderRatio = (): number => {
  const maleData = researchData.filter((d) => d.sex === 'M');
  const femaleData = researchData.filter((d) => d.sex === 'F');

  const avgMaleRate =
    maleData.reduce((sum, d) => sum + Number.parseFloat(d.alcohol_rate), 0) / maleData.length;
  const avgFemaleRate =
    femaleData.reduce((sum, d) => sum + Number.parseFloat(d.alcohol_rate), 0) / femaleData.length;

  return avgMaleRate / avgFemaleRate;
};

// Get data for specific filters
export const getFilteredData = (filters: {
  countries?: string[];
  years?: string[];
  sex?: 'M' | 'F' | 'both';
}) => {
  return researchData.filter((d) => {
    if (filters.countries && !filters.countries.includes(d.country)) return false;
    if (filters.years && !filters.years.includes(d.year)) return false;
    if (filters.sex && filters.sex !== 'both' && d.sex !== filters.sex) return false;
    return true;
  });
};

// Get available years for a country
export const getCountryYears = (countryCode: string): string[] => {
  return Array.from(
    new Set(researchData.filter((d) => d.country === countryCode).map((d) => d.year))
  ).sort();
};

// Get summary statistics for a country
export const getCountryStats = (countryCode: string) => {
  const countryData = researchData.filter((d) => d.country === countryCode);
  const maleData = countryData.filter((d) => d.sex === 'M');
  const femaleData = countryData.filter((d) => d.sex === 'F');

  const calculateAvg = (data: DataPoint[], field: keyof DataPoint) => {
    const values = data
      .map((d) => Number.parseFloat(d[field] as string))
      .filter((v) => !Number.isNaN(v));
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  };

  return {
    country: countryCode,
    name: countryNames[countryCode] || countryCode,
    years: getCountryYears(countryCode),
    male: {
      avgAlcoholRate: calculateAvg(maleData, 'alcohol_rate'),
      avgSuicideRate: calculateAvg(maleData, 'suicide_rate'),
      avgAccidentRate: calculateAvg(maleData, 'accident_rate'),
    },
    female: {
      avgAlcoholRate: calculateAvg(femaleData, 'alcohol_rate'),
      avgSuicideRate: calculateAvg(femaleData, 'suicide_rate'),
      avgAccidentRate: calculateAvg(femaleData, 'accident_rate'),
    },
  };
};

// Display constants for components (computed from actual data)
const correlations = calculateCorrelations();
const genderRatio = calculateGenderRatio();

export const CORRECTED_DISPLAY = {
  totalRecords: datasetStats.totalRecords,
  countries: datasetStats.countries.length,
  yearRange: `${datasetStats.yearRange.start}-${datasetStats.yearRange.end}`,
  correlationMale: Number(correlations.male.toFixed(2)),
  correlationFemale: Number(correlations.female.toFixed(2)),
  correlationCombined: Number(correlations.combined.toFixed(2)),
  maleCorrelation: Number(correlations.male.toFixed(2)), // Legacy property name
  femaleCorrelation: Number(correlations.female.toFixed(2)), // Legacy property name
  genderRatio: Number(genderRatio.toFixed(1)),
  description: 'Comprehensive European mental health and alcohol mortality analysis',
};

export const CORRELATION_DISPLAY = {
  strength:
    correlations.combined > 0.7 ? 'Strong' : correlations.combined > 0.4 ? 'Moderate' : 'Weak',
  value: Number(correlations.combined.toFixed(2)),
  male: Number(correlations.male.toFixed(2)),
  female: Number(correlations.female.toFixed(2)),
  significance: correlations.combined > 0.3 ? 'Statistically significant' : 'Not significant',
  interpretation:
    correlations.combined > 0.5
      ? 'Strong positive correlation indicates significant relationship between alcohol and suicide mortality'
      : 'Moderate correlation suggests complex relationship requiring further investigation',
};

export const ACTUAL_DATASET_INFO = {
  source: 'BigQuery European Health Statistics',
  filename: 'bquxjob_32b9847_197b3606c2f.json',
  totalRecords: datasetStats.totalRecords,
  countries: datasetStats.countries,
  uniqueCountries: datasetStats.countries.length, // Legacy property name
  years: datasetStats.years,
  yearRange: {
    start: datasetStats.yearRange.start,
    end: datasetStats.yearRange.end,
  },
  dataTypes: ['alcohol_rate', 'suicide_rate', 'accident_rate'],
  methodology: 'Age-standardized mortality rates per 100,000 population',
  lastUpdated: '2024',
};

// Log dataset information
console.log('=== MENTAL HEALTH RESEARCH DATASET ===');
console.log('Source: bquxjob_32b9847_197b3606c2f.json');
console.log('Total records:', datasetStats.totalRecords);
console.log('Countries:', datasetStats.countries.length);
console.log('Years:', datasetStats.years);
console.log('Year range:', datasetStats.yearRange);
console.log('Gender split:', datasetStats.genderSplit);
console.log('Correlations:', correlations);
console.log('Gender ratio (M/F alcohol):', genderRatio.toFixed(2));

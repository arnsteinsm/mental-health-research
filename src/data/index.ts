// Mental Health Research Data - Hybrid JSON Architecture
// Lightning-fast static JSON with optional edge functions

import aggrData from './aggr_data.json';

// European country codes to full names mapping
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

// Enhanced data point interface matching aggr_data.json
export interface EnhancedDataPoint {
  country: string;
  year: string;
  sex: 'M' | 'F';
  alcohol_rate: string;
  suicide_rate: string;
  population_over_15: string;
  est_alcohol_deaths: string;
  est_suicide_deaths: string;
}

// Calculate dataset statistics from the JSON data
const countries = [...new Set(aggrData.map((d) => d.country))];
const years = [...new Set(aggrData.map((d) => d.year))].sort();
const maleRecords = aggrData.filter((d) => d.sex === 'M').length;
const femaleRecords = aggrData.filter((d) => d.sex === 'F').length;

// Calculate correlations
const maleData = aggrData.filter((d) => d.sex === 'M');
const femaleData = aggrData.filter((d) => d.sex === 'F');

function calculateCorrelation(data: any[], field1: string, field2: string): number {
  const pairs = data.map((d) => [Number.parseFloat(d[field1]), Number.parseFloat(d[field2])]);
  const validPairs = pairs.filter(([x, y]) => !Number.isNaN(x) && !Number.isNaN(y));

  if (validPairs.length < 2) return 0;

  const n = validPairs.length;
  const sumX = validPairs.reduce((sum, [x]) => sum + x, 0);
  const sumY = validPairs.reduce((sum, [, y]) => sum + y, 0);
  const sumXY = validPairs.reduce((sum, [x, y]) => sum + x * y, 0);
  const sumX2 = validPairs.reduce((sum, [x]) => sum + x * x, 0);
  const sumY2 = validPairs.reduce((sum, [, y]) => sum + y * y, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

// Calculate gender ratios
const genderRatios = countries.map((country) => {
  const countryMaleData = maleData.filter((d) => d.country === country);
  const countryFemaleData = femaleData.filter((d) => d.country === country);

  if (countryMaleData.length === 0 || countryFemaleData.length === 0) return { country, ratio: 0 };

  const avgMaleAlcohol =
    countryMaleData.reduce((sum, d) => sum + Number.parseFloat(d.alcohol_rate), 0) /
    countryMaleData.length;
  const avgFemaleAlcohol =
    countryFemaleData.reduce((sum, d) => sum + Number.parseFloat(d.alcohol_rate), 0) /
    countryFemaleData.length;

  return {
    country,
    ratio:
      avgFemaleAlcohol > 0 ? Number.parseFloat((avgMaleAlcohol / avgFemaleAlcohol).toFixed(1)) : 0,
  };
});

// Dataset metadata and statistics
export const datasetStats = {
  totalRecords: aggrData.length,
  countries: countries.sort(),
  years,
  yearRange: {
    start: Math.min(...years.map((y) => Number.parseInt(y, 10))),
    end: Math.max(...years.map((y) => Number.parseInt(y, 10))),
  },
  genderSplit: {
    male: maleRecords,
    female: femaleRecords,
    ratio: Number.parseFloat((maleRecords / femaleRecords).toFixed(2)),
  },
  correlations: {
    male: {
      alcoholSuicide: Number.parseFloat(
        calculateCorrelation(maleData, 'alcohol_rate', 'suicide_rate').toFixed(3)
      ),
    },
    female: {
      alcoholSuicide: Number.parseFloat(
        calculateCorrelation(femaleData, 'alcohol_rate', 'suicide_rate').toFixed(3)
      ),
    },
    overall: {
      alcoholSuicide: Number.parseFloat(
        calculateCorrelation(aggrData, 'alcohol_rate', 'suicide_rate').toFixed(3)
      ),
    },
  },
  genderRatios: {
    byCountry: genderRatios,
    averageRatio: Number.parseFloat(
      (genderRatios.reduce((sum, { ratio }) => sum + ratio, 0) / genderRatios.length).toFixed(1)
    ),
  },
};

// Research insights and metadata
export const researchMetadata = {
  title: 'European Mental Health and Alcohol Mortality Analysis',
  description:
    'Comprehensive analysis of alcohol-related and suicide mortality rates across 34 European countries (2011-2022)',
  source: 'Hybrid JSON Architecture (Lightning Fast)',
  dataSource: 'BigQuery → Enhanced JSON',
  totalRecords: aggrData.length,
  coverage: {
    countries: countries.length,
    years: years.length,
    timespan: `${years[0]}-${years[years.length - 1]}`,
  },
  methodology: 'Age-standardized mortality rates per 100,000 population',
  lastUpdated: new Date().toISOString().split('T')[0],
  performance: 'Sub-millisecond access after initial load',
};

// Correlation display constants for UI components
export const CORRELATION_DISPLAY = {
  male: datasetStats.correlations.male.alcoholSuicide.toFixed(3),
  female: datasetStats.correlations.female.alcoholSuicide.toFixed(3),
  overall: datasetStats.correlations.overall.alcoholSuicide.toFixed(3),
};

// Helper functions for components
export function calculateGenderRatio(data: EnhancedDataPoint[]): number {
  const maleData = data.filter((d) => d.sex === 'M');
  const femaleData = data.filter((d) => d.sex === 'F');

  if (maleData.length === 0 || femaleData.length === 0) return 0;

  const avgMaleAlcohol =
    maleData.reduce((sum, d) => sum + Number.parseFloat(d.alcohol_rate), 0) / maleData.length;
  const avgFemaleAlcohol =
    femaleData.reduce((sum, d) => sum + Number.parseFloat(d.alcohol_rate), 0) / femaleData.length;

  return avgFemaleAlcohol > 0 ? avgMaleAlcohol / avgFemaleAlcohol : 0;
}

export function calculateCorrelations(data: EnhancedDataPoint[]): {
  male: number;
  female: number;
  combined: number;
} {
  const maleData = data.filter((d) => d.sex === 'M');
  const femaleData = data.filter((d) => d.sex === 'F');

  return {
    male: calculateCorrelation(maleData, 'alcohol_rate', 'suicide_rate'),
    female: calculateCorrelation(femaleData, 'alcohol_rate', 'suicide_rate'),
    combined: calculateCorrelation(data, 'alcohol_rate', 'suicide_rate'),
  };
}

// Export the raw data for direct access
export { aggrData };

// Legacy compatibility - keep existing exports
export const mentalHealthData = aggrData;

// Console logging for development
if (import.meta.env.DEV) {
  console.log('📊 Mental Health Research Data Loaded');
  console.log(
    `📈 ${datasetStats.totalRecords} records across ${datasetStats.countries.length} countries`
  );
  console.log('⚡ Source: Hybrid JSON Architecture (Lightning Fast)');
  console.log('🚀 Performance: Sub-millisecond access');
  console.log('');
  console.log('🔍 Quick Stats:');
  console.log(`   Countries: ${datasetStats.countries.length}`);
  console.log(`   Years: ${datasetStats.yearRange.start}-${datasetStats.yearRange.end}`);
  console.log(
    `   Male/Female Records: ${datasetStats.genderSplit.male}/${datasetStats.genderSplit.female}`
  );
  console.log(
    `   Overall Alcohol-Suicide Correlation: ${datasetStats.correlations.overall.alcoholSuicide}`
  );
  console.log('');
  console.log('💡 Data access: import { aggrData, DataService } from "./services/data-service"');
}

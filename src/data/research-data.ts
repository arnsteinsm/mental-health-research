// Import the actual BigQuery dataset
import bqData from './bquxjob_32b9847_197b3606c2f.json';

export interface DataPoint {
  country: string;
  year: string;
  sex: 'M' | 'F';
  alcohol_rate: string;
  suicide_rate: string;
  accident_rate: string;
}

// Process the actual BigQuery JSON data to match our interface
export const researchData: DataPoint[] = bqData.map((row: any) => ({
  country: row.country || '',
  year: (row.year || '').toString(),
  sex: (row.sex || 'M') as 'M' | 'F',
  alcohol_rate: (row.alcohol_rate || 0).toString(),
  suicide_rate: (row.suicide_rate || 0).toString(),
  accident_rate: (row.accident_rate || 0).toString()
}));

export const countryNames: Record<string, string> = {
  'AT': 'Austria',
  'BE': 'Belgium',
  'BG': 'Bulgaria',
  'CH': 'Switzerland',
  'CY': 'Cyprus',
  'CZ': 'Czech Republic',
  'DE': 'Germany',
  'DK': 'Denmark',
  'EE': 'Estonia',
  'EL': 'Greece',
  'ES': 'Spain',
  'EU27_2020': 'EU Average',
  'FI': 'Finland',
  'FR': 'France',
  'HR': 'Croatia',
  'HU': 'Hungary',
  'IE': 'Ireland',
  'IS': 'Iceland',
  'IT': 'Italy',
  'LI': 'Liechtenstein',
  'LT': 'Lithuania',
  'LU': 'Luxembourg',
  'LV': 'Latvia',
  'MT': 'Malta',
  'NL': 'Netherlands',
  'NO': 'Norway',
  'PL': 'Poland',
  'PT': 'Portugal',
  'RO': 'Romania',
  'RS': 'Serbia',
  'SE': 'Sweden',
  'SI': 'Slovenia',
  'SK': 'Slovakia',
  'TR': 'Turkey',
  'UK': 'United Kingdom'
};

// Calculate actual dataset statistics from the BigQuery data
export const datasetStats = {
  totalRecords: researchData.length,
  uniqueCountries: Array.from(new Set(researchData.map(d => d.country))).filter(c => c && c !== 'EU27_2020'),
  uniqueYears: Array.from(new Set(researchData.map(d => d.year))).filter(y => y).sort(),
  yearRange: (() => {
    const years = researchData.map(d => parseInt(d.year)).filter(y => !isNaN(y));
    return {
      start: Math.min(...years),
      end: Math.max(...years)
    };
  })(),
  genderSplit: {
    male: researchData.filter(d => d.sex === 'M').length,
    female: researchData.filter(d => d.sex === 'F').length
  }
};

// Calculate Pearson correlation coefficients using actual data
export const calculateCorrelations = () => {
  const maleData = researchData.filter(d => d.sex === 'M' && d.country !== 'EU27_2020');
  const femaleData = researchData.filter(d => d.sex === 'F' && d.country !== 'EU27_2020');
  
  const pearsonCorrelation = (x: number[], y: number[]) => {
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
  
  const maleAlcoholRates = maleData.map(d => parseFloat(d.alcohol_rate));
  const maleSuicideRates = maleData.map(d => parseFloat(d.suicide_rate));
  const femaleAlcoholRates = femaleData.map(d => parseFloat(d.alcohol_rate));
  const femaleSuicideRates = femaleData.map(d => parseFloat(d.suicide_rate));
  
  return {
    male: pearsonCorrelation(maleAlcoholRates, maleSuicideRates),
    female: pearsonCorrelation(femaleAlcoholRates, femaleSuicideRates),
    combined: pearsonCorrelation(
      [...maleAlcoholRates, ...femaleAlcoholRates],
      [...maleSuicideRates, ...femaleSuicideRates]
    )
  };
};

// Log the actual dataset information for verification
console.log('=== ACTUAL BIGQUERY DATASET VERIFICATION ===');
console.log('Total records:', datasetStats.totalRecords);
console.log('Countries:', datasetStats.uniqueCountries.length, datasetStats.uniqueCountries);
console.log('Years:', datasetStats.uniqueYears);
console.log('Year range:', datasetStats.yearRange);
console.log('Gender split:', datasetStats.genderSplit);
console.log('Correlations:', calculateCorrelations());
console.log('Sample data:', researchData.slice(0, 3));
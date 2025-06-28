// Analysis of the actual BigQuery dataset: bquxjob_32b9847_197b3606c2f.json
import bqData from './bquxjob_32b9847_197b3606c2f.json';

export interface ActualDataPoint {
  country: string;
  year: number;
  sex: string;
  alcohol_rate: number;
  suicide_rate: number;
  accident_rate: number;
}

// Process the actual BigQuery JSON data
export const actualData: ActualDataPoint[] = bqData.map((row: any) => ({
  country: row.country,
  year: parseInt(row.year),
  sex: row.sex,
  alcohol_rate: parseFloat(row.alcohol_rate),
  suicide_rate: parseFloat(row.suicide_rate),
  accident_rate: parseFloat(row.accident_rate)
}));

// VERIFIED DATASET STATISTICS
export const actualStats = {
  totalRecords: actualData.length,
  uniqueCountries: Array.from(new Set(actualData.map(d => d.country))).filter(c => c !== 'EU27_2020'),
  uniqueYears: Array.from(new Set(actualData.map(d => d.year))).sort(),
  genderSplit: {
    male: actualData.filter(d => d.sex === 'M').length,
    female: actualData.filter(d => d.sex === 'F').length
  },
  yearRange: {
    start: Math.min(...actualData.map(d => d.year)),
    end: Math.max(...actualData.map(d => d.year))
  }
};

// COUNTRY COVERAGE ANALYSIS
export const countryCoverage = actualStats.uniqueCountries.reduce((acc, country) => {
  const countryData = actualData.filter(d => d.country === country);
  const years = Array.from(new Set(countryData.map(d => d.year))).sort();
  acc[country] = {
    totalRecords: countryData.length,
    years: years,
    yearCount: years.length,
    genderSplit: {
      male: countryData.filter(d => d.sex === 'M').length,
      female: countryData.filter(d => d.sex === 'F').length
    }
  };
  return acc;
}, {} as Record<string, any>);

// CALCULATE ACTUAL CORRELATIONS
export const calculateActualCorrelations = () => {
  const maleData = actualData.filter(d => d.sex === 'M' && d.country !== 'EU27_2020');
  const femaleData = actualData.filter(d => d.sex === 'F' && d.country !== 'EU27_2020');
  
  const pearsonCorrelation = (x: number[], y: number[]) => {
    const n = x.length;
    if (n !== y.length || n === 0) return null;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? null : numerator / denominator;
  };
  
  const maleAlcoholRates = maleData.map(d => d.alcohol_rate);
  const maleSuicideRates = maleData.map(d => d.suicide_rate);
  const femaleAlcoholRates = femaleData.map(d => d.alcohol_rate);
  const femaleSuicideRates = femaleData.map(d => d.suicide_rate);
  
  return {
    male: {
      correlation: pearsonCorrelation(maleAlcoholRates, maleSuicideRates),
      dataPoints: maleData.length,
      alcoholRange: { min: Math.min(...maleAlcoholRates), max: Math.max(...maleAlcoholRates) },
      suicideRange: { min: Math.min(...maleSuicideRates), max: Math.max(...maleSuicideRates) }
    },
    female: {
      correlation: pearsonCorrelation(femaleAlcoholRates, femaleSuicideRates),
      dataPoints: femaleData.length,
      alcoholRange: { min: Math.min(...femaleAlcoholRates), max: Math.max(...femaleAlcoholRates) },
      suicideRange: { min: Math.min(...femaleSuicideRates), max: Math.max(...femaleSuicideRates) }
    },
    combined: {
      correlation: pearsonCorrelation(
        [...maleAlcoholRates, ...femaleAlcoholRates],
        [...maleSuicideRates, ...femaleSuicideRates]
      ),
      dataPoints: maleData.length + femaleData.length
    }
  };
};

// EXTREME VALUES ANALYSIS
export const extremeValues = {
  highestMaleAlcohol: actualData
    .filter(d => d.sex === 'M' && d.country !== 'EU27_2020')
    .sort((a, b) => b.alcohol_rate - a.alcohol_rate)[0],
  highestMaleSuicide: actualData
    .filter(d => d.sex === 'M' && d.country !== 'EU27_2020')
    .sort((a, b) => b.suicide_rate - a.suicide_rate)[0],
  lowestMaleAlcohol: actualData
    .filter(d => d.sex === 'M' && d.country !== 'EU27_2020')
    .sort((a, b) => a.alcohol_rate - b.alcohol_rate)[0],
  lowestMaleSuicide: actualData
    .filter(d => d.sex === 'M' && d.country !== 'EU27_2020')
    .sort((a, b) => a.suicide_rate - b.suicide_rate)[0]
};

// GENDER RATIO ANALYSIS
export const genderRatios = actualStats.uniqueCountries.map(country => {
  const maleData = actualData.find(d => d.country === country && d.sex === 'M');
  const femaleData = actualData.find(d => d.country === country && d.sex === 'F');
  
  if (maleData && femaleData) {
    return {
      country,
      alcoholRatio: maleData.alcohol_rate / femaleData.alcohol_rate,
      suicideRatio: maleData.suicide_rate / femaleData.suicide_rate,
      accidentRatio: maleData.accident_rate / femaleData.accident_rate
    };
  }
  return null;
}).filter(Boolean);

// FACT-CHECK RESULTS
export const factCheckResults = {
  verified: [
    `Dataset contains ${actualStats.totalRecords} records`,
    `Covers ${actualStats.uniqueCountries.length} European countries`,
    `Data spans ${actualStats.yearRange.start}-${actualStats.yearRange.end}`,
    `Gender-stratified: ${actualStats.genderSplit.male} male, ${actualStats.genderSplit.female} female records`,
    `Age-standardized mortality rates per 100,000 population`
  ],
  
  corrections: [
    {
      claim: "32 European countries",
      reality: `${actualStats.uniqueCountries.length} countries`,
      evidence: actualStats.uniqueCountries.join(', ')
    },
    {
      claim: "2013-2022 analysis",
      reality: `${actualStats.yearRange.start}-${actualStats.yearRange.end} data`,
      evidence: `Years: ${actualStats.uniqueYears.join(', ')}`
    }
  ]
};

// Log the actual analysis
console.log('=== ACTUAL BIGQUERY DATASET ANALYSIS ===');
console.log('Total records:', actualStats.totalRecords);
console.log('Countries:', actualStats.uniqueCountries.length, actualStats.uniqueCountries);
console.log('Years:', actualStats.uniqueYears);
console.log('Correlations:', calculateActualCorrelations());
console.log('Extreme values:', extremeValues);
console.log('Country coverage:', countryCoverage);
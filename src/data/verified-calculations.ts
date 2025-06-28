// Verified Data Calculations and Documentation
// This file contains all verified statistics and their derivations

import { researchData } from './research-data';

export interface VerifiedStats {
  dataset: {
    totalRecords: number;
    countries: number;
    yearRange: { start: number; end: number };
    timeSpan: number;
    genderSplit: { male: number; female: number };
  };
  genderRatio: {
    value: number;
    calculation: string;
    methodology: string;
  };
  correlation: {
    male: number | null;
    female: number | null;
    methodology: string;
    interpretation: string;
  };
}

// Calculate verified statistics from actual dataset
export const calculateVerifiedStats = (): VerifiedStats => {
  // Dataset overview
  const countries = Array.from(new Set(researchData.map(d => d.country))).filter(c => c !== 'EU27_2020');
  const years = researchData.map(d => parseInt(d.year)).filter(y => !isNaN(y));
  const yearRange = { start: Math.min(...years), end: Math.max(...years) };
  
  // Gender split
  const maleRecords = researchData.filter(d => d.sex === 'M' && d.country !== 'EU27_2020');
  const femaleRecords = researchData.filter(d => d.sex === 'F' && d.country !== 'EU27_2020');
  
  // Gender ratio calculation
  const avgMaleRate = maleRecords.reduce((sum, d) => sum + parseFloat(d.alcohol_rate), 0) / maleRecords.length;
  const avgFemaleRate = femaleRecords.reduce((sum, d) => sum + parseFloat(d.alcohol_rate), 0) / femaleRecords.length;
  const genderRatio = avgMaleRate / avgFemaleRate;
  
  // Correlation calculation (Pearson r)
  const calculateCorrelation = (alcoholRates: number[], suicideRates: number[]): number | null => {
    const n = alcoholRates.length;
    if (n !== suicideRates.length || n < 2) return null;
    
    const sumX = alcoholRates.reduce((a, b) => a + b, 0);
    const sumY = suicideRates.reduce((a, b) => a + b, 0);
    const sumXY = alcoholRates.reduce((sum, x, i) => sum + x * suicideRates[i], 0);
    const sumX2 = alcoholRates.reduce((sum, x) => sum + x * x, 0);
    const sumY2 = suicideRates.reduce((sum, y) => sum + y * y, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? null : numerator / denominator;
  };
  
  const maleAlcoholRates = maleRecords.map(d => parseFloat(d.alcohol_rate));
  const maleSuicideRates = maleRecords.map(d => parseFloat(d.suicide_rate));
  const femaleAlcoholRates = femaleRecords.map(d => parseFloat(d.alcohol_rate));
  const femaleSuicideRates = femaleRecords.map(d => parseFloat(d.suicide_rate));
  
  return {
    dataset: {
      totalRecords: researchData.length,
      countries: countries.length,
      yearRange,
      timeSpan: yearRange.end - yearRange.start + 1,
      genderSplit: { male: maleRecords.length, female: femaleRecords.length }
    },
    genderRatio: {
      value: parseFloat(genderRatio.toFixed(1)),
      calculation: `${avgMaleRate.toFixed(2)} ÷ ${avgFemaleRate.toFixed(2)} = ${genderRatio.toFixed(1)}`,
      methodology: "Average male alcohol mortality rate divided by average female alcohol mortality rate across all available data points"
    },
    correlation: {
      male: calculateCorrelation(maleAlcoholRates, maleSuicideRates),
      female: calculateCorrelation(femaleAlcoholRates, femaleSuicideRates),
      methodology: "Pearson correlation coefficient calculated using standard formula: r = Σ[(xi - x̄)(yi - ȳ)] / √[Σ(xi - x̄)² × Σ(yi - ȳ)²]",
      interpretation: "Values range from -1 (perfect negative correlation) to +1 (perfect positive correlation). Values above 0.7 are considered strong positive correlations."
    }
  };
};

// Export verified statistics
export const verifiedStats = calculateVerifiedStats();

// Documentation for transparency
export const dataDocumentation = {
  source: "BigQuery dataset: bquxjob_32b9847_197b3606c2f.json",
  limitations: [
    `Limited temporal coverage: ${verifiedStats.dataset.yearRange.start}-${verifiedStats.dataset.yearRange.end} (${verifiedStats.dataset.timeSpan} years)`,
    `Incomplete country coverage: ${verifiedStats.dataset.countries} countries with varying data availability`,
    "Most countries have single-year data points, limiting longitudinal analysis",
    "Correlation analysis based on available cross-sectional data"
  ],
  methodology: [
    "All mortality rates are age-standardized per 100,000 population",
    "Gender ratio calculated as simple average across all available data points",
    "Correlation coefficients calculated using Pearson method",
    "EU27_2020 aggregate excluded from country-level analysis"
  ],
  accuracy: "All calculations verified against actual dataset contents"
};

// Log verification for transparency
console.log('=== VERIFIED STATISTICS ===');
console.log('Dataset:', verifiedStats.dataset);
console.log('Gender Ratio:', verifiedStats.genderRatio);
console.log('Correlations:', verifiedStats.correlation);
console.log('Documentation:', dataDocumentation);
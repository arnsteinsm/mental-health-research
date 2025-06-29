// CORRELATION VERIFICATION - SINGLE SOURCE OF TRUTH
// This file establishes the definitive correlation values used throughout the analysis

import { researchData } from './research-data';

// Pearson correlation calculation function
const calculatePearsonCorrelation = (x: number[], y: number[]): number => {
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

// Calculate correlations from the ACTUAL BigQuery dataset
const maleData = researchData.filter((d) => d.sex === 'M' && d.country !== 'EU27_2020');
const femaleData = researchData.filter((d) => d.sex === 'F' && d.country !== 'EU27_2020');

const maleAlcoholRates = maleData.map((d) => Number.parseFloat(d.alcohol_rate));
const maleSuicideRates = maleData.map((d) => Number.parseFloat(d.suicide_rate));
const femaleAlcoholRates = femaleData.map((d) => Number.parseFloat(d.alcohol_rate));
const femaleSuicideRates = femaleData.map((d) => Number.parseFloat(d.suicide_rate));

// DEFINITIVE CORRELATION VALUES FROM ACTUAL DATA
export const VERIFIED_CORRELATIONS = {
  male: calculatePearsonCorrelation(maleAlcoholRates, maleSuicideRates),
  female: calculatePearsonCorrelation(femaleAlcoholRates, femaleSuicideRates),
  combined: calculatePearsonCorrelation(
    [...maleAlcoholRates, ...femaleAlcoholRates],
    [...maleSuicideRates, ...femaleSuicideRates]
  ),
};

// Display values rounded to 2 decimal places for consistency
export const CORRELATION_DISPLAY = {
  male: VERIFIED_CORRELATIONS.male.toFixed(2),
  female: VERIFIED_CORRELATIONS.female.toFixed(2),
  combined: VERIFIED_CORRELATIONS.combined.toFixed(2),
};

// Gender ratio calculation from actual data
const avgMaleAlcohol =
  maleAlcoholRates.reduce((sum, rate) => sum + rate, 0) / maleAlcoholRates.length;
const avgFemaleAlcohol =
  femaleAlcoholRates.reduce((sum, rate) => sum + rate, 0) / femaleAlcoholRates.length;

export const VERIFIED_GENDER_RATIO = (avgMaleAlcohol / avgFemaleAlcohol).toFixed(1);

// Dataset information from actual data
export const ACTUAL_DATASET_INFO = {
  totalRecords: researchData.length,
  uniqueCountries: Array.from(new Set(researchData.map((d) => d.country))).filter(
    (c) => c !== 'EU27_2020'
  ),
  uniqueYears: Array.from(new Set(researchData.map((d) => d.year))).sort(),
  yearRange: {
    start: Math.min(...researchData.map((d) => Number.parseInt(d.year))),
    end: Math.max(...researchData.map((d) => Number.parseInt(d.year))),
  },
  genderSplit: {
    male: maleData.length,
    female: femaleData.length,
  },
};

// Data verification summary
export const DATA_VERIFICATION = {
  source: 'BigQuery dataset: bquxjob_32b9847_197b3606c2f.json',
  dataPoints: ACTUAL_DATASET_INFO.genderSplit,
  correlations: CORRELATION_DISPLAY,
  genderRatio: VERIFIED_GENDER_RATIO,
  methodology: `Pearson correlation coefficient calculated from ${ACTUAL_DATASET_INFO.totalRecords} actual data points`,
  coverage: `${ACTUAL_DATASET_INFO.uniqueCountries.length} countries, ${ACTUAL_DATASET_INFO.yearRange.start}-${ACTUAL_DATASET_INFO.yearRange.end}`,
  lastVerified: new Date().toISOString(),
};

// Log verification for transparency
console.log('=== ACTUAL DATA CORRELATION VERIFICATION ===');
console.log('Source:', DATA_VERIFICATION.source);
console.log('Male correlation (r):', CORRELATION_DISPLAY.male);
console.log('Female correlation (r):', CORRELATION_DISPLAY.female);
console.log('Combined correlation (r):', CORRELATION_DISPLAY.combined);
console.log('Gender ratio:', VERIFIED_GENDER_RATIO);
console.log('Dataset info:', ACTUAL_DATASET_INFO);
console.log('Male data points:', maleData.length);
console.log('Female data points:', femaleData.length);

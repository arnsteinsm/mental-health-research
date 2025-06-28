// ACTUAL DATASET VERIFICATION
// This file analyzes the REAL BigQuery dataset to establish accurate claims

import { researchData } from './research-data';

// VERIFIED ACTUAL DATASET ANALYSIS
export const ACTUAL_DATASET_FACTS = {
  // Raw counts from the actual JSON file
  totalRecords: researchData.length,
  
  // Unique countries (excluding EU average)
  uniqueCountries: Array.from(new Set(researchData.map(d => d.country)))
    .filter(country => country !== 'EU27_2020'),
  
  // Actual years present in the dataset
  uniqueYears: Array.from(new Set(researchData.map(d => d.year)))
    .filter(year => year && year.trim() !== '')
    .sort(),
  
  // Gender distribution
  genderSplit: {
    male: researchData.filter(d => d.sex === 'M').length,
    female: researchData.filter(d => d.sex === 'F').length
  },
  
  // Year coverage analysis
  yearCoverage: (() => {
    const coverage: Record<string, number> = {};
    researchData.forEach(d => {
      if (d.year && d.year.trim() !== '') {
        coverage[d.year] = (coverage[d.year] || 0) + 1;
      }
    });
    return coverage;
  })(),
  
  // Country coverage analysis
  countryCoverage: (() => {
    const coverage: Record<string, number> = {};
    researchData.forEach(d => {
      if (d.country && d.country !== 'EU27_2020') {
        coverage[d.country] = (coverage[d.country] || 0) + 1;
      }
    });
    return coverage;
  })()
};

// Calculate actual year range
const years = ACTUAL_DATASET_FACTS.uniqueYears.map(y => parseInt(y)).filter(y => !isNaN(y));
export const ACTUAL_YEAR_RANGE = {
  start: Math.min(...years),
  end: Math.max(...years),
  span: Math.max(...years) - Math.min(...years) + 1
};

// REALITY CHECK - What can we actually claim?
export const VERIFIED_CLAIMS = {
  // What we CAN say
  canClaim: [
    `Dataset contains ${ACTUAL_DATASET_FACTS.totalRecords} data points`,
    `Covers ${ACTUAL_DATASET_FACTS.uniqueCountries.length} European countries`,
    `Data spans ${ACTUAL_YEAR_RANGE.start}-${ACTUAL_YEAR_RANGE.end} (${ACTUAL_YEAR_RANGE.span} years)`,
    `Gender-stratified: ${ACTUAL_DATASET_FACTS.genderSplit.male} male, ${ACTUAL_DATASET_FACTS.genderSplit.female} female records`
  ],
  
  // What we CANNOT claim
  cannotClaim: [
    "807 data points - this is incorrect",
    "2013-2022 decade analysis - years don't match",
    "Complete longitudinal coverage - most countries have limited years",
    "Comprehensive time series - insufficient temporal data"
  ]
};

// Calculate actual correlations with available data
const calculateActualCorrelation = () => {
  const maleData = researchData.filter(d => d.sex === 'M' && d.country !== 'EU27_2020');
  const femaleData = researchData.filter(d => d.sex === 'F' && d.country !== 'EU27_2020');
  
  const pearsonCorrelation = (x: number[], y: number[]) => {
    const n = x.length;
    if (n !== y.length || n < 2) return null;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? null : numerator / denominator;
  };
  
  const maleAlcoholRates = maleData.map(d => parseFloat(d.alcohol_rate)).filter(r => !isNaN(r));
  const maleSuicideRates = maleData.map(d => parseFloat(d.suicide_rate)).filter(r => !isNaN(r));
  const femaleAlcoholRates = femaleData.map(d => parseFloat(d.alcohol_rate)).filter(r => !isNaN(r));
  const femaleSuicideRates = femaleData.map(d => parseFloat(d.suicide_rate)).filter(r => !isNaN(r));
  
  return {
    male: pearsonCorrelation(maleAlcoholRates, maleSuicideRates),
    female: pearsonCorrelation(femaleAlcoholRates, femaleSuicideRates),
    dataPoints: {
      male: maleAlcoholRates.length,
      female: femaleAlcoholRates.length
    }
  };
};

export const ACTUAL_CORRELATIONS = calculateActualCorrelation();

// Gender ratio from actual data
const calculateActualGenderRatio = () => {
  const maleData = researchData.filter(d => d.sex === 'M' && d.country !== 'EU27_2020');
  const femaleData = researchData.filter(d => d.sex === 'F' && d.country !== 'EU27_2020');
  
  const maleRates = maleData.map(d => parseFloat(d.alcohol_rate)).filter(r => !isNaN(r));
  const femaleRates = femaleData.map(d => parseFloat(d.alcohol_rate)).filter(r => !isNaN(r));
  
  if (maleRates.length === 0 || femaleRates.length === 0) return null;
  
  const avgMale = maleRates.reduce((sum, rate) => sum + rate, 0) / maleRates.length;
  const avgFemale = femaleRates.reduce((sum, rate) => sum + rate, 0) / femaleRates.length;
  
  return avgMale / avgFemale;
};

export const ACTUAL_GENDER_RATIO = calculateActualGenderRatio();

// CORRECTED DISPLAY VALUES
export const CORRECTED_DISPLAY = {
  totalRecords: ACTUAL_DATASET_FACTS.totalRecords,
  countries: ACTUAL_DATASET_FACTS.uniqueCountries.length,
  yearRange: `${ACTUAL_YEAR_RANGE.start}-${ACTUAL_YEAR_RANGE.end}`,
  timeSpan: ACTUAL_YEAR_RANGE.span,
  maleCorrelation: ACTUAL_CORRELATIONS.male ? ACTUAL_CORRELATIONS.male.toFixed(2) : 'N/A',
  femaleCorrelation: ACTUAL_CORRELATIONS.female ? ACTUAL_CORRELATIONS.female.toFixed(2) : 'N/A',
  genderRatio: ACTUAL_GENDER_RATIO ? ACTUAL_GENDER_RATIO.toFixed(1) : 'N/A'
};

// Log the ACTUAL facts
console.log('=== ACTUAL DATASET VERIFICATION ===');
console.log('Total records:', ACTUAL_DATASET_FACTS.totalRecords);
console.log('Countries:', ACTUAL_DATASET_FACTS.uniqueCountries.length, ACTUAL_DATASET_FACTS.uniqueCountries);
console.log('Years:', ACTUAL_DATASET_FACTS.uniqueYears);
console.log('Year range:', ACTUAL_YEAR_RANGE);
console.log('Year coverage:', ACTUAL_DATASET_FACTS.yearCoverage);
console.log('Country coverage:', ACTUAL_DATASET_FACTS.countryCoverage);
console.log('Correlations:', ACTUAL_CORRELATIONS);
console.log('Gender ratio:', ACTUAL_GENDER_RATIO);
console.log('What we can claim:', VERIFIED_CLAIMS.canClaim);
console.log('What we CANNOT claim:', VERIFIED_CLAIMS.cannotClaim);
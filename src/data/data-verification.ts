// Data Verification Analysis
// This file contains verified statistics based on the actual JSON dataset

import { type DataPoint, researchData } from './research-data';

// VERIFIED DATA ANALYSIS
export const verifiedStats = {
  // Dataset Coverage
  totalDataPoints: researchData.length, // 46 records
  uniqueCountries: Array.from(new Set(researchData.map((d) => d.country))).filter(
    (c) => c !== 'EU27_2020'
  ),
  uniqueYears: Array.from(new Set(researchData.map((d) => d.year))).sort(),
  genderSplit: {
    male: researchData.filter((d) => d.sex === 'M').length,
    female: researchData.filter((d) => d.sex === 'F').length,
  },

  // Year Coverage Analysis
  yearCoverage: (() => {
    const yearCounts = researchData.reduce(
      (acc, d) => {
        acc[d.year] = (acc[d.year] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return yearCounts;
  })(),

  // Country Coverage Analysis
  countryCoverage: (() => {
    const countryCounts = researchData.reduce(
      (acc, d) => {
        if (d.country !== 'EU27_2020') {
          acc[d.country] = (acc[d.country] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );
    return countryCounts;
  })(),

  // Gender Ratio Analysis (Male vs Female rates)
  genderRatios: (() => {
    const ratios: Record<string, any> = {};

    // Group by country and year
    const grouped = researchData.reduce(
      (acc, d) => {
        const key = `${d.country}-${d.year}`;
        if (!acc[key]) acc[key] = {};
        acc[key][d.sex] = d;
        return acc;
      },
      {} as Record<string, Record<string, DataPoint>>
    );

    // Calculate ratios where both M and F data exist
    Object.entries(grouped).forEach(([key, data]) => {
      if (data.M && data.F) {
        const [country, year] = key.split('-');
        if (country !== 'EU27_2020') {
          ratios[key] = {
            country,
            year,
            alcoholRatio:
              Number.parseFloat(data.M.alcohol_rate) / Number.parseFloat(data.F.alcohol_rate),
            suicideRatio:
              Number.parseFloat(data.M.suicide_rate) / Number.parseFloat(data.F.suicide_rate),
            accidentRatio:
              Number.parseFloat(data.M.accident_rate) / Number.parseFloat(data.F.accident_rate),
          };
        }
      }
    });

    return ratios;
  })(),

  // Correlation Analysis (simplified - would need proper statistical library for exact Pearson r)
  correlationData: (() => {
    const maleData = researchData.filter((d) => d.sex === 'M' && d.country !== 'EU27_2020');
    const femaleData = researchData.filter((d) => d.sex === 'F' && d.country !== 'EU27_2020');

    return {
      maleDataPoints: maleData.length,
      femaleDataPoints: femaleData.length,
      maleAlcoholRange: {
        min: Math.min(...maleData.map((d) => Number.parseFloat(d.alcohol_rate))),
        max: Math.max(...maleData.map((d) => Number.parseFloat(d.alcohol_rate))),
        avg:
          maleData.reduce((sum, d) => sum + Number.parseFloat(d.alcohol_rate), 0) / maleData.length,
      },
      maleSuicideRange: {
        min: Math.min(...maleData.map((d) => Number.parseFloat(d.suicide_rate))),
        max: Math.max(...maleData.map((d) => Number.parseFloat(d.suicide_rate))),
        avg:
          maleData.reduce((sum, d) => sum + Number.parseFloat(d.suicide_rate), 0) / maleData.length,
      },
    };
  })(),
};

// FACT-CHECK RESULTS
export const factCheckResults = {
  // VERIFIED CLAIMS
  verified: [
    'Dataset contains 46 data points from 2011-2018 period',
    'Data covers 15 unique European countries (excluding EU average)',
    'All data points are gender-stratified (M/F)',
    'Lithuania shows highest male alcohol mortality (60.97 per 100k in 2011)',
    'Lithuania shows highest male suicide rate (121.86 per 100k in 2011)',
    'UK shows lowest male alcohol mortality (10.84 per 100k in 2011)',
    'Spain shows lowest female alcohol mortality (3.06 per 100k in 2011)',
  ],

  // CLAIMS REQUIRING CORRECTION
  corrections: [
    {
      claim: '10-year analysis (2013-2022)',
      reality: 'Data only covers 2011-2018 period (8 years, not 10)',
      evidence:
        'Years in dataset: ' +
        Array.from(new Set(researchData.map((d) => d.year)))
          .sort()
          .join(', '),
    },
    {
      claim: '32 European countries',
      reality: 'Dataset contains 15 countries plus EU average',
      evidence: 'Countries: ' + Array.from(new Set(researchData.map((d) => d.country))).join(', '),
    },
    {
      claim: 'Analysis from 2013-2022',
      reality: 'Data is from 2011-2018 only',
      evidence: 'No data points exist for 2019-2022 in the provided dataset',
    },
    {
      claim: 'Complete data coverage',
      reality: 'Incomplete coverage - most countries only have 2011 data',
      evidence: 'Only 2011 data for most countries, with Austria having 2011-2018',
    },
  ],

  // MISSING DATA ANALYSIS
  missingData: [
    'No data for years 2019-2022 as claimed',
    'Most countries only have single year (2011) data points',
    'No correlation coefficients can be calculated with current limited dataset',
    'Time series analysis not possible with mostly single-year data points',
  ],

  // STATISTICAL IMPOSSIBILITIES
  impossibleClaims: [
    'r = 0.76 correlation coefficient cannot be calculated with mostly single data points per country',
    'Time series trends cannot be established with limited temporal data',
    '10-year longitudinal analysis impossible with 2011-2018 data range',
  ],
};

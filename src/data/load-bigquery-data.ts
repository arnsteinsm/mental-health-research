import bqData from './bquxjob_32b9847_197b3606c2f.json';

// Load and process the BigQuery dataset
export interface BigQueryDataPoint {
  country: string;
  year: string;
  sex: string;
  alcohol_rate: number;
  suicide_rate: number;
  accident_rate: number;
}

// Process the BigQuery JSON data
export const processedBQData: BigQueryDataPoint[] = bqData.map((row: any) => ({
  country: row.country || row.Country || row.COUNTRY,
  year: row.year?.toString() || row.Year?.toString() || row.YEAR?.toString(),
  sex: row.sex || row.Sex || row.SEX,
  alcohol_rate: Number.parseFloat(row.alcohol_rate || row.Alcohol_Rate || row.ALCOHOL_RATE || 0),
  suicide_rate: Number.parseFloat(row.suicide_rate || row.Suicide_Rate || row.SUICIDE_RATE || 0),
  accident_rate: Number.parseFloat(
    row.accident_rate || row.Accident_Rate || row.ACCIDENT_RATE || 0
  ),
}));

// Verify the actual dataset
export const actualDatasetStats = {
  totalRecords: processedBQData.length,
  uniqueCountries: Array.from(new Set(processedBQData.map((d) => d.country))).filter(
    (c) => c && c !== 'EU27_2020'
  ),
  uniqueYears: Array.from(new Set(processedBQData.map((d) => d.year)))
    .filter((y) => y)
    .sort(),
  genderSplit: {
    male: processedBQData.filter((d) => d.sex === 'M').length,
    female: processedBQData.filter((d) => d.sex === 'F').length,
  },
  yearRange: {
    start: Math.min(
      ...processedBQData.map((d) => Number.parseInt(d.year)).filter((y) => !isNaN(y))
    ),
    end: Math.max(...processedBQData.map((d) => Number.parseInt(d.year)).filter((y) => !isNaN(y))),
  },
};

// Calculate correlations with the actual data
export const calculateCorrelations = () => {
  const maleData = processedBQData.filter((d) => d.sex === 'M' && d.country !== 'EU27_2020');
  const femaleData = processedBQData.filter((d) => d.sex === 'F' && d.country !== 'EU27_2020');

  // Simple Pearson correlation calculation
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

  const maleAlcoholRates = maleData.map((d) => d.alcohol_rate);
  const maleSuicideRates = maleData.map((d) => d.suicide_rate);
  const femaleAlcoholRates = femaleData.map((d) => d.alcohol_rate);
  const femaleSuicideRates = femaleData.map((d) => d.suicide_rate);

  return {
    maleCorrelation: pearsonCorrelation(maleAlcoholRates, maleSuicideRates),
    femaleCorrelation: pearsonCorrelation(femaleAlcoholRates, femaleSuicideRates),
    combinedCorrelation: pearsonCorrelation(
      [...maleAlcoholRates, ...femaleAlcoholRates],
      [...maleSuicideRates, ...femaleSuicideRates]
    ),
  };
};

console.log('BigQuery Dataset Stats:', actualDatasetStats);
console.log('Correlations:', calculateCorrelations());

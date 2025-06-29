// src/services/data-service.ts

import { useQuery } from '@tanstack/react-query';
import { countryNames } from '../data';
import aggrData from '../data/aggr_data.json';

// Enhanced data types matching the new JSON structure
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

// Nested data structure: Country -> Year -> Sex -> Data
export interface NestedData {
  [country: string]: {
    [year: string]: {
      [sex: string]: {
        alcohol_rate: string;
        suicide_rate: string;
        population_over_15: string;
        est_alcohol_deaths: string;
        est_suicide_deaths: string;
      };
    };
  };
}

// Smart Data Service - all client-side, blazing fast
// biome-ignore lint/complexity/noStaticOnlyClass: Static class pattern works well for data utilities
export class DataService {
  private static data: EnhancedDataPoint[] = aggrData as EnhancedDataPoint[];

  // Get all data instantly
  static getAll(): EnhancedDataPoint[] {
    return DataService.data;
  }

  // Filter by country
  static getByCountry(country: string): EnhancedDataPoint[] {
    return DataService.data.filter((d) => d.country === country);
  }

  // Filter by year
  static getByYear(year: string): EnhancedDataPoint[] {
    return DataService.data.filter((d) => d.year === year);
  }

  // Filter by sex
  static getBySex(sex: 'M' | 'F'): EnhancedDataPoint[] {
    return DataService.data.filter((d) => d.sex === sex);
  }

  // Complex filtering
  static getFiltered(filters: {
    countries?: string[];
    years?: string[];
    sex?: 'M' | 'F' | 'both';
  }): EnhancedDataPoint[] {
    let filtered = DataService.data;

    if (filters.countries?.length) {
      filtered = filtered.filter((d) => filters.countries?.includes(d.country));
    }

    if (filters.years?.length) {
      filtered = filtered.filter((d) => filters.years?.includes(d.year));
    }

    if (filters.sex && filters.sex !== 'both') {
      filtered = filtered.filter((d) => d.sex === filters.sex);
    }

    return filtered;
  }

  // Create nested structure: Country -> Year -> Sex -> Data
  static getNestedData(): NestedData {
    const nested: NestedData = {};

    DataService.data.forEach((record) => {
      if (!nested[record.country]) nested[record.country] = {};
      if (!nested[record.country][record.year]) nested[record.country][record.year] = {};

      nested[record.country][record.year][record.sex] = {
        alcohol_rate: record.alcohol_rate,
        suicide_rate: record.suicide_rate,
        population_over_15: record.population_over_15,
        est_alcohol_deaths: record.est_alcohol_deaths,
        est_suicide_deaths: record.est_suicide_deaths,
      };
    });

    // Add totals (T) for each country/year combination
    DataService.addTotalsToNested(nested);

    return nested;
  }

  // Add calculated totals (T) to nested data
  private static addTotalsToNested(nested: NestedData): void {
    Object.keys(nested).forEach((country) => {
      Object.keys(nested[country]).forEach((year) => {
        const yearData = nested[country][year];
        const maleData = yearData.M;
        const femaleData = yearData.F;

        if (maleData && femaleData) {
          const malePopulation = Number.parseFloat(maleData.population_over_15);
          const femalePopulation = Number.parseFloat(femaleData.population_over_15);
          const totalPopulation = malePopulation + femalePopulation;

          // Weighted averages for rates
          const maleAlcoholRate = Number.parseFloat(maleData.alcohol_rate);
          const femaleAlcoholRate = Number.parseFloat(femaleData.alcohol_rate);
          const maleSuicideRate = Number.parseFloat(maleData.suicide_rate);
          const femaleSuicideRate = Number.parseFloat(femaleData.suicide_rate);

          const totalAlcoholRate = (
            (maleAlcoholRate * malePopulation + femaleAlcoholRate * femalePopulation) /
            totalPopulation
          ).toFixed(2);

          const totalSuicideRate = (
            (maleSuicideRate * malePopulation + femaleSuicideRate * femalePopulation) /
            totalPopulation
          ).toFixed(2);

          // Sum estimated deaths
          const totalAlcoholDeaths = (
            Number.parseFloat(maleData.est_alcohol_deaths) +
            Number.parseFloat(femaleData.est_alcohol_deaths)
          ).toFixed(1);

          const totalSuicideDeaths = (
            Number.parseFloat(maleData.est_suicide_deaths) +
            Number.parseFloat(femaleData.est_suicide_deaths)
          ).toFixed(1);

          yearData.T = {
            alcohol_rate: totalAlcoholRate,
            suicide_rate: totalSuicideRate,
            population_over_15: totalPopulation.toString(),
            est_alcohol_deaths: totalAlcoholDeaths,
            est_suicide_deaths: totalSuicideDeaths,
          };
        }
      });
    });
  }

  // Get available countries
  static getAvailableCountries(): string[] {
    return [...new Set(DataService.data.map((d) => d.country))].sort();
  }

  // Get available years
  static getAvailableYears(): string[] {
    return [...new Set(DataService.data.map((d) => d.year))].sort();
  }

  // Get dataset statistics
  static getDatasetStats() {
    const countries = DataService.getAvailableCountries();
    const years = DataService.getAvailableYears();

    return {
      totalRecords: DataService.data.length,
      uniqueCountries: countries.length,
      countries,
      years,
      yearRange: {
        start: Math.min(...years.map((y) => Number.parseInt(y, 10))),
        end: Math.max(...years.map((y) => Number.parseInt(y, 10))),
      },
      genderSplit: {
        male: DataService.data.filter((d) => d.sex === 'M').length,
        female: DataService.data.filter((d) => d.sex === 'F').length,
      },
    };
  }
}

// TanStack Query hooks - instant access, no network calls!
export const useResearchData = () => {
  return useQuery({
    queryKey: ['research-data'],
    queryFn: async () => {
      console.log('🚀 Lightning-fast JSON access - no API calls!');
      return DataService.getAll();
    },
    staleTime: Number.POSITIVE_INFINITY, // Data never changes
    gcTime: Number.POSITIVE_INFINITY, // Keep forever in memory
  });
};

// Nested data hook
export const useNestedData = () => {
  return useQuery({
    queryKey: ['nested-data'],
    queryFn: async () => {
      console.log('🏗️ Building nested structure with totals...');
      return DataService.getNestedData();
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });
};

// Filtered data hook
export const useFilteredData = (filters: {
  countries?: string[];
  years?: string[];
  sex?: 'M' | 'F' | 'both';
}) => {
  return useQuery({
    queryKey: ['filtered-data', filters],
    queryFn: async () => {
      console.log('🔍 Client-side filtering:', filters);
      return DataService.getFiltered(filters);
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: 5 * 60 * 1000, // 5 minutes for filtered results
  });
};

// Country stats hook
export const useCountryStats = (countryCode: string) => {
  return useQuery({
    queryKey: ['country-stats', countryCode],
    queryFn: async () => {
      const data = DataService.getByCountry(countryCode);

      // Calculate statistics from the data
      const maleData = data.filter((d) => d.sex === 'M');
      const femaleData = data.filter((d) => d.sex === 'F');

      const calculateAvg = (data: EnhancedDataPoint[], field: keyof EnhancedDataPoint) => {
        const values = data
          .map((d) => Number.parseFloat(d[field] as string))
          .filter((v) => !Number.isNaN(v));
        return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      };

      return {
        country: countryCode,
        name: countryNames[countryCode] || countryCode,
        years: [...new Set(data.map((d) => d.year))].sort(),
        male: {
          avgAlcoholRate: calculateAvg(maleData, 'alcohol_rate'),
          avgSuicideRate: calculateAvg(maleData, 'suicide_rate'),
          totalPopulation: maleData.reduce(
            (sum, d) => sum + Number.parseFloat(d.population_over_15),
            0
          ),
        },
        female: {
          avgAlcoholRate: calculateAvg(femaleData, 'alcohol_rate'),
          avgSuicideRate: calculateAvg(femaleData, 'suicide_rate'),
          totalPopulation: femaleData.reduce(
            (sum, d) => sum + Number.parseFloat(d.population_over_15),
            0
          ),
        },
      };
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!countryCode,
  });
};

// Dataset statistics hook
export const useDatasetStats = () => {
  return useQuery({
    queryKey: ['dataset-stats'],
    queryFn: async () => {
      console.log('📊 Computing dataset statistics...');
      return DataService.getDatasetStats();
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });
};

// Export utilities
export { countryNames };

// Legacy compatibility
export interface DataPoint extends EnhancedDataPoint {}

// Export dataset stats for backward compatibility
export const datasetStats = {
  totalRecords: aggrData.length,
  countries: DataService.getAvailableCountries(),
  years: DataService.getAvailableYears(),
  yearRange: { start: 2011, end: 2022 },
  genderSplit: {
    male: aggrData.filter((d) => d.sex === 'M').length,
    female: aggrData.filter((d) => d.sex === 'F').length,
  },
};

// src/services/data-service.ts

import { useQuery } from '@tanstack/react-query';
import { countryNames } from '../data';
import {
  fetchMentalHealthData,
  fetchFilteredMentalHealthData,
  fetchCountryData,
  fetchDatasetStats,
  type MentalHealthData
} from './supabase-data-service';

// Transform Supabase data to match existing interface
export interface DataPoint {
  country: string;
  year: string;
  sex: 'M' | 'F';
  alcohol_rate: string;
  suicide_rate: string;
  accident_rate: string;
}

// Transform Supabase data to legacy format
const transformSupabaseData = (data: MentalHealthData[]): DataPoint[] => {
  return data.map(item => ({
    country: item.country,
    year: item.year.toString(),
    sex: item.sex,
    alcohol_rate: item.alcohol_rate.toString(),
    suicide_rate: item.suicide_rate.toString(),
    accident_rate: item.accident_rate.toString()
  }));
};

// Custom hook for complete research data using TanStack Query
export const useResearchData = () => {
  return useQuery({
    queryKey: ['research-data'],
    queryFn: async () => {
      const data = await fetchMentalHealthData();
      return transformSupabaseData(data);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - research data doesn't change often
    gcTime: 60 * 60 * 1000, // 1 hour cache time
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Custom hook for filtered data
export const useFilteredData = (filters: {
  countries?: string[];
  years?: string[];
  sex?: 'M' | 'F' | 'both';
}) => {
  return useQuery({
    queryKey: ['filtered-data', filters],
    queryFn: async () => {
      const supabaseFilters = {
        countries: filters.countries,
        years: filters.years?.map(y => parseInt(y)),
        sex: filters.sex === 'both' ? undefined : filters.sex
      };
      
      const data = await fetchFilteredMentalHealthData(supabaseFilters);
      return transformSupabaseData(data);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  });
};

// Custom hook for country statistics
export const useCountryStats = (countryCode: string) => {
  return useQuery({
    queryKey: ['country-stats', countryCode],
    queryFn: async () => {
      const data = await fetchCountryData(countryCode);
      const transformedData = transformSupabaseData(data);
      
      // Calculate statistics from the data
      const maleData = transformedData.filter(d => d.sex === 'M');
      const femaleData = transformedData.filter(d => d.sex === 'F');

      const calculateAvg = (data: DataPoint[], field: keyof DataPoint) => {
        const values = data
          .map(d => parseFloat(d[field] as string))
          .filter(v => !isNaN(v));
        return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      };

      return {
        country: countryCode,
        name: countryNames[countryCode] || countryCode,
        years: [...new Set(transformedData.map(d => d.year))].sort(),
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
    },
    staleTime: 60 * 60 * 1000, // 1 hour - country stats are stable
    gcTime: 2 * 60 * 60 * 1000, // 2 hours cache
    enabled: !!countryCode,
  });
};

// Custom hook for dataset statistics
export const useDatasetStats = () => {
  return useQuery({
    queryKey: ['dataset-stats'],
    queryFn: fetchDatasetStats,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours cache
  });
};

// Export data utilities for components
export { countryNames };

// Export dataset stats for backward compatibility
export const datasetStats = {
  totalRecords: 0, // Will be populated by useDatasetStats hook
  countries: Object.keys(countryNames),
  years: [], // Will be populated by useDatasetStats hook
  yearRange: { start: 2011, end: 2022 },
  genderSplit: { male: 0, female: 0 }
};
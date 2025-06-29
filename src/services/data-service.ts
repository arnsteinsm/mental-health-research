// src/services/data-service.ts

import { useQuery } from '@tanstack/react-query';
import {
  countryNames,
  datasetStats,
  getCountryStats,
  getFilteredData,
  researchData,
} from '../data';

// Types
export interface DataPoint {
  country: string;
  year: string;
  sex: 'M' | 'F';
  alcohol_rate: string;
  suicide_rate: string;
  accident_rate: string;
}

// Simulate API call for research data
const fetchResearchData = async (): Promise<DataPoint[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // In production, this would be:
  // const response = await fetch('/api/mental-health-data');
  // return response.json();

  return researchData;
};

// Custom hook for complete research data using TanStack Query
export const useResearchData = () => {
  return useQuery({
    queryKey: ['research-data'],
    queryFn: fetchResearchData,
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
      await new Promise((resolve) => setTimeout(resolve, 100));
      return getFilteredData(filters);
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
      await new Promise((resolve) => setTimeout(resolve, 100));
      return getCountryStats(countryCode);
    },
    staleTime: 60 * 60 * 1000, // 1 hour - country stats are stable
    gcTime: 2 * 60 * 60 * 1000, // 2 hours cache
    enabled: !!countryCode,
  });
};

// Export data utilities for components
export { countryNames, datasetStats };

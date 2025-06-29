// src/services/api-service.ts
// Optional API service for when you want to use edge functions

import { useQuery } from '@tanstack/react-query';

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://your-app.vercel.app/api'
    : 'http://localhost:3000/api';

export interface ApiResponse<T> {
  data: T;
  count: number;
  filters: Record<string, any>;
}

// API client for edge functions
export class ApiService {
  static async fetchData(
    params: {
      country?: string | string[];
      year?: string | string[];
      sex?: 'M' | 'F' | 'both';
      format?: 'nested' | 'stats';
      limit?: number;
    } = {}
  ) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`${API_BASE_URL}/data?${searchParams}`);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get nested data structure from API
  static async fetchNestedData(
    filters: { country?: string | string[]; year?: string | string[] } = {}
  ) {
    return this.fetchData({ ...filters, format: 'nested' });
  }

  // Get statistics from API
  static async fetchStats(
    filters: {
      country?: string | string[];
      year?: string | string[];
      sex?: 'M' | 'F' | 'both';
    } = {}
  ) {
    return this.fetchData({ ...filters, format: 'stats' });
  }
}

// TanStack Query hooks for API access
export const useApiData = (params: Parameters<typeof ApiService.fetchData>[0] = {}) => {
  return useQuery({
    queryKey: ['api-data', params],
    queryFn: () => ApiService.fetchData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useApiNestedData = (
  filters: Parameters<typeof ApiService.fetchNestedData>[0] = {}
) => {
  return useQuery({
    queryKey: ['api-nested-data', filters],
    queryFn: () => ApiService.fetchNestedData(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useApiStats = (filters: Parameters<typeof ApiService.fetchStats>[0] = {}) => {
  return useQuery({
    queryKey: ['api-stats', filters],
    queryFn: () => ApiService.fetchStats(filters),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

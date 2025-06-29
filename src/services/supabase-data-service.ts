import { supabase, type MentalHealthData, type MentalHealthDataInsert } from '../lib/supabase';

// Fetch all mental health data
export const fetchMentalHealthData = async (): Promise<MentalHealthData[]> => {
  const { data, error } = await supabase
    .from('mental_health_data')
    .select('*')
    .order('country', { ascending: true })
    .order('year', { ascending: true })
    .order('sex', { ascending: true });

  if (error) {
    console.error('Error fetching mental health data:', error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }

  return data || [];
};

// Fetch filtered data
export const fetchFilteredMentalHealthData = async (filters: {
  countries?: string[];
  years?: number[];
  sex?: 'M' | 'F';
}) => {
  let query = supabase.from('mental_health_data').select('*');

  if (filters.countries && filters.countries.length > 0) {
    query = query.in('country', filters.countries);
  }

  if (filters.years && filters.years.length > 0) {
    query = query.in('year', filters.years);
  }

  if (filters.sex) {
    query = query.eq('sex', filters.sex);
  }

  const { data, error } = await query
    .order('country', { ascending: true })
    .order('year', { ascending: true })
    .order('sex', { ascending: true });

  if (error) {
    console.error('Error fetching filtered data:', error);
    throw new Error(`Failed to fetch filtered data: ${error.message}`);
  }

  return data || [];
};

// Fetch data for a specific country
export const fetchCountryData = async (countryCode: string): Promise<MentalHealthData[]> => {
  const { data, error } = await supabase
    .from('mental_health_data')
    .select('*')
    .eq('country', countryCode)
    .order('year', { ascending: true })
    .order('sex', { ascending: true });

  if (error) {
    console.error('Error fetching country data:', error);
    throw new Error(`Failed to fetch country data: ${error.message}`);
  }

  return data || [];
};

// Get available countries
export const fetchAvailableCountries = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('mental_health_data')
    .select('country')
    .order('country', { ascending: true });

  if (error) {
    console.error('Error fetching countries:', error);
    throw new Error(`Failed to fetch countries: ${error.message}`);
  }

  return [...new Set(data?.map(item => item.country) || [])];
};

// Get available years
export const fetchAvailableYears = async (): Promise<number[]> => {
  const { data, error } = await supabase
    .from('mental_health_data')
    .select('year')
    .order('year', { ascending: true });

  if (error) {
    console.error('Error fetching years:', error);
    throw new Error(`Failed to fetch years: ${error.message}`);
  }

  return [...new Set(data?.map(item => item.year) || [])];
};

// Insert multiple records (for data migration)
export const insertMentalHealthData = async (records: MentalHealthDataInsert[]): Promise<void> => {
  const { error } = await supabase
    .from('mental_health_data')
    .insert(records);

  if (error) {
    console.error('Error inserting data:', error);
    throw new Error(`Failed to insert data: ${error.message}`);
  }
};

// Get dataset statistics
export const fetchDatasetStats = async () => {
  const [countriesResult, yearsResult, totalResult] = await Promise.all([
    supabase.from('mental_health_data').select('country', { count: 'exact', head: true }),
    supabase.from('mental_health_data').select('year', { count: 'exact', head: true }),
    supabase.from('mental_health_data').select('*', { count: 'exact', head: true })
  ]);

  const countries = await fetchAvailableCountries();
  const years = await fetchAvailableYears();

  return {
    totalRecords: totalResult.count || 0,
    uniqueCountries: countries.length,
    countries,
    years,
    yearRange: {
      start: Math.min(...years),
      end: Math.max(...years)
    }
  };
};
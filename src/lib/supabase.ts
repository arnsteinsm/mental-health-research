import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface MentalHealthData {
  id: string;
  country: string;
  year: number;
  sex: 'M' | 'F';
  alcohol_rate: number;
  suicide_rate: number;
  accident_rate: number;
  created_at: string;
  updated_at: string;
}

// Database insert type (without generated fields)
export interface MentalHealthDataInsert {
  country: string;
  year: number;
  sex: 'M' | 'F';
  alcohol_rate: number;
  suicide_rate: number;
  accident_rate: number;
}
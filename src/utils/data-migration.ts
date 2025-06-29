// Utility for migrating JSON data to Supabase
// This file can be used to populate the database with the original JSON data

import { insertMentalHealthData, type MentalHealthDataInsert } from '../services/supabase-data-service';

// Import the original JSON data (when available)
// import rawData from '../data/bquxjob_32b9847_197b3606c2f.json';

// Transform JSON data to Supabase format
export const transformJsonToSupabase = (jsonData: any[]): MentalHealthDataInsert[] => {
  return jsonData.map(row => ({
    country: row.country || '',
    year: parseInt(row.year) || 0,
    sex: (row.sex || 'M') as 'M' | 'F',
    alcohol_rate: parseFloat(row.alcohol_rate) || 0,
    suicide_rate: parseFloat(row.suicide_rate) || 0,
    accident_rate: parseFloat(row.accident_rate) || 0,
  }));
};

// Migration function
export const migrateDataToSupabase = async (jsonData: any[]) => {
  try {
    console.log('Starting data migration...');
    
    const transformedData = transformJsonToSupabase(jsonData);
    console.log(`Transformed ${transformedData.length} records`);
    
    // Insert in batches to avoid timeout
    const batchSize = 100;
    const batches = [];
    
    for (let i = 0; i < transformedData.length; i += batchSize) {
      batches.push(transformedData.slice(i, i + batchSize));
    }
    
    console.log(`Inserting ${batches.length} batches...`);
    
    for (let i = 0; i < batches.length; i++) {
      await insertMentalHealthData(batches[i]);
      console.log(`Inserted batch ${i + 1}/${batches.length}`);
    }
    
    console.log('Migration completed successfully!');
    return { success: true, recordsInserted: transformedData.length };
    
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error: error.message };
  }
};

// Sample data for testing (if original JSON is not available)
export const sampleData: MentalHealthDataInsert[] = [
  // Germany
  { country: 'DE', year: 2022, sex: 'M', alcohol_rate: 15.2, suicide_rate: 18.1, accident_rate: 12.3 },
  { country: 'DE', year: 2022, sex: 'F', alcohol_rate: 4.1, suicide_rate: 5.8, accident_rate: 4.2 },
  { country: 'DE', year: 2021, sex: 'M', alcohol_rate: 14.8, suicide_rate: 17.9, accident_rate: 11.8 },
  { country: 'DE', year: 2021, sex: 'F', alcohol_rate: 3.9, suicide_rate: 5.6, accident_rate: 4.0 },
  
  // France
  { country: 'FR', year: 2022, sex: 'M', alcohol_rate: 13.7, suicide_rate: 19.2, accident_rate: 10.5 },
  { country: 'FR', year: 2022, sex: 'F', alcohol_rate: 3.8, suicide_rate: 6.1, accident_rate: 3.8 },
  { country: 'FR', year: 2021, sex: 'M', alcohol_rate: 13.2, suicide_rate: 18.8, accident_rate: 10.1 },
  { country: 'FR', year: 2021, sex: 'F', alcohol_rate: 3.6, suicide_rate: 5.9, accident_rate: 3.6 },
  
  // Spain
  { country: 'ES', year: 2022, sex: 'M', alcohol_rate: 11.4, suicide_rate: 14.3, accident_rate: 8.7 },
  { country: 'ES', year: 2022, sex: 'F', alcohol_rate: 2.9, suicide_rate: 4.2, accident_rate: 2.8 },
  { country: 'ES', year: 2021, sex: 'M', alcohol_rate: 11.1, suicide_rate: 14.0, accident_rate: 8.4 },
  { country: 'ES', year: 2021, sex: 'F', alcohol_rate: 2.8, suicide_rate: 4.0, accident_rate: 2.7 },
  
  // Italy
  { country: 'IT', year: 2022, sex: 'M', alcohol_rate: 9.8, suicide_rate: 12.1, accident_rate: 7.2 },
  { country: 'IT', year: 2022, sex: 'F', alcohol_rate: 2.3, suicide_rate: 3.1, accident_rate: 2.1 },
  { country: 'IT', year: 2021, sex: 'M', alcohol_rate: 9.5, suicide_rate: 11.8, accident_rate: 7.0 },
  { country: 'IT', year: 2021, sex: 'F', alcohol_rate: 2.2, suicide_rate: 3.0, accident_rate: 2.0 },
  
  // Poland
  { country: 'PL', year: 2022, sex: 'M', alcohol_rate: 18.9, suicide_rate: 22.4, accident_rate: 15.1 },
  { country: 'PL', year: 2022, sex: 'F', alcohol_rate: 4.7, suicide_rate: 4.8, accident_rate: 4.3 },
  { country: 'PL', year: 2021, sex: 'M', alcohol_rate: 18.3, suicide_rate: 21.9, accident_rate: 14.7 },
  { country: 'PL', year: 2021, sex: 'F', alcohol_rate: 4.5, suicide_rate: 4.6, accident_rate: 4.1 },
];

// Function to populate with sample data
export const populateWithSampleData = async () => {
  try {
    console.log('Populating database with sample data...');
    await insertMentalHealthData(sampleData);
    console.log('Sample data inserted successfully!');
    return { success: true, recordsInserted: sampleData.length };
  } catch (error) {
    console.error('Failed to insert sample data:', error);
    return { success: false, error: error.message };
  }
};
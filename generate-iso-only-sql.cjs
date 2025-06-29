#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the structured JSON data
const jsonPath = path.join(__dirname, 'src/data/structured-mental-health-data.json');
const structuredData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('Processing structured data for ISO countries only...');

// Helper function to check if a country code is a valid 2-character ISO code
const isValidISOCountryCode = (countryCode) => {
  return countryCode.length === 2 && /^[A-Z]{2}$/.test(countryCode);
};

// Convert structured data to flat format for SQL, filtering for ISO codes only
const flattenDataISO = (structured) => {
  const flattened = [];
  
  Object.keys(structured).forEach(country => {
    // Only process ISO country codes
    if (!isValidISOCountryCode(country)) {
      console.log(`Skipping non-ISO code: ${country}`);
      return;
    }
    
    Object.keys(structured[country]).forEach(year => {
      Object.keys(structured[country][year]).forEach(sex => {
        const data = structured[country][year][sex];
        flattened.push({
          country,
          year: parseInt(year),
          sex,
          alcohol_rate: data.alcohol_rate,
          suicide_rate: data.suicide_rate,
          accident_rate: data.accident_rate
        });
      });
    });
  });
  
  return flattened;
};

// Generate SQL INSERT statements
const generateSQL = (data) => {
  const insertStatements = [];
  
  // Add header comment
  insertStatements.push('-- Mental Health Research Data Migration (ISO Countries Only)');
  insertStatements.push('-- Generated from structured JSON data');
  insertStatements.push(`-- Total records: ${data.length}`);
  insertStatements.push('-- European countries: 2011-2022');
  insertStatements.push('-- Only includes 2-character ISO country codes');
  insertStatements.push('-- Excludes aggregates like EU27_2020');
  insertStatements.push('');
  
  // Clear existing data (optional)
  insertStatements.push('-- Clear existing data (uncomment if needed)');
  insertStatements.push('-- DELETE FROM mental_health_data;');
  insertStatements.push('');
  
  // Start transaction for performance
  insertStatements.push('BEGIN;');
  insertStatements.push('');
  
  // Generate INSERT statements in batches for better performance
  const batchSize = 1000;
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    
    insertStatements.push(`-- Batch ${Math.floor(i / batchSize) + 1}: Records ${i + 1}-${Math.min(i + batchSize, data.length)}`);
    insertStatements.push('INSERT INTO mental_health_data (country, year, sex, alcohol_rate, suicide_rate, accident_rate) VALUES');
    
    const values = batch.map(row => {
      return `  ('${row.country}', ${row.year}, '${row.sex}', ${row.alcohol_rate}, ${row.suicide_rate}, ${row.accident_rate})`;
    });
    
    insertStatements.push(values.join(',\n'));
    insertStatements.push('ON CONFLICT (country, year, sex) DO UPDATE SET');
    insertStatements.push('  alcohol_rate = EXCLUDED.alcohol_rate,');
    insertStatements.push('  suicide_rate = EXCLUDED.suicide_rate,');
    insertStatements.push('  accident_rate = EXCLUDED.accident_rate,');
    insertStatements.push('  updated_at = now();');
    insertStatements.push('');
  }
  
  // Commit transaction
  insertStatements.push('COMMIT;');
  insertStatements.push('');
  
  // Add verification queries
  insertStatements.push('-- Verification queries');
  insertStatements.push('SELECT COUNT(*) as total_records FROM mental_health_data;');
  insertStatements.push('SELECT COUNT(DISTINCT country) as unique_countries FROM mental_health_data;');
  insertStatements.push('SELECT MIN(year) as min_year, MAX(year) as max_year FROM mental_health_data;');
  insertStatements.push('SELECT country, COUNT(*) as records FROM mental_health_data GROUP BY country ORDER BY country;');
  insertStatements.push('');
  insertStatements.push('-- Sample data check');
  insertStatements.push("SELECT * FROM mental_health_data WHERE country = 'DE' AND year = 2022 ORDER BY sex;");
  insertStatements.push('');
  insertStatements.push('-- Verify only ISO codes are included');
  insertStatements.push("SELECT DISTINCT country FROM mental_health_data WHERE LENGTH(country) != 2 OR country ~ '[^A-Z]';");
  insertStatements.push('-- Should return no rows if filtering worked correctly');
  
  return insertStatements.join('\n');
};

// Flatten the structured data (ISO only)
const flatData = flattenDataISO(structuredData);

// Generate the SQL
const sql = generateSQL(flatData);

// Write to file
const outputPath = path.join(__dirname, 'mental-health-iso-migration.sql');
fs.writeFileSync(outputPath, sql, 'utf8');

// Get some stats
const allCountries = Object.keys(structuredData);
const isoCountries = allCountries.filter(isValidISOCountryCode).sort();
const nonIsoCountries = allCountries.filter(c => !isValidISOCountryCode(c));

const allYears = new Set();
flatData.forEach(row => allYears.add(row.year));
const years = [...allYears].sort();

console.log('✅ SQL migration file generated for ISO countries only!');
console.log(`📁 File: ${outputPath}`);
console.log(`📊 Records: ${flatData.length}`);
console.log(`🌍 ISO Countries: ${isoCountries.length}`);
console.log(`📅 Years: ${years.length} (${years[0]}-${years[years.length-1]})`);
console.log('');
console.log('✅ Included ISO countries:');
console.log(isoCountries.join(', '));
console.log('');
console.log('❌ Excluded non-ISO entries:');
console.log(nonIsoCountries.join(', '));
console.log('');
console.log('🚀 Next steps:');
console.log('1. Open Supabase Dashboard → SQL Editor');
console.log('2. Copy and paste the contents of mental-health-iso-migration.sql');
console.log('3. Click "Run" to execute the migration');
console.log('4. Verify only ISO country codes are in the database'); 
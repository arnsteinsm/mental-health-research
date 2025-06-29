#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the JSON data
const jsonPath = path.join(__dirname, 'src/data/bquxjob_32b9847_197b3606c2f.json');
const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`Processing ${rawData.length} records...`);

// Generate SQL INSERT statements
const generateSQL = (data) => {
  const insertStatements = [];
  
  // Add header comment
  insertStatements.push('-- Mental Health Research Data Migration');
  insertStatements.push('-- Generated from BigQuery JSON export');
  insertStatements.push(`-- Total records: ${data.length}`);
  insertStatements.push('-- European countries: 2011-2022');
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
      const country = row.country || '';
      const year = parseInt(row.year) || 0;
      const sex = row.sex || 'M';
      const alcoholRate = parseFloat(row.alcohol_rate) || 0;
      const suicideRate = parseFloat(row.suicide_rate) || 0;
      const accidentRate = parseFloat(row.accident_rate) || 0;
      
      return `  ('${country}', ${year}, '${sex}', ${alcoholRate}, ${suicideRate}, ${accidentRate})`;
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
  
  return insertStatements.join('\n');
};

// Generate the SQL
const sql = generateSQL(rawData);

// Write to file
const outputPath = path.join(__dirname, 'mental-health-data-migration.sql');
fs.writeFileSync(outputPath, sql, 'utf8');

// Get some stats
const countries = [...new Set(rawData.map(d => d.country))].sort();
const years = [...new Set(rawData.map(d => d.year))].sort();

console.log('✅ SQL migration file generated successfully!');
console.log(`📁 File: ${outputPath}`);
console.log(`📊 Records: ${rawData.length}`);
console.log(`🌍 Countries: ${countries.length} (${countries.join(', ')})`);
console.log(`📅 Years: ${years.length} (${years[0]}-${years[years.length-1]})`);
console.log('');
console.log('🚀 Next steps:');
console.log('1. Open Supabase Dashboard → SQL Editor');
console.log('2. Copy and paste the contents of mental-health-data-migration.sql');
console.log('3. Click "Run" to execute the migration');
console.log('4. Verify the data was inserted correctly'); 
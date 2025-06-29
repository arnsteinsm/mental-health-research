#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the original JSON data
const jsonPath = path.join(__dirname, 'src/data/bquxjob_32b9847_197b3606c2f.json');
const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`Processing ${rawData.length} records...`);

// Restructure the data
const restructureData = (data) => {
  const structured = {};
  
  data.forEach(row => {
    const country = row.country;
    const year = row.year;
    const sex = row.sex;
    
    // Initialize country if not exists
    if (!structured[country]) {
      structured[country] = {};
    }
    
    // Initialize year if not exists
    if (!structured[country][year]) {
      structured[country][year] = {};
    }
    
    // Add the data for this gender
    structured[country][year][sex] = {
      alcohol_rate: parseFloat(row.alcohol_rate) || 0,
      suicide_rate: parseFloat(row.suicide_rate) || 0,
      accident_rate: parseFloat(row.accident_rate) || 0
    };
  });
  
  return structured;
};

// Restructure the data
const structuredData = restructureData(rawData);

// Get statistics
const countries = Object.keys(structuredData).sort();
const allYears = new Set();
let totalRecords = 0;

countries.forEach(country => {
  const years = Object.keys(structuredData[country]);
  years.forEach(year => {
    allYears.add(year);
    const genders = Object.keys(structuredData[country][year]);
    totalRecords += genders.length;
  });
});

const years = [...allYears].sort();

// Write the restructured data
const outputPath = path.join(__dirname, 'src/data/structured-mental-health-data.json');
fs.writeFileSync(outputPath, JSON.stringify(structuredData, null, 2), 'utf8');

console.log('✅ Data restructured successfully!');
console.log(`📁 Output: ${outputPath}`);
console.log(`📊 Total records: ${totalRecords}`);
console.log(`🌍 Countries: ${countries.length}`);
console.log(`📅 Years: ${years.length} (${years[0]}-${years[years.length-1]})`);
console.log('');
console.log('📋 Countries included:');
console.log(countries.join(', '));
console.log('');
console.log('📋 Structure example:');
console.log(JSON.stringify({
  [countries[0]]: {
    [years[0]]: structuredData[countries[0]][years[0]]
  }
}, null, 2)); 
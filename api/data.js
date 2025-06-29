// api/data.js - Vercel Edge Function
// Serves your beautiful JSON with flexible server-side querying

import aggrData from '../src/data/aggr_data.json';

export default function handler(req, res) {
  // Enable CORS for your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { country, year, sex, format, limit } = req.query;
  
  try {
    let filtered = [...aggrData];
    
    // Apply filters
    if (country) {
      const countries = Array.isArray(country) ? country : [country];
      filtered = filtered.filter(d => countries.includes(d.country));
    }
    
    if (year) {
      const years = Array.isArray(year) ? year : [year];
      filtered = filtered.filter(d => years.includes(d.year));
    }
    
    if (sex && sex !== 'both') {
      filtered = filtered.filter(d => d.sex === sex);
    }
    
    // Apply limit
    if (limit) {
      const limitNum = Number.parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        filtered = filtered.slice(0, limitNum);
      }
    }
    
    // Format response
    if (format === 'nested') {
      const nested = createNestedStructure(filtered);
      return res.status(200).json(nested);
    }
    
    if (format === 'stats') {
      const stats = calculateStats(filtered);
      return res.status(200).json(stats);
    }
    
    // Default: return filtered array
    res.status(200).json({
      data: filtered,
      count: filtered.length,
      filters: { country, year, sex, format, limit }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper: Create nested Country -> Year -> Sex structure
function createNestedStructure(data) {
  const nested = {};
  
  data.forEach(record => {
    if (!nested[record.country]) nested[record.country] = {};
    if (!nested[record.country][record.year]) nested[record.country][record.year] = {};
    
    nested[record.country][record.year][record.sex] = {
      alcohol_rate: record.alcohol_rate,
      suicide_rate: record.suicide_rate,
      population_over_15: record.population_over_15,
      est_alcohol_deaths: record.est_alcohol_deaths,
      est_suicide_deaths: record.est_suicide_deaths
    };
  });
  
  // Add totals (T) for each country/year
  addTotalsToNested(nested);
  
  return nested;
}

// Helper: Add calculated totals
function addTotalsToNested(nested) {
  Object.keys(nested).forEach(country => {
    Object.keys(nested[country]).forEach(year => {
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
          (maleAlcoholRate * malePopulation + femaleAlcoholRate * femalePopulation) / totalPopulation
        ).toFixed(2);
        
        const totalSuicideRate = (
          (maleSuicideRate * malePopulation + femaleSuicideRate * femalePopulation) / totalPopulation
        ).toFixed(2);
        
        // Sum estimated deaths
        const totalAlcoholDeaths = (
          Number.parseFloat(maleData.est_alcohol_deaths) + Number.parseFloat(femaleData.est_alcohol_deaths)
        ).toFixed(1);
        
        const totalSuicideDeaths = (
          Number.parseFloat(maleData.est_suicide_deaths) + Number.parseFloat(femaleData.est_suicide_deaths)
        ).toFixed(1);
        
        yearData.T = {
          alcohol_rate: totalAlcoholRate,
          suicide_rate: totalSuicideRate,
          population_over_15: totalPopulation.toString(),
          est_alcohol_deaths: totalAlcoholDeaths,
          est_suicide_deaths: totalSuicideDeaths
        };
      }
    });
  });
}

// Helper: Calculate statistics
function calculateStats(data) {
  const countries = [...new Set(data.map(d => d.country))];
  const years = [...new Set(data.map(d => d.year))].sort();
  
  return {
    totalRecords: data.length,
    uniqueCountries: countries.length,
    countries: countries.sort(),
    years,
    yearRange: {
      start: Math.min(...years.map(y => Number.parseInt(y, 10))),
      end: Math.max(...years.map(y => Number.parseInt(y, 10)))
    },
    genderSplit: {
      male: data.filter(d => d.sex === 'M').length,
      female: data.filter(d => d.sex === 'F').length
    },
    avgAlcoholRate: {
      male: calculateAverage(data.filter(d => d.sex === 'M'), 'alcohol_rate'),
      female: calculateAverage(data.filter(d => d.sex === 'F'), 'alcohol_rate')
    },
    avgSuicideRate: {
      male: calculateAverage(data.filter(d => d.sex === 'M'), 'suicide_rate'),
      female: calculateAverage(data.filter(d => d.sex === 'F'), 'suicide_rate')
    }
  };
}

// Helper: Calculate average
function calculateAverage(data, field) {
  const values = data.map(d => Number.parseFloat(d[field])).filter(v => !isNaN(v));
  return values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : 0;
} 
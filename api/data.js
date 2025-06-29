// api/data.js
// Mental Health & Alcohol Mortality Data API

import aggrData from '../src/data/aggr_data.json';
import { countryNames } from '../src/data/index.ts';

// Transform flat data into nested structure for API responses
function createNestedData() {
  const nested = {};

  aggrData.forEach((record) => {
    if (!nested[record.country]) nested[record.country] = {};
    if (!nested[record.country][record.year]) nested[record.country][record.year] = {};

    nested[record.country][record.year][record.sex] = {
      alcohol_rate: Number.parseFloat(record.alcohol_rate),
      suicide_rate: Number.parseFloat(record.suicide_rate),
      population_over_15: Number.parseInt(record.population_over_15),
      est_alcohol_deaths: Number.parseFloat(record.est_alcohol_deaths),
      est_suicide_deaths: Number.parseFloat(record.est_suicide_deaths),
    };
  });

  // Add totals (T) for each country/year
  Object.keys(nested).forEach((country) => {
    Object.keys(nested[country]).forEach((year) => {
      const yearData = nested[country][year];
      const M = yearData.M;
      const F = yearData.F;

      if (M && F) {
        const totalPop = M.population_over_15 + F.population_over_15;

        yearData.T = {
          alcohol_rate: Number.parseFloat(
            (
              (M.alcohol_rate * M.population_over_15 + F.alcohol_rate * F.population_over_15) /
              totalPop
            ).toFixed(2)
          ),
          suicide_rate: Number.parseFloat(
            (
              (M.suicide_rate * M.population_over_15 + F.suicide_rate * F.population_over_15) /
              totalPop
            ).toFixed(2)
          ),
          population_over_15: totalPop,
          est_alcohol_deaths: Number.parseFloat(
            (M.est_alcohol_deaths + F.est_alcohol_deaths).toFixed(1)
          ),
          est_suicide_deaths: Number.parseFloat(
            (M.est_suicide_deaths + F.est_suicide_deaths).toFixed(1)
          ),
        };
      }
    });
  });

  return nested;
}

const nestedData = createNestedData();
const availableCountries = Object.keys(nestedData).sort();
const availableYears = [...new Set(aggrData.map((d) => d.year))].sort();

// Calculate summary statistics
function calculateSummary(filters = {}) {
  let filteredData = aggrData;

  if (filters.country) {
    filteredData = filteredData.filter((d) => d.country === filters.country);
  }
  if (filters.sex) {
    filteredData = filteredData.filter((d) => d.sex === filters.sex);
  }
  if (filters.year) {
    filteredData = filteredData.filter((d) => d.year === filters.year);
  }

  if (filteredData.length === 0) return null;

  const alcoholRates = filteredData.map((d) => Number.parseFloat(d.alcohol_rate));
  const suicideRates = filteredData.map((d) => Number.parseFloat(d.suicide_rate));

  return {
    records: filteredData.length,
    alcohol_rate: {
      average: Number.parseFloat(
        (alcoholRates.reduce((a, b) => a + b, 0) / alcoholRates.length).toFixed(2)
      ),
      min: Math.min(...alcoholRates),
      max: Math.max(...alcoholRates),
    },
    suicide_rate: {
      average: Number.parseFloat(
        (suicideRates.reduce((a, b) => a + b, 0) / suicideRates.length).toFixed(2)
      ),
      min: Math.min(...suicideRates),
      max: Math.max(...suicideRates),
    },
    total_estimated_deaths: {
      alcohol: Number.parseFloat(
        filteredData.reduce((sum, d) => sum + Number.parseFloat(d.est_alcohol_deaths), 0).toFixed(1)
      ),
      suicide: Number.parseFloat(
        filteredData.reduce((sum, d) => sum + Number.parseFloat(d.est_suicide_deaths), 0).toFixed(1)
      ),
    },
  };
}

// Main API handler
export default function handler(req, res) {
  const { method, url } = req;
  const path = new URL(url, `http://${req.headers.host}`).pathname;
  const searchParams = new URL(url, `http://${req.headers.host}`).searchParams;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Route handling
    if (path === '/') {
      return res.json({
        message: 'Behind the Drink API - Mental Health & Alcohol Dataset',
        version: '1.0.0',
        description: 'European mental health and alcohol mortality data (2011-2022)',
        endpoints: {
          '/': 'API information',
          '/countries': 'List available countries',
          '/data/:country': 'Get all data for a country',
          '/data/:country/:year': 'Get data for country and year',
          '/summary': 'Dataset statistics',
          '/metadata': 'Dataset metadata',
        },
        documentation: 'https://behind-the-drink.xyz',
        source: 'Hybrid JSON Architecture - Lightning Fast',
      });
    }

    if (path === '/countries') {
      return res.json({
        countries: availableCountries,
        count: availableCountries.length,
        names: countryNames,
      });
    }

    if (path === '/metadata') {
      return res.json({
        dataset: {
          title: 'European Mental Health and Alcohol Mortality Analysis',
          description: 'Age-standardized mortality rates per 100,000 population',
          coverage: {
            countries: availableCountries.length,
            years: availableYears.length,
            timespan: `${availableYears[0]}-${availableYears[availableYears.length - 1]}`,
            total_records: aggrData.length,
          },
          methodology: 'BigQuery → Enhanced JSON',
          last_updated: new Date().toISOString().split('T')[0],
          license: 'CC BY 4.0',
        },
      });
    }

    if (path === '/summary') {
      const country = searchParams.get('country');
      const sex = searchParams.get('sex');
      const year = searchParams.get('year');

      const summary = calculateSummary({ country, sex, year });

      if (!summary) {
        return res.status(404).json({ error: 'No data found for specified filters' });
      }

      return res.json({
        filters: { country, sex, year },
        summary,
      });
    }

    // Handle /data/:country and /data/:country/:year
    const dataMatch = path.match(/^\/data\/([A-Z]{2})(?:\/(\d{4}))?$/);
    if (dataMatch) {
      const [, country, year] = dataMatch;

      if (!nestedData[country]) {
        return res.status(404).json({
          error: `Country '${country}' not found`,
          available_countries: availableCountries,
        });
      }

      if (year) {
        if (!nestedData[country][year]) {
          return res.status(404).json({
            error: `Data for ${country} in ${year} not found`,
            available_years: Object.keys(nestedData[country]).sort(),
          });
        }

        return res.json({
          country,
          country_name: countryNames[country] || country,
          year,
          data: nestedData[country][year],
        });
      }

      return res.json({
        country,
        country_name: countryNames[country] || country,
        years: Object.keys(nestedData[country]).sort(),
        data: nestedData[country],
      });
    }

    // 404 for unknown routes
    return res.status(404).json({
      error: 'Endpoint not found',
      available_endpoints: [
        '/',
        '/countries',
        '/data/:country',
        '/data/:country/:year',
        '/summary',
        '/metadata',
      ],
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

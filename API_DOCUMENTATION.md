# Behind the Drink API Documentation

**Base URL**: `https://api.behind-the-drink.xyz`

## 📋 Overview

The Behind the Drink API provides access to European mental health and alcohol mortality data (2011-2022) covering 34 countries. All endpoints return JSON responses and support CORS for web applications.

## 🔑 Authentication

**Currently Open Access** - No API key required
- Light rate limiting applied
- Perfect for demos, research, and hackathons

## 📊 Data Structure

### Core Data Fields
```json
{
  "alcohol_rate": 16.3,           // Age-standardized rate per 100,000
  "suicide_rate": 12.8,           // Age-standardized rate per 100,000  
  "population_over_15": 7234567,  // Population base for calculations
  "est_alcohol_deaths": 1180.5,   // Estimated deaths
  "est_suicide_deaths": 925.2     // Estimated deaths
}
```

### Sex Categories
- `M` - Male data
- `F` - Female data  
- `T` - Total (calculated weighted average)

## 🛠 API Endpoints

### 1. GET `/`
**Purpose**: API information and health check

**Response**:
```json
{
  "message": "Behind the Drink API - Mental Health & Alcohol Dataset",
  "version": "1.0.0",
  "description": "European mental health and alcohol mortality data (2011-2022)",
  "endpoints": {
    "/": "API information",
    "/countries": "List available countries",
    "/data/:country": "Get all data for a country",
    "/data/:country/:year": "Get data for country and year",
    "/summary": "Dataset statistics",
    "/metadata": "Dataset metadata"
  },
  "documentation": "https://behind-the-drink.xyz",
  "source": "Hybrid JSON Architecture - Lightning Fast"
}
```

### 2. GET `/countries`
**Purpose**: List all available countries

**Response**:
```json
{
  "countries": ["AT", "BE", "BG", "CH", "CY", "CZ", "DE", "DK", "EE", "EL", "ES", "FI", "FR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MT", "NL", "NO", "PL", "PT", "RO", "RS", "SE", "SI", "SK", "TR", "UK"],
  "count": 34,
  "names": {
    "AT": "Austria",
    "DE": "Germany",
    "FR": "France"
    // ... full country name mapping
  }
}
```

### 3. GET `/data/:country`
**Purpose**: Get all yearly data for a specific country

**Example**: `/data/AT`

**Response**:
```json
{
  "country": "AT",
  "country_name": "Austria", 
  "years": ["2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"],
  "data": {
    "2011": {
      "M": {
        "alcohol_rate": 22.49,
        "suicide_rate": 18.65,
        "population_over_15": 3234567,
        "est_alcohol_deaths": 727.2,
        "est_suicide_deaths": 603.2
      },
      "F": {
        "alcohol_rate": 6.12,
        "suicide_rate": 5.84,
        "population_over_15": 3456789,
        "est_alcohol_deaths": 211.5,
        "est_suicide_deaths": 201.8
      },
      "T": {
        "alcohol_rate": 13.89,
        "suicide_rate": 11.87,
        "population_over_15": 6691356,
        "est_alcohol_deaths": 938.7,
        "est_suicide_deaths": 805.0
      }
    }
    // ... data for other years
  }
}
```

### 4. GET `/data/:country/:year`
**Purpose**: Get data for a specific country and year

**Example**: `/data/DE/2020`

**Response**:
```json
{
  "country": "DE",
  "country_name": "Germany",
  "year": "2020", 
  "data": {
    "M": {
      "alcohol_rate": 16.84,
      "suicide_rate": 15.12,
      "population_over_15": 35123456,
      "est_alcohol_deaths": 5918.2,
      "est_suicide_deaths": 5312.7
    },
    "F": {
      "alcohol_rate": 4.23,
      "suicide_rate": 4.89,
      "population_over_15": 36234567,
      "est_alcohol_deaths": 1533.5,
      "est_suicide_deaths": 1772.1
    },
    "T": {
      "alcohol_rate": 10.34,
      "suicide_rate": 9.87,
      "population_over_15": 71358023,
      "est_alcohol_deaths": 7451.7,
      "est_suicide_deaths": 7084.8
    }
  }
}
```

### 5. GET `/summary`
**Purpose**: Get statistical summaries with optional filtering

**Query Parameters**:
- `country` - Filter by country code (e.g., `AT`)
- `sex` - Filter by sex (`M`, `F`) 
- `year` - Filter by year (e.g., `2020`)

**Example**: `/summary?country=AT&sex=M`

**Response**:
```json
{
  "filters": {
    "country": "AT",
    "sex": "M", 
    "year": null
  },
  "summary": {
    "records": 12,
    "alcohol_rate": {
      "average": 21.34,
      "min": 19.82,
      "max": 23.15
    },
    "suicide_rate": {
      "average": 17.89,
      "min": 15.23,
      "max": 20.45
    },
    "total_estimated_deaths": {
      "alcohol": 8234.5,
      "suicide": 6789.2
    }
  }
}
```

### 6. GET `/metadata`
**Purpose**: Dataset metadata and coverage information

**Response**:
```json
{
  "dataset": {
    "title": "European Mental Health and Alcohol Mortality Analysis",
    "description": "Age-standardized mortality rates per 100,000 population",
    "coverage": {
      "countries": 34,
      "years": 12,
      "timespan": "2011-2022",
      "total_records": 816
    },
    "methodology": "BigQuery → Enhanced JSON",
    "last_updated": "2024-01-15",
    "license": "CC BY 4.0"
  }
}
```

## 🚀 Usage Examples

### JavaScript/Fetch
```javascript
// Get all countries
const countries = await fetch('https://api.behind-the-drink.xyz/countries')
  .then(res => res.json());

// Get Austria data for 2020
const austriaData = await fetch('https://api.behind-the-drink.xyz/data/AT/2020')
  .then(res => res.json());

// Get male suicide statistics
const maleStats = await fetch('https://api.behind-the-drink.xyz/summary?sex=M')
  .then(res => res.json());
```

### Python/Requests
```python
import requests

# Get dataset metadata
metadata = requests.get('https://api.behind-the-drink.xyz/metadata').json()

# Get Germany data
germany = requests.get('https://api.behind-the-drink.xyz/data/DE').json()

# Compare male vs female rates
male_summary = requests.get('https://api.behind-the-drink.xyz/summary?sex=M').json()
female_summary = requests.get('https://api.behind-the-drink.xyz/summary?sex=F').json()
```

### cURL
```bash
# Test API health
curl https://api.behind-the-drink.xyz/

# Get available countries
curl https://api.behind-the-drink.xyz/countries

# Get Poland 2022 data
curl https://api.behind-the-drink.xyz/data/PL/2022
```

## ⚡ Performance & Caching

- **Response Time**: < 100ms (static JSON)
- **Cache Headers**: 1 hour cache, 24 hour stale-while-revalidate
- **Rate Limiting**: Light limits for fair usage
- **CORS**: Enabled for all origins

## 📈 Roadmap

### Phase 2 (Future)
- `GET /compare?country1=AT&country2=DE` - Country comparisons
- `GET /correlations` - Pre-calculated correlation matrices
- `GET /trends/:country` - Time series analysis
- Authentication for higher rate limits

### Phase 3 (Advanced)
- GraphQL endpoint
- Real-time data updates
- Custom aggregations
- Webhook subscriptions

## 🔗 Links

- **Main Site**: https://behind-the-drink.xyz
- **GitHub**: https://github.com/arnsteinsm/mental-health-research
- **Data Sources**: Eurostat mortality and population data
- **License**: CC BY 4.0

## 💬 Support

For API support, feature requests, or data questions:
- GitHub Issues: [mental-health-research/issues](https://github.com/arnsteinsm/mental-health-research/issues)
- Built for public health advocacy and research transparency 
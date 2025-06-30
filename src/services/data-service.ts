// src/services/data-service.ts

import { useQuery } from "@tanstack/react-query";
import { aggrData, countryNames, type EnhancedDataPoint } from "../data";

// Nested data structure: Country -> Year -> Sex -> Data
export interface NestedData {
	[country: string]: {
		[year: string]: {
			[sex: string]: {
				alcohol_rate: string;
				suicide_rate: string;
				population_total: string;
				est_alcohol_deaths: string;
				est_suicide_deaths: string;
			};
		};
	};
}

// API Types
interface CountryDataResponse {
	country: string;
	country_name: string;
	data: Record<string, Record<string, any>>;
}

interface SummaryResponse {
	total_countries: number;
	years_covered: string[];
	data_points: number;
	last_updated: string;
}

const _API_BASE_URL = "https://api.behind-the-drink.xyz";
_API_BASE_URL;
// API Client for fallback data fetching
class APIClient {
	private baseURL = "https://api.behind-the-drink.xyz";

	async getAllCountries(): Promise<{ countries: Record<string, string> }> {
		const response = await fetch(`${this.baseURL}/v1/countries`);
		if (!response.ok) {
			throw new Error(`Failed to fetch countries: ${response.status}`);
		}
		return response.json();
	}

	async getCountryData(countryCode: string): Promise<CountryDataResponse> {
		const response = await fetch(`${this.baseURL}/v1/data/${countryCode}`);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch data for ${countryCode}: ${response.status}`,
			);
		}
		return response.json();
	}

	async getSummary(): Promise<SummaryResponse> {
		const response = await fetch(`${this.baseURL}/v1/summary`);
		if (!response.ok) {
			throw new Error(`Failed to fetch summary: ${response.status}`);
		}
		return response.json();
	}

	async checkAvailability(): Promise<boolean> {
		try {
			const response = await fetch(`${this.baseURL}/v1/metadata`, {
				method: "HEAD",
			});
			return response.ok;
		} catch {
			return false;
		}
	}

	async getAllData(): Promise<EnhancedDataPoint[]> {
		try {
			// Get list of countries first
			const countriesResponse = await this.getAllCountries();
			const countryList = Object.keys(countriesResponse.countries);

			console.log(
				`🌐 Fetching data for ${countryList.length} countries from API...`,
			);

			// Fetch all countries in parallel
			const countryDataPromises = countryList.map(async (country) => {
				try {
					return await this.getDataByCountry(country);
				} catch (_error) {
					console.warn(`⚠️ Failed to fetch data for ${country}, skipping`);
					return [];
				}
			});

			const allCountryData = await Promise.all(countryDataPromises);

			// Flatten all data into a single array
			const flatData: EnhancedDataPoint[] = [];
			for (const countryData of allCountryData) {
				flatData.push(...countryData);
			}

			if (flatData.length === 0) {
				throw new Error("No data retrieved from any country");
			}

			console.log(
				`✅ Successfully fetched ${flatData.length} records from API`,
			);
			return flatData;
		} catch (error) {
			console.error("❌ Failed to fetch all data from API:", error);
			throw error;
		}
	}

	async getDataByCountry(country: string): Promise<EnhancedDataPoint[]> {
		try {
			const response = await this.getCountryData(country);

			// Transform the nested structure into flat array
			const flatData: EnhancedDataPoint[] = [];
			for (const [year, yearData] of Object.entries(response.data)) {
				for (const [sex, sexData] of Object.entries(yearData)) {
					if (sex === "M" || sex === "F") {
						// Skip totals ('T')
						flatData.push({
							country: response.country,
							country_name: response.country_name,
							year,
							sex: sex as "M" | "F",
							alcohol_rate: sexData.alcohol_rate.toString(),
							suicide_rate: sexData.suicide_rate.toString(),
							population_total: sexData.population_total.toString(),
							est_alcohol_deaths: sexData.est_alcohol_deaths.toString(),
							est_suicide_deaths: sexData.est_suicide_deaths.toString(),
						});
					}
				}
			}

			return flatData;
		} catch (error) {
			console.error(`❌ Failed to fetch data for country ${country}:`, error);
			throw error;
		}
	}
}

// Data Service with API fallback
export class DataService {
	private apiClient = new APIClient();

	// Primary method with fallback capability
	async getAllWithFallback(): Promise<{
		data: EnhancedDataPoint[];
		source: "local" | "api";
	}> {
		// First try local data
		try {
			if (aggrData && aggrData.length > 0) {
				console.log(`✅ Using local data: ${aggrData.length} records`);
				return { data: aggrData, source: "local" };
			}
		} catch (error) {
			console.warn("⚠️ Local data failed, falling back to API:", error);
		}

		// Fallback to API
		try {
			const apiData = await this.apiClient.getAllData();
			console.log(`🌐 Using API data: ${apiData.length} records`);
			return { data: apiData, source: "api" };
		} catch (error) {
			console.error("❌ Both local and API data failed:", error);
			throw new Error("No data source available");
		}
	}

	// Get all data instantly (legacy method)
	static getAll(): EnhancedDataPoint[] {
		return aggrData;
	}

	// Filter by country
	static getByCountry(country: string): EnhancedDataPoint[] {
		return aggrData.filter((d) => d.country === country);
	}

	// Filter by year
	static getByYear(year: string): EnhancedDataPoint[] {
		return aggrData.filter((d) => d.year === year);
	}

	// Filter by sex
	static getBySex(sex: "M" | "F"): EnhancedDataPoint[] {
		return aggrData.filter((d) => d.sex === sex);
	}

	// Complex filtering
	static getFiltered(filters: {
		countries?: string[];
		years?: string[];
		sex?: "M" | "F" | "both";
	}): EnhancedDataPoint[] {
		let filtered = aggrData;

		if (filters.countries?.length) {
			filtered = filtered.filter((d) => filters.countries?.includes(d.country));
		}

		if (filters.years?.length) {
			filtered = filtered.filter((d) => filters.years?.includes(d.year));
		}

		if (filters.sex && filters.sex !== "both") {
			filtered = filtered.filter((d) => d.sex === filters.sex);
		}

		return filtered;
	}

	// Create nested structure: Country -> Year -> Sex -> Data
	static getNestedData(): NestedData {
		const nested: NestedData = {};

		aggrData.forEach((record) => {
			if (!nested[record.country]) nested[record.country] = {};
			if (!nested[record.country][record.year])
				nested[record.country][record.year] = {};

			nested[record.country][record.year][record.sex] = {
				alcohol_rate: record.alcohol_rate,
				suicide_rate: record.suicide_rate,
				population_total: record.population_total,
				est_alcohol_deaths: record.est_alcohol_deaths,
				est_suicide_deaths: record.est_suicide_deaths,
			};
		});

		// Add totals (T) for each country/year combination
		DataService.addTotalsToNested(nested);

		return nested;
	}

	// Add calculated totals (T) to nested data
	private static addTotalsToNested(nested: NestedData): void {
		Object.keys(nested).forEach((country) => {
			Object.keys(nested[country]).forEach((year) => {
				const yearData = nested[country][year];
				const maleData = yearData.M;
				const femaleData = yearData.F;

				if (maleData && femaleData) {
					const malePopulation = Number.parseFloat(maleData.population_total);
					const femalePopulation = Number.parseFloat(
						femaleData.population_total,
					);
					const totalPopulation = malePopulation + femalePopulation;

					// Weighted averages for rates
					const maleAlcoholRate = Number.parseFloat(maleData.alcohol_rate);
					const femaleAlcoholRate = Number.parseFloat(femaleData.alcohol_rate);
					const maleSuicideRate = Number.parseFloat(maleData.suicide_rate);
					const femaleSuicideRate = Number.parseFloat(femaleData.suicide_rate);

					const totalAlcoholRate = (
						(maleAlcoholRate * malePopulation +
							femaleAlcoholRate * femalePopulation) /
						totalPopulation
					).toFixed(2);

					const totalSuicideRate = (
						(maleSuicideRate * malePopulation +
							femaleSuicideRate * femalePopulation) /
						totalPopulation
					).toFixed(2);

					// Sum estimated deaths
					const totalAlcoholDeaths = (
						Number.parseFloat(maleData.est_alcohol_deaths) +
						Number.parseFloat(femaleData.est_alcohol_deaths)
					).toFixed(1);

					const totalSuicideDeaths = (
						Number.parseFloat(maleData.est_suicide_deaths) +
						Number.parseFloat(femaleData.est_suicide_deaths)
					).toFixed(1);

					yearData.T = {
						alcohol_rate: totalAlcoholRate,
						suicide_rate: totalSuicideRate,
						population_total: totalPopulation.toString(),
						est_alcohol_deaths: totalAlcoholDeaths,
						est_suicide_deaths: totalSuicideDeaths,
					};
				}
			});
		});
	}

	// Get available countries
	static getAvailableCountries(): string[] {
		return [...new Set(aggrData.map((d) => d.country))].sort();
	}

	// Get available years
	static getAvailableYears(): string[] {
		return [...new Set(aggrData.map((d) => d.year))].sort();
	}

	// Check if local data is available
	static hasLocalDataAvailable(): boolean {
		return aggrData && aggrData.length > 0;
	}

	// Get dataset statistics
	static getDatasetStats() {
		const countries = DataService.getAvailableCountries();
		const years = DataService.getAvailableYears();

		return {
			totalRecords: aggrData.length,
			uniqueCountries: countries.length,
			countries,
			years,
			yearRange: {
				start: Math.min(...years.map((y) => Number.parseInt(y, 10))),
				end: Math.max(...years.map((y) => Number.parseInt(y, 10))),
			},
			genderSplit: {
				male: aggrData.filter((d) => d.sex === "M").length,
				female: aggrData.filter((d) => d.sex === "F").length,
			},
		};
	}
}

// TanStack Query hooks with API fallback
export const useResearchData = () => {
	return useQuery({
		queryKey: ["research-data"],
		queryFn: async () => {
			try {
				const dataService = new DataService();
				const result = await dataService.getAllWithFallback();
				return result.data;
			} catch (error) {
				console.error("Failed to load research data:", error);
				// Return empty array as last resort
				return [];
			}
		},
		staleTime: 5 * 60 * 1000, // 5 minutes for API data
		gcTime: Number.POSITIVE_INFINITY, // Keep forever in memory
		retry: 2, // Retry failed requests
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});
};

// Nested data hook
export const useNestedData = () => {
	return useQuery({
		queryKey: ["nested-data"],
		queryFn: async () => {
			console.log("🏗️ Building nested structure with totals...");
			return DataService.getNestedData();
		},
		staleTime: Number.POSITIVE_INFINITY,
		gcTime: Number.POSITIVE_INFINITY,
	});
};

// Data availability hook
export const useDataAvailability = () => {
	return useQuery({
		queryKey: ["data-availability"],
		queryFn: async () => {
			const hasLocal = DataService.hasLocalDataAvailable();
			if (hasLocal) {
				return { source: "local", available: true };
			}

			// Test API availability
			try {
				await checkDataAvailability();
				return { source: "api", available: true };
			} catch {
				return { source: "none", available: false };
			}
		},
		staleTime: 2 * 60 * 1000, // Check every 2 minutes
		gcTime: 5 * 60 * 1000,
	});
};

// Filtered data hook
export const useFilteredData = (filters: {
	countries?: string[];
	years?: string[];
	sex?: "M" | "F" | "both";
}) => {
	return useQuery({
		queryKey: ["filtered-data", filters],
		queryFn: async () => {
			console.log("🔍 Client-side filtering:", filters);
			return DataService.getFiltered(filters);
		},
		staleTime: Number.POSITIVE_INFINITY,
		gcTime: 5 * 60 * 1000, // 5 minutes for filtered results
	});
};

// Country stats hook
export const useCountryStats = (countryCode: string) => {
	return useQuery({
		queryKey: ["country-stats", countryCode],
		queryFn: async () => {
			const data = DataService.getByCountry(countryCode);

			// Calculate statistics from the data
			const maleData = data.filter((d) => d.sex === "M");
			const femaleData = data.filter((d) => d.sex === "F");

			const calculateAvg = (
				data: EnhancedDataPoint[],
				field: keyof EnhancedDataPoint,
			) => {
				const values = data
					.map((d) => Number.parseFloat(d[field] as string))
					.filter((v) => !Number.isNaN(v));
				return values.length > 0
					? values.reduce((a, b) => a + b, 0) / values.length
					: 0;
			};

			return {
				country: countryCode,
				name: countryNames[countryCode] || countryCode,
				years: [...new Set(data.map((d) => d.year))].sort(),
				male: {
					avgAlcoholRate: calculateAvg(maleData, "alcohol_rate"),
					avgSuicideRate: calculateAvg(maleData, "suicide_rate"),
					totalPopulation: maleData.reduce(
						(sum, d) => sum + Number.parseFloat(d.population_total),
						0,
					),
				},
				female: {
					avgAlcoholRate: calculateAvg(femaleData, "alcohol_rate"),
					avgSuicideRate: calculateAvg(femaleData, "suicide_rate"),
					totalPopulation: femaleData.reduce(
						(sum, d) => sum + Number.parseFloat(d.population_total),
						0,
					),
				},
			};
		},
		staleTime: Number.POSITIVE_INFINITY,
		gcTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!countryCode,
	});
};

// Dataset statistics hook
export const useDatasetStats = () => {
	return useQuery({
		queryKey: ["dataset-stats"],
		queryFn: async () => {
			console.log("📊 Computing dataset statistics...");
			return DataService.getDatasetStats();
		},
		staleTime: Number.POSITIVE_INFINITY,
		gcTime: Number.POSITIVE_INFINITY,
	});
};

// Export utilities
export { countryNames };

// Legacy compatibility
export interface DataPoint extends EnhancedDataPoint {}

// Export dataset stats for backward compatibility
export const datasetStats = {
	totalRecords: aggrData.length,
	countries: DataService.getAvailableCountries(),
	years: DataService.getAvailableYears(),
	yearRange: { start: 2011, end: 2022 },
	genderSplit: {
		male: aggrData.filter((d) => d.sex === "M").length,
		female: aggrData.filter((d) => d.sex === "F").length,
	},
};

// Data availability check
export async function checkDataAvailability(): Promise<{
	source: "local" | "api";
	available: boolean;
}> {
	// First try local data
	try {
		if (aggrData && aggrData.length > 0) {
			return { source: "local", available: true };
		}
	} catch (error) {
		console.warn("⚠️ Local data not available:", error);
	}

	// Test API availability
	try {
		const apiClient = new APIClient();
		const isAvailable = await apiClient.checkAvailability();
		return { source: "api", available: isAvailable };
	} catch {
		return { source: "api", available: false };
	}
}

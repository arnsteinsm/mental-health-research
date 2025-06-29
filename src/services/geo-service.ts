import { useQuery } from '@tanstack/react-query';
import {
  detectUserCountry,
  getPreselectionMessage,
  getSuggestedCountries,
} from '../utils/geoLocation';

export interface GeoDetectionResult {
  detectedCountry: string | null;
  suggestedCountries: string[];
  message: string;
  isDetected: boolean;
}

// Query function for geo-detection
const fetchGeoLocation = async (): Promise<GeoDetectionResult> => {
  try {
    const detectedCountry = await detectUserCountry();
    const suggestedCountries = getSuggestedCountries(detectedCountry);
    const message = getPreselectionMessage(detectedCountry);

    return {
      detectedCountry,
      suggestedCountries,
      message,
      isDetected: !!detectedCountry,
    };
  } catch (error) {
    console.error('Geo-detection error:', error);
    return {
      detectedCountry: null,
      suggestedCountries: [],
      message: 'Unable to detect location. You can manually select countries below.',
      isDetected: false,
    };
  }
};

// Custom hook using TanStack Query
export const useGeoDetection = (enabled = false) => {
  return useQuery({
    queryKey: ['geo-detection'],
    queryFn: fetchGeoLocation,
    enabled, // Only run when explicitly enabled
    staleTime: 5 * 60 * 1000, // 5 minutes - geo location doesn't change often
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    retry: 2, // Retry twice on failure
    retryDelay: 1000, // 1 second between retries
  });
};

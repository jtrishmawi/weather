import { fetchAirQualityForLocations } from "@/services/air-quality";
import {
  fetchGeolocation,
  isPermanentGeolocationError,
} from "@/services/geolocation";
import { fetchAddress } from "@/services/reverse-geocoding";
import { fetchWeatherForLocations } from "@/services/weather";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// Retries, exponential backoff, caching and localStorage persistence all come
// from TanStack Query (see main.tsx / query-client.ts); these hooks only
// declare per-resource policy.

export const useGeolocation = () =>
  useQuery({
    queryKey: ["geolocation"],
    queryFn: fetchGeolocation,
    staleTime: 5 * 60 * 1000,
    // Timeouts and missing fixes are worth a few attempts; permanent errors
    // (denied, unsupported) are not.
    retry: (failureCount, error) =>
      !isPermanentGeolocationError(error) && failureCount < 3,
  });

export const useWeatherForLocations = (locations: WeatherLocation[]) =>
  useQuery({
    queryKey: ["weather", locations],
    queryFn: () => fetchWeatherForLocations(locations),
    enabled: locations.length > 0,
    // Keep showing the previous cities' data while a newly added city is
    // being fetched, instead of falling back to the loading screen.
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
  });

export const useAirQualityForLocations = (locations: WeatherLocation[]) =>
  useQuery({
    queryKey: ["airQuality", locations],
    queryFn: () => fetchAirQualityForLocations(locations),
    enabled: locations.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
  });

export const useAddress = (coords: GeolocationObject | undefined, lang: Lang) =>
  useQuery({
    // lang is part of the key so a persisted response in one language isn't
    // served to a session running in another.
    queryKey: ["address", coords, lang],
    queryFn: () => fetchAddress(coords!, lang),
    enabled: !!coords,
    staleTime: Infinity,
  });

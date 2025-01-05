import { reverseGeocode } from "@/services/reverse-geocoding";
import { useQuery } from "@tanstack/react-query";

type GeocodingParams = {
  latitude: number | null;
  longitude: number | null;
};

export const useReverseGeocoding = (params?: GeocodingParams) => {
  return useQuery({
    queryKey: [
      "geocoding",
      { latitude: params?.latitude, longitude: params?.longitude },
    ],
    queryFn: () => {
      if (!params || !params.latitude || !params.longitude)
        return Promise.reject(new Error("latitude and longitude are required"));
      return reverseGeocode(params);
    },
    enabled:
      !!params &&
      typeof params.latitude === "number" &&
      typeof params.longitude === "number",
    staleTime: 3600000,
  });
};

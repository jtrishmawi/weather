import { reverseGeocode } from "@/services/reverse-geocoding";
import { useQuery } from "@tanstack/react-query";

type GeocodingParams = {
  latitude: number | null;
  longitude: number | null;
  [key: string]: unknown;
};

export const useReverseGeocoding = (params?: GeocodingParams) => {
  return useQuery({
    queryKey: ["geocoding", [params?.latitude, params?.longitude]],
    queryFn: () => reverseGeocode(params!),
    enabled: params && Boolean(params.latitude) && Boolean(params.longitude),
    staleTime: 60000,
  });
};

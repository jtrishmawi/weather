import { reverseGeocode } from "@/services/reverse-geocoding";
import { useQuery } from "@tanstack/react-query";

type GeocodingParams = {
  latitude: number | null;
  longitude: number | null;
};

export const useReverseGeocoding = (params: GeocodingParams) => {
  return useQuery({
    queryKey: ["geocoding", params],
    queryFn: () => reverseGeocode(params),
    enabled: Boolean(params.latitude) && Boolean(params.longitude),
    staleTime: 60000,
  });
};

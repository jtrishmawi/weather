import { reverseGeocode } from "@/services/reverse-geocoding";
import { useQuery } from "react-query";

type GeocodingParams = {
  latitude: number | null;
  longitude: number | null;
};

export const useReverseGeocoding = (params: GeocodingParams) => {
  return useQuery(["geocoding", params], () => reverseGeocode(params), {
    enabled: Boolean(params.latitude) && Boolean(params.longitude),
  });
};

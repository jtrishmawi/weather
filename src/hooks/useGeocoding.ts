import { geocode } from "@/services/geocoding";
import { useQuery } from "react-query";

type GeocodingParams = {
  latitude: number | null;
  longitude: number | null;
};

export const useGeocoding = (params: GeocodingParams) => {
  return useQuery(["geocoding", params], () => geocode(params), {
    enabled: Boolean(params.latitude) && Boolean(params.longitude),
  });
};

import { useQuery } from "@tanstack/react-query";

type GeolocationParams = {
  latitude: number | null;
  longitude: number | null;
};

export const useGeolocation = (
  options: PositionOptions = {
    timeout: 10000,
    enableHighAccuracy: true,
    maximumAge: 3600000,
  }
) => {
  return useQuery({
    queryKey: ["geolocation"],
    queryFn: () => {
      return new Promise<GeolocationParams>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          },
          options
        );
      });
    },
    initialData: {
      latitude: null,
      longitude: null,
    },
  });
};

import { useQuery } from "react-query";

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
  return useQuery(
    "geolocation",
    () => {
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
    {
      placeholderData: {
        latitude: null,
        longitude: null,
      },
    }
  );
};

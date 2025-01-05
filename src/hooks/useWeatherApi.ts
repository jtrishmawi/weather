import { range } from "@/lib/utils";
import { fetchWeather } from "@/services/weather";
import { useQuery } from "@tanstack/react-query";

type useWeatherParams = {
  latitude: number | null;
  longitude: number | null;
};

export const useWeatherApi = (params?: useWeatherParams) => {
  return useQuery({
    queryKey: [
      "weather",
      { latitude: params?.latitude, longitude: params?.longitude },
    ],
    queryFn: async () => {
      if (!params?.latitude || !params?.longitude) {
        return Promise.reject(new Error("latitude and longitude are required"));
      }
      const response = await fetchWeather({
        latitude: params.latitude,
        longitude: params.longitude,
      });

      // Attributes for timezone and location
      // const utcOffsetSeconds = response.utcOffsetSeconds(); - this is not eeded for France
      // const timezone = response.timezone();
      // const timezoneAbbreviation = response.timezoneAbbreviation();
      const latitude = response.latitude();
      const longitude = response.longitude();
      const current = response.current()!;
      const hourly = response.hourly()!;
      const daily = response.daily()!;

      // Note: The order of weather variables in the URL query and the indices below need to match!
      const weatherData = {
        current: {
          time: new Date(Number(current.time()) * 1000),
          // time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          temperature2m: current.variables(0)!.value(),
          relativeHumidity2m: current.variables(1)!.value(),
          apparentTemperature: current.variables(2)!.value(),
          isDay: Boolean(current.variables(3)!.value()),
          precipitation: current.variables(4)!.value(),
          rain: current.variables(5)!.value(),
          showers: current.variables(6)!.value(),
          snowfall: current.variables(7)!.value(),
          weatherCode: current.variables(8)!.value(),
          cloudCover: current.variables(9)!.value(),
          windSpeed10m: current.variables(10)!.value(),
          windDirection10m: current.variables(11)!.value(),
          windGusts10m: current.variables(12)!.value(),
        },
        daily: {
          time: range(
            Number(daily.time()),
            Number(daily.timeEnd()),
            daily.interval()
          ).map((t) => new Date(t * 1000)),
          // ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
          weatherCode: daily.variables(0)!.valuesArray()!,
          temperature2mMax: daily.variables(1)!.valuesArray()!,
          temperature2mMin: daily.variables(2)!.valuesArray()!,
          precipitationSum: daily.variables(3)!.valuesArray()!,
        },
        hourly: {
          time: range(
            Number(hourly.time()),
            Number(hourly.timeEnd()),
            hourly.interval()
          ).map((t) => new Date(t * 1000)),
          // ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
          temperature2m: hourly.variables(0)!.valuesArray()!,
          precipitation: hourly.variables(1)!.valuesArray()!,
        },
        latitude,
        longitude,
      };

      return weatherData;
    },
    retry: false,
    enabled: params && Boolean(params.latitude) && Boolean(params.longitude),
    staleTime: 30 * 60 * 1000,
  });
};

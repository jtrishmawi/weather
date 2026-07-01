import { fetchWeatherApi } from "openmeteo";

export const fetchAirQuality = async ({
  latitude,
  longitude,
}: GeolocationObject): Promise<AirQualityObject> => {
  const airQualityParams = {
    current: ["us_aqi", "european_aqi", "pm2_5", "pm10", "ozone"],
    timezone: "auto",
    latitude,
    longitude,
  };
  const url = "https://air-quality-api.open-meteo.com/v1/air-quality";
  const responses = await fetchWeatherApi(url, airQualityParams, 1);

  const response = responses[0];
  const current = response.current()!;

  return {
    current: {
      time: new Date(Number(current.time()) * 1000),
      usAqi: current.variables(0)!.value(),
      europeanAqi: current.variables(1)!.value(),
      pm2_5: current.variables(2)!.value(),
      pm10: current.variables(3)!.value(),
      ozone: current.variables(4)!.value(),
    },
  };
};

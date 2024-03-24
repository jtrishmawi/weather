import { fetchWeatherApi } from "openmeteo";

type WeatherParams = {
  latitude?: number;
  longitude?: number;
  current?: string[];
  hourly?: string[];
  timezone?: string;
};

export const fetchWeather = async (params: WeatherParams) => {
  params = {
    latitude: 48.8967,
    longitude: 2.2567,
    current: ["temperature_2m", "is_day", "rain"],
    hourly: ["temperature_2m", "rain"],
    timezone: "auto",
    ...params,
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  return response;
};

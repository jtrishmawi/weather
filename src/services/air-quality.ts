import { fetchWeatherApi } from "openmeteo";

type WeatherApiResponse = Awaited<ReturnType<typeof fetchWeatherApi>>[number];

const parseAirQualityResponse = (
  response: WeatherApiResponse,
): AirQualityObject => {
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

// Same multi-location pattern as the weather service: one request for every
// location, responses in input order.
export const fetchAirQualityForLocations = async (
  locations: WeatherLocation[],
): Promise<Record<string, AirQualityObject>> => {
  const airQualityParams = {
    current: ["us_aqi", "european_aqi", "pm2_5", "pm10", "ozone"],
    timezone: "auto",
    latitude: locations.map((l) => l.latitude),
    longitude: locations.map((l) => l.longitude),
  };
  const url = "https://air-quality-api.open-meteo.com/v1/air-quality";
  const responses = await fetchWeatherApi(url, airQualityParams, 1);

  if (responses.length !== locations.length) {
    throw new Error(
      `Air quality API returned ${responses.length} locations, expected ${locations.length}`,
    );
  }

  return Object.fromEntries(
    locations.map((location, i) => [
      location.id,
      parseAirQualityResponse(responses[i]),
    ]),
  );
};

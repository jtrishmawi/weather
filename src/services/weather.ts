import { range } from "@/lib/utils";
import { fetchWeatherApi } from "openmeteo";

type WeatherApiResponse = Awaited<ReturnType<typeof fetchWeatherApi>>[number];

// Note: The order of weather variables in each array below must match the
// order the indices are read back out in `.variables(N)` / array position
// below. New fields must always be APPENDED, never inserted in the middle,
// or every later index silently shifts and reads the wrong variable.
const weatherVariables = {
  current: [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "is_day",
    "precipitation",
    "rain",
    "showers",
    "snowfall",
    "weather_code",
    "cloud_cover",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_gusts_10m",
    "uv_index",
    "dew_point_2m",
    "visibility",
  ],
  daily: [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_sum",
    "sunrise",
    "sunset",
    "daylight_duration",
    "uv_index_max",
    "precipitation_probability_max",
    "wind_speed_10m_max",
    "wind_gusts_10m_max",
    "wind_direction_10m_dominant",
  ],
  hourly: [
    "temperature_2m",
    "precipitation",
    "relative_humidity_2m",
    "wind_speed_10m",
    "precipitation_probability",
    "uv_index",
  ],
};

const parseWeatherResponse = (response: WeatherApiResponse): WeatherObject => {
  const latitude = response.latitude();
  const longitude = response.longitude();
  const current = response.current()!;
  const hourly = response.hourly()!;
  const daily = response.daily()!;

  return {
    current: {
      time: new Date(Number(current.time()) * 1000),
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
      uvIndex: current.variables(13)!.value(),
      dewPoint2m: current.variables(14)!.value(),
      visibility: current.variables(15)!.value(),
    },
    daily: {
      time: range(
        Number(daily.time()),
        Number(daily.timeEnd()),
        daily.interval()
      ).map((t) => new Date(t * 1000)),
      weatherCode: daily.variables(0)!.valuesArray()!,
      temperature2mMax: daily.variables(1)!.valuesArray()!,
      temperature2mMin: daily.variables(2)!.valuesArray()!,
      precipitationSum: daily.variables(3)!.valuesArray()!,
      // sunrise/sunset are Unix-timestamp variables, not Float32 values, so
      // they must be read via valuesInt64(i) rather than valuesArray().
      sunrise: range(0, daily.variables(4)!.valuesInt64Length(), 1).map(
        (i) => new Date(Number(daily.variables(4)!.valuesInt64(i)) * 1000)
      ),
      sunset: range(0, daily.variables(5)!.valuesInt64Length(), 1).map(
        (i) => new Date(Number(daily.variables(5)!.valuesInt64(i)) * 1000)
      ),
      daylightDuration: daily.variables(6)!.valuesArray()!,
      uvIndexMax: daily.variables(7)!.valuesArray()!,
      precipitationProbabilityMax: daily.variables(8)!.valuesArray()!,
      windSpeed10mMax: daily.variables(9)!.valuesArray()!,
      windGusts10mMax: daily.variables(10)!.valuesArray()!,
      windDirection10mDominant: daily.variables(11)!.valuesArray()!,
    },
    hourly: {
      time: range(
        Number(hourly.time()),
        Number(hourly.timeEnd()),
        hourly.interval()
      ).map((t) => new Date(t * 1000)),
      temperature2m: hourly.variables(0)!.valuesArray()!,
      precipitation: hourly.variables(1)!.valuesArray()!,
      relativeHumidity2m: hourly.variables(2)!.valuesArray()!,
      windSpeed10m: hourly.variables(3)!.valuesArray()!,
      precipitationProbability: hourly.variables(4)!.valuesArray()!,
      uvIndex: hourly.variables(5)!.valuesArray()!,
    },
    latitude,
    longitude,
  };
};

// Open-Meteo accepts coordinate arrays, so every location is fetched in a
// single request and the responses come back in the same order.
export const fetchWeatherForLocations = async (
  locations: WeatherLocation[]
): Promise<Record<string, WeatherObject>> => {
  const weatherParams = {
    ...weatherVariables,
    timezone: "auto",
    forecast_days: 16,
    latitude: locations.map((l) => l.latitude),
    longitude: locations.map((l) => l.longitude),
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, weatherParams, 1);

  if (responses.length !== locations.length) {
    throw new Error(
      `Weather API returned ${responses.length} locations, expected ${locations.length}`
    );
  }

  return Object.fromEntries(
    locations.map((location, i) => [
      location.id,
      parseWeatherResponse(responses[i]),
    ])
  );
};

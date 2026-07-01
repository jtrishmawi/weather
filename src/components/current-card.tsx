import { Compass } from "@/components/compass";
import { getAqiSeverity } from "@/lib/aqi";
import { getCardinalDirection, getUvSeverityLabel, timeAgo } from "@/lib/utils";
import { getWMOCode, getWMOImageUrl } from "@/lib/wmo-codes";
import { DropletsIcon, Leaf } from "lucide-react";

export const CurrentCard = ({
  weather,
  airQuality,
}: {
  weather: {
    current: {
      time: Date;
      weatherCode: number;
      isDay: boolean;
      temperature2m: number;
      relativeHumidity2m: number;
      windSpeed10m: number;
      windDirection10m: number;
      apparentTemperature: number;
      rain: number;
      precipitation: number;
      snowfall: number;
      cloudCover: number;
      showers: number;
      windGusts10m: number;
      uvIndex: number;
      dewPoint2m: number;
      visibility: number;
    };
  };
  airQuality?: {
    current: {
      usAqi: number;
      europeanAqi: number;
      pm2_5: number;
      pm10: number;
      ozone: number;
    };
  };
}) => {
  const { format } = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  });

  const aqiSeverity = airQuality
    ? getAqiSeverity(airQuality.current.usAqi)
    : null;

  return (
    <div className="@container/current bg-card text-card-foreground border border-border rounded-xl h-full">
      <div className="h-full flex flex-col justify-between gap-4 lg:px-6 p-4">
        <p className="italic">
          The current weather condition is&nbsp;
          <span className="font-semibold lowercase">
            {getWMOCode(
              weather.current.weatherCode.toString(),
              weather.current.isDay ? "day" : "night",
            )}
            .
          </span>
          <small className="text-xs font-medium leading-none block sm:hidden pt-1">
            <span className="sr-only">Updated:</span>
            <time dateTime={weather.current?.time.toString()}>
              {timeAgo(weather.current?.time)}
            </time>
          </small>
        </p>
        <div className="flex items-center justify-evenly gap-6 flex-wrap pb-4">
          <div className="flex items-center justify-around grow max-w-64">
            <img
              src={getWMOImageUrl(
                weather.current.weatherCode.toString(),
                weather.current.isDay ? "day" : "night",
              )}
              alt={getWMOCode(
                weather.current.weatherCode.toString(),
                weather.current.isDay ? "day" : "night",
              )}
              className="aspect-square h-20 object-none invert dark:invert-0"
            />
            <div className="text-5xl font-bold font-mono">
              {Math.round(weather.current.temperature2m)}
              <span className="text-3xl">&deg;C</span>
            </div>
          </div>
          <div className="flex items-center justify-around grow max-w-64">
            <div className="p-2.5">
              <Compass
                direction={weather.current.windDirection10m}
                className="aspect-square w-auto h-15"
              />
            </div>
            <div className="text-5xl font-bold font-mono">
              {Math.round(weather.current.windSpeed10m)}
              <span className="text-3xl">km/h</span>
            </div>
          </div>
          <div className="flex items-center justify-around grow max-w-64">
            <div className="p-2.5">
              <DropletsIcon className="aspect-square w-auto h-15" />
            </div>
            <div className="text-5xl font-bold font-mono">
              {Math.round(weather.current.relativeHumidity2m)}
              <span className="text-3xl">%</span>
            </div>
          </div>
          {airQuality && aqiSeverity && (
            <div className="flex items-center justify-around grow max-w-64">
              <div className="p-2.5">
                <Leaf
                  className={`aspect-square w-auto h-15 ${aqiSeverity.colorClass}`}
                  aria-hidden="true"
                />
              </div>
              <div className="text-right">
                <div
                  className={`text-5xl font-bold font-mono ${aqiSeverity.colorClass}`}
                  aria-label={`Air quality index ${Math.round(
                    airQuality.current.usAqi,
                  )}, ${aqiSeverity.label}`}
                >
                  {Math.round(airQuality.current.usAqi)}
                </div>
                <div
                  className={`text-sm font-medium ${aqiSeverity.colorClass}`}
                >
                  {aqiSeverity.label}
                </div>
              </div>
            </div>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-4 @md/current:grid-cols-4 @2xl/current:grid-cols-6 justify-evenly items-center">
          {/* Priority data: weather, humidity, wind, UV, air quality */}
          <dt className="@md/current:text-right">Temperature</dt>
          <dd className="font-medium font-mono text-right @md/current:text-left">
            {format(weather.current.temperature2m)}&deg;C
          </dd>
          <dt className="@md/current:text-right">Feels like</dt>
          <dd className="font-medium font-mono text-right @md/current:text-left">
            {format(weather.current.apparentTemperature)}
            &deg;C
          </dd>
          <dt className="@md/current:text-right">Humidity</dt>
          <dd className="font-medium font-mono text-right @md/current:text-left">
            {format(weather.current.relativeHumidity2m)}%
          </dd>
          <dt className="@md/current:text-right">Wind</dt>
          <dd className="font-medium font-mono text-right @md/current:text-left">
            {format(weather.current.windSpeed10m)}km/h
          </dd>
          <dt className="@md/current:text-right">Wind gusts</dt>
          <dd className="font-medium font-mono text-right @md/current:text-left">
            {format(weather.current.windGusts10m)}km/h
          </dd>
          <dt className="@md/current:text-right">Wind direction</dt>
          <dd className="font-medium font-mono text-right @md/current:text-left">
            {getCardinalDirection(weather.current.windDirection10m)}
          </dd>
          <dt className="@md/current:text-right">UV index</dt>
          <dd className="font-medium font-mono text-right @md/current:text-left">
            {format(weather.current.uvIndex)}
            <span className="ml-1 text-xs font-normal">
              ({getUvSeverityLabel(weather.current.uvIndex)})
            </span>
          </dd>
          {airQuality && (
            <>
              <dt className="@md/current:text-right">PM2.5</dt>
              <dd className="font-medium font-mono text-right @md/current:text-left">
                {airQuality.current.pm2_5.toFixed(1)}&nbsp;µg/m³
              </dd>
              <dt className="@md/current:text-right">PM10</dt>
              <dd className="font-medium font-mono text-right @md/current:text-left">
                {airQuality.current.pm10.toFixed(1)}&nbsp;µg/m³
              </dd>
              <dt className="@md/current:text-right">Ozone</dt>
              <dd className="font-medium font-mono text-right @md/current:text-left">
                {airQuality.current.ozone.toFixed(1)}&nbsp;µg/m³
              </dd>
              <dt className="@md/current:text-right">European AQI</dt>
              <dd className="font-medium font-mono text-right @md/current:text-left">
                {Math.round(airQuality.current.europeanAqi)}
              </dd>
            </>
          )}
          {/* Secondary data */}
          <dt className="@md/current:text-right">Cloud coverage</dt>
          <dd className="font-medium font-mono text-right @md/current:text-left">
            {format(weather.current.cloudCover)}%
          </dd>
          <dt className="@md/current:text-right">Rain</dt>
          <dd className="font-medium font-mono text-right @md/current:text-left">
            {format(weather.current.rain)}mm
          </dd>
          <dt className="@md/current:text-right">Precipitation</dt>
          <dd className="font-medium font-mono text-right @md/current:text-left">
            {format(weather.current.precipitation)}mm
          </dd>
          <dt className="@md/current:text-right">Showers</dt>
          <dd className="font-medium font-mono text-right @md/current:text-left">
            {format(weather.current.showers)}mm
          </dd>
          <dt className="@md/current:text-right">Snowfall</dt>
          <dd className="font-medium font-mono text-right @md/current:text-left">
            {weather.current.snowfall}cm
          </dd>
          <dt className="@md/current:text-right">Dew point</dt>
          <dd className="font-medium font-mono text-right @md/current:text-left">
            {format(weather.current.dewPoint2m)}
            &deg;C
          </dd>
          <dt className="@md/current:text-right">Visibility</dt>
          <dd className="font-medium font-mono text-right @md/current:text-left">
            {format(weather.current.visibility / 1000)}km
          </dd>
        </dl>
        <small className="text-xs font-medium leading-none ml-auto hidden sm:block">
          <span className="font-light">Last updated:</span>&nbsp;
          <time dateTime={weather.current?.time.toString()}>
            {timeAgo(weather.current?.time)}
          </time>
        </small>
      </div>
    </div>
  );
};

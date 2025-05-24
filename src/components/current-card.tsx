import { getCardinalDirection, timeAgo } from "@/lib/utils";
import { getWMOCode, getWMOImageUrl } from "@/lib/wmo-codes";
import { Compass } from "./compass";
import { DropletsIcon } from "lucide-react";

export const CurrentCard = ({
  weather,
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
    };
  };
}) => {
  const { format } = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  });

  return (
    <div className="@container/current">
      <div className="h-full flex flex-col justify-between gap-4 lg:px-6 p-4">
        <p className="italic">
          The current weather condition is&nbsp;
          <span className="font-semibold lowercase">
            {getWMOCode(
              weather.current.weatherCode.toString(),
              weather.current.isDay ? "day" : "night"
            )}
            .
          </span>
          <small className="text-xs font-medium leading-none block sm:hidden pt-1">
            <span className="sr-only">Updated: </span>
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
                weather.current.isDay ? "day" : "night"
              )}
              alt={getWMOCode(
                weather.current.weatherCode.toString(),
                weather.current.isDay ? "day" : "night"
              )}
              className="aspect-square h-[80px] object-none invert dark:invert-0"
            />
            <div className="text-5xl font-bold">
              {Math.round(weather.current.temperature2m)}
              <span className="text-3xl">&deg;C</span>
            </div>
          </div>
          <div className="flex items-center justify-around grow max-w-64">
            <div className="p-[10px]">
              <Compass
                direction={weather.current.windDirection10m}
                className="aspect-square w-auto h-[60px]"
              />
            </div>
            <div className="text-5xl font-bold">
              {Math.round(weather.current.windSpeed10m)}
              <span className="text-3xl">km/h</span>
            </div>
          </div>
          <div className="flex items-center justify-around grow max-w-64">
            <div className="p-[10px]">
              <DropletsIcon className="aspect-square w-auto h-[60px]" />
            </div>
            <div className="text-5xl font-bold">
              {Math.round(weather.current.relativeHumidity2m)}
              <span className="text-3xl">%</span>
            </div>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-4 @md/current:grid-cols-4 @2xl/current:grid-cols-6 justify-evenly items-center">
          <dt className="@md/current:text-right">Temperature</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {format(weather.current.temperature2m)}&deg;C
          </dd>
          <dt className="@md/current:text-right">Feels like</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {format(weather.current.apparentTemperature)}
            &deg;C
          </dd>
          <dt className="@md/current:text-right">Humidity</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {format(weather.current.relativeHumidity2m)}%
          </dd>
          <dt className="@md/current:text-right">Cloud coverage</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {format(weather.current.cloudCover)}%
          </dd>
          <dt className="@md/current:text-right">Rain</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {format(weather.current.rain)}mm
          </dd>
          <dt className="@md/current:text-right">Wind</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {format(weather.current.windSpeed10m)}km/h
          </dd>
          <dt className="@md/current:text-right">Precipitation</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {format(weather.current.precipitation)}mm
          </dd>
          <dt className="@md/current:text-right">Wind gusts</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {format(weather.current.windGusts10m)}km/h
          </dd>
          <dt className="@md/current:text-right">Showers</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {format(weather.current.showers)}mm
          </dd>
          <dt className="@md/current:text-right">Wind direction</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {getCardinalDirection(weather.current.windDirection10m)}
          </dd>
          <dt className="@md/current:text-right">Snowfall</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {weather.current.snowfall}cm
          </dd>
        </dl>
        <small className="text-xs font-medium leading-none ml-auto hidden sm:block">
          <span className="sr-only">Updated: </span>
          <time dateTime={weather.current?.time.toString()}>
            <span className="font-light">Last updated:</span>&nbsp;
            {timeAgo(weather.current?.time)}
          </time>
        </small>
      </div>
    </div>
  );
};

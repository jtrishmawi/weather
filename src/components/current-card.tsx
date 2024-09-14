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
        <div className="flex items-center justify-around flex-wrap gap-6">
          <div className="flex items-center">
            <img
              src={getWMOImageUrl(
                weather.current.weatherCode.toString(),
                weather.current.isDay ? "day" : "night"
              )}
              alt={getWMOCode(
                weather.current.weatherCode.toString(),
                weather.current.isDay ? "day" : "night"
              )}
              className="aspect-square w-auto h-[100px] shadow rounded-full invert dark:invert-0"
            />
            <div className="text-5xl font-bold">
              {Math.round(weather.current.temperature2m)}&deg;C
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Compass
              direction={weather.current.windDirection10m}
              className="aspect-square w-auto h-[80px]"
            />
            <div className="text-5xl font-bold">
              {Math.round(weather.current.windSpeed10m)}km/h
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropletsIcon className="aspect-square w-auto h-[80px]" />
            <div className="text-5xl font-bold">
              {Math.round(weather.current.relativeHumidity2m)}%
            </div>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-4 @md/current:grid-cols-4 @2xl/current:grid-cols-6 justify-evenly items-center">
          <dt className="@md/current:text-right">Temperature</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {weather.current.temperature2m.toFixed(2)}&deg;C
          </dd>
          <dt className="@md/current:text-right">Feels like</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {weather.current.apparentTemperature.toFixed(2)}
            &deg;C
          </dd>
          <dt className="@md/current:text-right">Humidity</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {weather.current.relativeHumidity2m}%
          </dd>
          <dt className="@md/current:text-right">Cloud coverage</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {weather.current.cloudCover}%
          </dd>
          <dt className="@md/current:text-right">Rain</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {weather.current.rain}mm
          </dd>
          <dt className="@md/current:text-right">Wind</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {weather.current.windSpeed10m.toFixed(1)}km/h
          </dd>
          <dt className="@md/current:text-right">Precipitation</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {weather.current.precipitation}mm
          </dd>
          <dt className="@md/current:text-right">Wind gusts</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {weather.current.windGusts10m.toFixed(1)}km/h
          </dd>
          <dt className="@md/current:text-right">Showers</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {weather.current.showers}mm
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
            {weather.current?.time.toLocaleString()}
          </time>
        </small>
      </div>
    </div>
  );
};

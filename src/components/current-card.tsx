import { getWMOCode, getWMOImageUrl } from "@/lib/wmo-codes";
import { getCardinalDirection } from "@/lib/utils";
import { Compass } from "./compass";
import { ScrollArea } from "./ui/scroll-area";

export const CurrentCard = ({
  geocoding,
  weather,
}: {
  geocoding: {
    city: string;
    countryName: string;
  };
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
      <div className="h-full flex flex-col justify-between gap-4 @lg/current:px-6 p-4">
        <div className="space-y-4">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
            {geocoding.city}, {geocoding.countryName}
          </h2>
          <small className="text-sm font-medium leading-none">
            <span className="sr-only">Updated: </span>
            <time dateTime={weather.current?.time.toString()}>
              <span className="font-light">Last updated:</span>&nbsp;
              {weather.current?.time.toLocaleString()}
            </time>
          </small>
          <blockquote className="italic">
            The current weather condition is&nbsp;
            <span className="font-semibold lowercase">
              {getWMOCode(
                weather.current.weatherCode.toString(),
                weather.current.isDay ? "day" : "night"
              )}
              .
            </span>
          </blockquote>
        </div>
        <div className="flex items-center justify-around flex-wrap">
          <div className="flex items-center gap-3">
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
              className="aspect-square w-auto h-[100px]"
            />
            <div className="text-5xl font-bold">
              {Math.round(weather.current.windSpeed10m)}km/h
            </div>
          </div>
        </div>
        <ScrollArea className="h-64">
          <dl className="grid grid-cols-2 gap-4 @lg/current:grid-cols-4 justify-evenly">
            <dt className="text-right">Temperature</dt>
            <dd className="font-medium">
              {weather.current.temperature2m.toFixed(2)}&deg;C
            </dd>
            <dt className="text-right">Feels like</dt>
            <dd className="font-medium">
              {weather.current.apparentTemperature.toFixed(2)}
              &deg;C
            </dd>
            <dt className="text-right">Humidity</dt>
            <dd className="font-medium">
              {weather.current.relativeHumidity2m}%
            </dd>
            <dt className="text-right">Cloud coverage</dt>
            <dd className="font-medium">{weather.current.cloudCover}%</dd>
            <dt className="text-right">Rain</dt>
            <dd className="font-medium">{weather.current.rain}mm</dd>
            <dt className="text-right">Wind</dt>
            <dd className="font-medium">
              {weather.current.windSpeed10m.toFixed(1)}km/h
            </dd>
            <dt className="text-right">Precipitation</dt>
            <dd className="font-medium">{weather.current.precipitation}mm</dd>
            <dt className="text-right">Wind gusts</dt>
            <dd className="font-medium">
              {weather.current.windGusts10m.toFixed(1)}km/h
            </dd>
            <dt className="text-right">Showers</dt>
            <dd className="font-medium">{weather.current.showers}mm</dd>
            <dt className="text-right">Wind direction</dt>
            <dd className="font-medium">
              {getCardinalDirection(weather.current.windDirection10m)}
            </dd>
            <dt className="text-right">Snowfall</dt>
            <dd className="font-medium">{weather.current.snowfall}cm</dd>
          </dl>
        </ScrollArea>
      </div>
    </div>
  );
};

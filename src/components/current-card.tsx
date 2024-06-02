import { getWMOCode, getWMOImageUrl } from "@/lib/wmo-codes";
import { getCardinalDirection } from "@/lib/utils";
import { Compass } from "./compass";

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
    <div className="@container/current mx-2 h-full flex flex-col justify-between gap-4">
      <div className="space-y-4">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          {geocoding.city}, {geocoding.countryName}
        </h2>
        <small className="text-sm font-medium leading-none">
          <span className="sr-only">Updated: </span>
          <time dateTime={weather.current?.time.toString()}>
            <span className="font-light">Last updated: </span>{" "}
            {weather.current?.time.toLocaleString()}
          </time>
        </small>
        <blockquote className="italic">
          The weather is{" "}
          <span className="font-semibold lowercase">
            {getWMOCode(
              weather.current.weatherCode.toString(),
              weather.current.isDay ? "day" : "night"
            )}
            .
          </span>
        </blockquote>
      </div>
      <div className="grid grid-cols-2 gap-4 @lg/current:grid-cols-4 items-center">
        <img
          src={getWMOImageUrl(
            weather.current.weatherCode.toString(),
            weather.current.isDay ? "day" : "night"
          )}
          alt={getWMOCode(
            weather.current.weatherCode.toString(),
            weather.current.isDay ? "day" : "night"
          )}
          className="justify-self-center aspect-square w-auto h-full"
        />
        <div className="text-5xl font-bold">
          {Math.round(weather.current.temperature2m)}&deg;C
        </div>
        <Compass direction={weather.current.windDirection10m} className="justify-self-center aspect-square w-auto h-full max-h-[100px]" />
        <div className="text-5xl font-bold">
          {Math.round(weather.current.windSpeed10m)}km/h
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-4 @lg/current:grid-cols-4 mb-8">
        <dt>Temperature</dt>
        <dd className="font-medium">
          {weather.current.temperature2m.toFixed(2)}&deg;C
        </dd>
        <dt>Feels like</dt>
        <dd className="font-medium">
          {weather.current.apparentTemperature.toFixed(2)}
          &deg;C
        </dd>
        <dt>Humidity</dt>
        <dd className="font-medium">{weather.current.relativeHumidity2m}%</dd>
        <dt>Rain</dt>
        <dd className="font-medium">{weather.current.rain}mm</dd>
        <dt>Precipitation</dt>
        <dd className="font-medium">{weather.current.precipitation}mm</dd>
        <dt>Showers</dt>
        <dd className="font-medium">{weather.current.showers}mm</dd>
        <dt>Snowfall</dt>
        <dd className="font-medium">{weather.current.snowfall}cm</dd>
        <dt>Cloud cover</dt>
        <dd className="font-medium">{weather.current.cloudCover}%</dd>
        <dt>Wind</dt>
        <dd className="font-medium">
          {weather.current.windSpeed10m.toFixed(1)}km/h
        </dd>
        <dt>Wind direction</dt>
        <dd className="font-medium">
          {getCardinalDirection(weather.current.windDirection10m)}
        </dd>
        <dt>Wind gusts</dt>
        <dd className="font-medium">
          {weather.current.windGusts10m.toFixed(1)}km/h
        </dd>
      </dl>
    </div>
  );
};

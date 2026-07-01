import { ScrollArea } from "@/components/ui/scroll-area";
import { getCardinalDirection } from "@/lib/utils";
import { getWMOCode, getWMOImageUrl } from "@/lib/wmo-codes";
import { Sunrise, Sunset, Wind } from "lucide-react";

type ForecastProps = {
  time: Date[];
  temperature2mMax: Float32Array;
  temperature2mMin: Float32Array;
  weatherCode: Float32Array;
  precipitationSum: Float32Array;
  sunrise: Date[];
  sunset: Date[];
  daylightDuration: Float32Array;
  precipitationProbabilityMax: Float32Array;
  uvIndexMax: Float32Array;
  windSpeed10mMax: Float32Array;
  windGusts10mMax: Float32Array;
  windDirection10mDominant: Float32Array;
};

const formatDaylight = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export const Forecast = (data: ForecastProps) => {
  const casts = data.time.map((time, index) => {
    return {
      temperature2mMax: data.temperature2mMax[index],
      temperature2mMin: data.temperature2mMin[index],
      weatherCode: data.weatherCode[index],
      precipitationSum: data.precipitationSum[index],
      sunrise: data.sunrise[index],
      sunset: data.sunset[index],
      daylightDuration: data.daylightDuration[index],
      precipitationProbabilityMax: data.precipitationProbabilityMax[index],
      uvIndexMax: data.uvIndexMax[index],
      windSpeed10mMax: data.windSpeed10mMax[index],
      windGusts10mMax: data.windGusts10mMax[index],
      windDirection10mDominant: data.windDirection10mDominant[index],
      time: time,
    };
  });

  const { format: dateFormat } = new Intl.DateTimeFormat(undefined, {
    // year: "2-digit",
    month: "short",
    weekday: "short",
    day: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
  });

  const { format: numberFormat } = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  });

  const { format: decimalFormat } = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  });

  const { format: timeFormat } = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="@container/current flex flex-col">
      <div className="flex items-center @lg/current:px-6 @sm/current:px-4">
        <h2 className="scroll-m-20 pb-2 text-2xl sm:text-3xl font-semibold tracking-tight first:mt-0">
          Forecast
        </h2>
      </div>
      <ScrollArea className="h-96">
        {casts.map((cast, index) => {
          return (
            <div
              key={index}
              className="flex justify-around items-center border rounded-sm mb-2 px-4 gap-2 text-sm"
            >
              <div className="capitalize">{dateFormat(cast.time)}</div>
              <img
                src={getWMOImageUrl(cast.weatherCode.toString())}
                alt={getWMOCode(cast.weatherCode.toString())}
                className="invert dark:invert-0 h-[70px] aspect-square object-none"
              />
              <div className="flex flex-col items-end">
                <div className="text-lg">
                  {numberFormat(cast.temperature2mMax)}°C
                </div>
                <div>{numberFormat(cast.temperature2mMin)}°C</div>
              </div>
              <div className="capitalize font-medium">
                {getWMOCode(cast.weatherCode.toString())}
              </div>
              <div className="whitespace-normal break-words">
                {decimalFormat(cast.precipitationSum)}mm
              </div>
              <div className="flex flex-col items-start text-xs gap-1">
                <span className="flex items-center gap-1">
                  <Sunrise aria-hidden="true" className="size-3.5" />
                  {timeFormat(cast.sunrise)}
                </span>
                <span className="flex items-center gap-1">
                  <Sunset aria-hidden="true" className="size-3.5" />
                  {timeFormat(cast.sunset)}
                </span>
                <span>{formatDaylight(cast.daylightDuration)} daylight</span>
              </div>
              <div className="whitespace-normal break-words">
                {numberFormat(cast.precipitationProbabilityMax)}%
                <span className="sr-only"> chance of precipitation</span>
              </div>
              <div className="whitespace-normal break-words">
                UV {numberFormat(cast.uvIndexMax)}
              </div>
              <div className="flex flex-col items-start text-xs gap-1">
                <span className="flex items-center gap-1">
                  <Wind aria-hidden="true" className="size-3.5" />
                  {numberFormat(cast.windSpeed10mMax)}&nbsp;km/h&nbsp;
                  {getCardinalDirection(cast.windDirection10mDominant)}
                </span>
                <span>Gusts {numberFormat(cast.windGusts10mMax)}km/h</span>
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};

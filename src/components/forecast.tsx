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
    month: "short",
    weekday: "short",
    day: "2-digit",
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
    <div className="@container/current bg-card text-card-foreground border border-border rounded-xl flex flex-col h-full lg:px-6 p-4">
      <div className="flex items-center">
        <h2 className="scroll-m-20 pb-2 text-2xl sm:text-3xl font-semibold tracking-tight first:mt-0">
          Forecast
        </h2>
      </div>
      <ScrollArea className="flex-1 min-h-0 max-h-96">
        {casts.map((cast, index) => {
          return (
            <div
              key={index}
              className="border rounded-lg mb-2 p-3 flex flex-col gap-2 text-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={getWMOImageUrl(cast.weatherCode.toString())}
                    alt={getWMOCode(cast.weatherCode.toString())}
                    className="invert dark:invert-0 size-10 shrink-0 object-none"
                  />
                  <div className="min-w-0">
                    <div className="font-medium capitalize truncate">
                      {dateFormat(cast.time)}
                    </div>
                    <div className="text-muted-foreground capitalize truncate">
                      {getWMOCode(cast.weatherCode.toString())}
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono shrink-0">
                  <span className="text-lg font-semibold">
                    {numberFormat(cast.temperature2mMax)}&deg;C
                  </span>
                  <span className="text-muted-foreground">
                    &nbsp;/&nbsp;{numberFormat(cast.temperature2mMin)}&deg;C
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1">
                  <Sunrise aria-hidden="true" className="size-3.5" />
                  {timeFormat(cast.sunrise)}
                </span>
                <span className="flex items-center gap-1">
                  <Sunset aria-hidden="true" className="size-3.5" />
                  {timeFormat(cast.sunset)}
                </span>
                <span>{formatDaylight(cast.daylightDuration)} daylight</span>
                <span>{decimalFormat(cast.precipitationSum)}mm rain</span>
                {/* Open-Meteo has no precipitation probability beyond ~15
                    days; the SDK reads the nulls back as NaN. */}
                {!Number.isNaN(cast.precipitationProbabilityMax) && (
                  <span>
                    {numberFormat(cast.precipitationProbabilityMax)}% chance
                    <span className="sr-only"> of precipitation</span>
                  </span>
                )}
                <span>UV {numberFormat(cast.uvIndexMax)}</span>
                <span className="flex items-center gap-1">
                  <Wind aria-hidden="true" className="size-3.5" />
                  {numberFormat(cast.windSpeed10mMax)}km/h&nbsp;
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

import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/hooks/use-language";
import { formatDate } from "@/lib/dates";
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

export const Forecast = (data: ForecastProps) => {
  const { t, locale } = useLanguage();

  const formatDaylight = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return t("format.daylight", { hours, minutes });
  };

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

  const dateFormat = (date: Date) =>
    formatDate(date, locale, {
      month: "short",
      weekday: "short",
      day: "2-digit",
    });

  const timeFormat = (date: Date) =>
    formatDate(date, locale, { hour: "2-digit", minute: "2-digit" });

  const { format: numberFormat } = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  });

  const { format: decimalFormat } = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  });

  return (
    <div className="@container/current bg-card text-card-foreground border border-border rounded-xl flex flex-col h-full lg:px-6 p-4">
      <div className="flex items-center">
        <h2 className="scroll-m-20 pb-2 text-2xl sm:text-3xl font-semibold tracking-tight first:mt-0">
          {t("forecast.title")}
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
                    alt={t(getWMOCode(cast.weatherCode.toString()))}
                    className="invert dark:invert-0 size-10 shrink-0 object-none"
                  />
                  <div className="min-w-0">
                    <div className="font-medium capitalize truncate">
                      {dateFormat(cast.time)}
                    </div>
                    <div className="text-muted-foreground capitalize truncate">
                      {t(getWMOCode(cast.weatherCode.toString()))}
                    </div>
                  </div>
                </div>
                <div className="text-end font-mono shrink-0">
                  <span className="text-lg font-semibold">
                    {numberFormat(cast.temperature2mMax)}
                    {t("unit.celsius")}
                  </span>
                  <span className="text-muted-foreground">
                    &nbsp;/&nbsp;{numberFormat(cast.temperature2mMin)}
                    {t("unit.celsius")}
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
                <span>
                  {t("forecast.daylight", {
                    duration: formatDaylight(cast.daylightDuration),
                  })}
                </span>
                <span>
                  {t("forecast.rainAmount", {
                    value: `${decimalFormat(cast.precipitationSum)}${t("unit.mm")}`,
                  })}
                </span>
                {/* Open-Meteo has no precipitation probability beyond ~15
                    days; the SDK reads the nulls back as NaN. */}
                {!Number.isNaN(cast.precipitationProbabilityMax) && (
                  <span>
                    <span aria-hidden="true">
                      {t("forecast.chanceVisible", {
                        value: `${numberFormat(cast.precipitationProbabilityMax)}${t("unit.percent")}`,
                      })}
                    </span>
                    <span className="sr-only">
                      {t("forecast.chanceSr", {
                        value: `${numberFormat(cast.precipitationProbabilityMax)}${t("unit.percent")}`,
                      })}
                    </span>
                  </span>
                )}
                <span>
                  {t("forecast.uv", { value: numberFormat(cast.uvIndexMax) })}
                </span>
                <span className="flex items-center gap-1">
                  <Wind aria-hidden="true" className="size-3.5" />
                  {numberFormat(cast.windSpeed10mMax)}
                  {t("unit.kmh")}&nbsp;
                  {t(getCardinalDirection(cast.windDirection10mDominant))}
                </span>
                <span>
                  {t("forecast.gusts", {
                    value: `${numberFormat(cast.windGusts10mMax)}${t("unit.kmh")}`,
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};

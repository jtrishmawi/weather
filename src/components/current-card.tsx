import { Compass } from "@/components/compass";
import { useLanguage } from "@/hooks/use-language";
import { splitAround } from "@/i18n";
import { getAqiSeverity } from "@/lib/aqi";
import { timeAgo } from "@/lib/dates";
import { getCardinalDirection, getUvSeverityLabel } from "@/lib/utils";
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
  const { t, locale } = useLanguage();
  const { format } = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  });
  const { format: formatFixed1 } = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const aqiSeverity = airQuality
    ? getAqiSeverity(airQuality.current.usAqi)
    : null;

  const condition = t(
    getWMOCode(
      weather.current.weatherCode.toString(),
      weather.current.isDay ? "day" : "night",
    ),
  );
  // The condition gets its own styled span inside the translated sentence.
  const [conditionBefore, conditionAfter] = splitAround(
    t("current.condition"),
    "condition",
  );

  return (
    <div className="@container/current bg-card text-card-foreground border border-border rounded-xl h-full">
      <div className="h-full flex flex-col justify-between gap-4 lg:px-6 p-4">
        <p className="italic">
          {conditionBefore}
          <span className="font-semibold lowercase">{condition}</span>
          {conditionAfter}
          <small className="text-xs font-medium leading-none block sm:hidden pt-1">
            <span className="sr-only">{t("current.updatedSr")}</span>
            <time dateTime={weather.current?.time.toString()}>
              {timeAgo(weather.current?.time, locale)}
            </time>
          </small>
        </p>
        <div className="flex items-center justify-evenly gap-6 flex-wrap pb-4">
          <div className="flex basis-full items-center justify-around grow max-w-64 @md/current:basis-auto">
            <img
              src={getWMOImageUrl(
                weather.current.weatherCode.toString(),
                weather.current.isDay ? "day" : "night",
              )}
              alt={condition}
              className="aspect-square h-20 object-none invert dark:invert-0"
            />
            <div className="text-5xl font-bold font-mono">
              {Math.round(weather.current.temperature2m)}
              <span className="text-3xl">{t("unit.celsius")}</span>
            </div>
          </div>
          <div className="flex basis-full items-center justify-around grow max-w-64 @md/current:basis-auto">
            <div className="p-2.5">
              <Compass
                direction={weather.current.windDirection10m}
                className="aspect-square w-auto h-15"
              />
            </div>
            <div className="text-5xl font-bold font-mono">
              <span className="sr-only">{t("current.windSpeedSr")}</span>
              {Math.round(weather.current.windSpeed10m)}
              <span className="text-3xl">{t("unit.kmh")}</span>
            </div>
          </div>
          <div className="flex basis-full items-center justify-around grow max-w-64 @md/current:basis-auto">
            <div className="p-2.5">
              <DropletsIcon
                className="aspect-square w-auto h-15"
                aria-hidden="true"
              />
            </div>
            <div className="text-5xl font-bold font-mono">
              <span className="sr-only">{t("current.humiditySr")}</span>
              {Math.round(weather.current.relativeHumidity2m)}
              <span className="text-3xl">{t("unit.percent")}</span>
            </div>
          </div>
          {airQuality && aqiSeverity && (
            <div className="flex basis-full items-center justify-around grow max-w-64 @md/current:basis-auto">
              <div className="p-2.5">
                <Leaf
                  className={`aspect-square w-auto h-15 ${aqiSeverity.colorClass}`}
                  aria-hidden="true"
                />
              </div>
              <div className="text-end">
                <div
                  className={`text-5xl font-bold font-mono ${aqiSeverity.colorClass}`}
                >
                  <span className="sr-only">{t("current.aqiSr")}</span>
                  {Math.round(airQuality.current.usAqi)}
                </div>
                <div
                  className={`text-sm font-medium ${aqiSeverity.colorClass}`}
                >
                  {t(aqiSeverity.labelKey)}
                </div>
              </div>
            </div>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-4 @md/current:grid-cols-4 @2xl/current:grid-cols-6 justify-evenly items-center">
          {/* Priority data: weather, humidity, wind, UV, air quality */}
          <dt className="@md/current:text-end">{t("current.temperature")}</dt>
          <dd className="font-medium font-mono text-end @md/current:text-start">
            {format(weather.current.temperature2m)}
            {t("unit.celsius")}
          </dd>
          <dt className="@md/current:text-end">{t("current.feelsLike")}</dt>
          <dd className="font-medium font-mono text-end @md/current:text-start">
            {format(weather.current.apparentTemperature)}
            {t("unit.celsius")}
          </dd>
          <dt className="@md/current:text-end">{t("current.humidity")}</dt>
          <dd className="font-medium font-mono text-end @md/current:text-start">
            {format(weather.current.relativeHumidity2m)}
            {t("unit.percent")}
          </dd>
          <dt className="@md/current:text-end">{t("current.wind")}</dt>
          <dd className="font-medium font-mono text-end @md/current:text-start">
            {format(weather.current.windSpeed10m)}
            {t("unit.kmh")}
          </dd>
          <dt className="@md/current:text-end">{t("current.windGusts")}</dt>
          <dd className="font-medium font-mono text-end @md/current:text-start">
            {format(weather.current.windGusts10m)}
            {t("unit.kmh")}
          </dd>
          <dt className="@md/current:text-end">
            {t("current.windDirection")}
          </dt>
          <dd className="font-medium font-mono text-end @md/current:text-start">
            {t(getCardinalDirection(weather.current.windDirection10m))}
          </dd>
          <dt className="@md/current:text-end">{t("current.uvIndex")}</dt>
          <dd className="font-medium font-mono text-end @md/current:text-start">
            {format(weather.current.uvIndex)}
            <span className="ms-1 text-xs font-normal">
              ({t(getUvSeverityLabel(weather.current.uvIndex))})
            </span>
          </dd>
          {airQuality && (
            <>
              <dt className="@md/current:text-end">{t("current.pm25")}</dt>
              <dd className="font-medium font-mono text-end @md/current:text-start">
                {formatFixed1(airQuality.current.pm2_5)}&nbsp;{t("unit.ugm3")}
              </dd>
              <dt className="@md/current:text-end">{t("current.pm10")}</dt>
              <dd className="font-medium font-mono text-end @md/current:text-start">
                {formatFixed1(airQuality.current.pm10)}&nbsp;{t("unit.ugm3")}
              </dd>
              <dt className="@md/current:text-end">{t("current.ozone")}</dt>
              <dd className="font-medium font-mono text-end @md/current:text-start">
                {formatFixed1(airQuality.current.ozone)}&nbsp;{t("unit.ugm3")}
              </dd>
              <dt className="@md/current:text-end">
                {t("current.europeanAqi")}
              </dt>
              <dd className="font-medium font-mono text-end @md/current:text-start">
                {Math.round(airQuality.current.europeanAqi)}
              </dd>
            </>
          )}
          {/* Secondary data */}
          <dt className="@md/current:text-end">{t("current.cloudCover")}</dt>
          <dd className="font-medium font-mono text-end @md/current:text-start">
            {format(weather.current.cloudCover)}
            {t("unit.percent")}
          </dd>
          <dt className="@md/current:text-end">{t("current.rain")}</dt>
          <dd className="font-medium font-mono text-end @md/current:text-start">
            {format(weather.current.rain)}
            {t("unit.mm")}
          </dd>
          <dt className="@md/current:text-end">
            {t("current.precipitation")}
          </dt>
          <dd className="font-medium font-mono text-end @md/current:text-start">
            {format(weather.current.precipitation)}
            {t("unit.mm")}
          </dd>
          <dt className="@md/current:text-end">{t("current.showers")}</dt>
          <dd className="font-medium font-mono text-end @md/current:text-start">
            {format(weather.current.showers)}
            {t("unit.mm")}
          </dd>
          <dt className="@md/current:text-end">{t("current.snowfall")}</dt>
          <dd className="font-medium font-mono text-end @md/current:text-start">
            {weather.current.snowfall}
            {t("unit.cm")}
          </dd>
          <dt className="@md/current:text-end">{t("current.dewPoint")}</dt>
          <dd className="font-medium font-mono text-end @md/current:text-start">
            {format(weather.current.dewPoint2m)}
            {t("unit.celsius")}
          </dd>
          <dt className="@md/current:text-end">{t("current.visibility")}</dt>
          <dd className="font-medium font-mono text-end @md/current:text-start">
            {format(weather.current.visibility / 1000)}
            {t("unit.km")}
          </dd>
        </dl>
        <small className="text-xs font-medium leading-none ms-auto hidden sm:block">
          <span className="font-light">{t("current.lastUpdated")}</span>&nbsp;
          <time dateTime={weather.current?.time.toString()}>
            {timeAgo(weather.current?.time, locale)}
          </time>
        </small>
      </div>
    </div>
  );
};

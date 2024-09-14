import { ScrollArea } from "@/components/ui/scroll-area";
import { getWMOCode, getWMOImageUrl } from "@/lib/wmo-codes";

type ForecastProps = {
  time: Date[];
  temperature2mMax: Float32Array;
  temperature2mMin: Float32Array;
  weatherCode: Float32Array;
  precipitationSum: Float32Array;
};

export const Forecast = (data: ForecastProps) => {
  const casts = data.time.map((time, index) => {
    return {
      temperature2mMax: data.temperature2mMax[index],
      temperature2mMin: data.temperature2mMin[index],
      weatherCode: data.weatherCode[index],
      precipitationSum: data.precipitationSum[index],
      time: time,
    };
  });

  const formatter = new Intl.DateTimeFormat(undefined, {
    // year: "2-digit",
    month: "short",
    weekday: "short",
    day: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
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
              className="flex justify-around items-center border rounded-sm mb-2 px-4"
            >
              <div className="capitalize">{formatter.format(cast.time)}</div>
              <img
                src={getWMOImageUrl(cast.weatherCode.toString())}
                alt={getWMOCode(cast.weatherCode.toString())}
                className="shadow rounded-full m-2 invert dark:invert-0"
              />
              <div>
                <span className="text-lg">
                  {cast.temperature2mMax.toFixed(0)}°C
                </span>
                &nbsp;/&nbsp;
                <span className="text-sm">
                  {cast.temperature2mMin.toFixed(0)}°C
                </span>
              </div>
              <div className="capitalize font-medium">
                {getWMOCode(cast.weatherCode.toString())}
              </div>
              <div>
                {cast.precipitationSum > 0 && (
                  <span>{cast.precipitationSum.toFixed(1)}&nbsp;mm</span>
                )}
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};

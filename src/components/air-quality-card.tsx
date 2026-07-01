import { getAqiSeverity } from "@/lib/aqi";

export const AirQualityCard = ({
  airQuality,
}: {
  airQuality: {
    current: {
      usAqi: number;
      europeanAqi: number;
      pm2_5: number;
      pm10: number;
      ozone: number;
    };
  };
}) => {
  const { label, colorClass } = getAqiSeverity(airQuality.current.usAqi);

  return (
    <div className="@container/current">
      <div className="h-full flex flex-col justify-between gap-4 lg:px-6 p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="scroll-m-20 pb-2 text-2xl sm:text-3xl font-semibold tracking-tight first:mt-0">
            Air Quality
          </h2>
          <span
            className={`text-3xl font-bold ${colorClass}`}
            aria-label={`US Air Quality Index ${Math.round(
              airQuality.current.usAqi
            )}, ${label}`}
          >
            {Math.round(airQuality.current.usAqi)}
          </span>
        </div>
        <p className={`font-medium ${colorClass}`}>{label}</p>
        <dl className="grid grid-cols-2 gap-4 @md/current:grid-cols-4 justify-evenly items-center">
          <dt className="@md/current:text-right">PM2.5</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {airQuality.current.pm2_5.toFixed(1)}&nbsp;µg/m³
          </dd>
          <dt className="@md/current:text-right">PM10</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {airQuality.current.pm10.toFixed(1)}&nbsp;µg/m³
          </dd>
          <dt className="@md/current:text-right">Ozone</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {airQuality.current.ozone.toFixed(1)}&nbsp;µg/m³
          </dd>
          <dt className="@md/current:text-right">European AQI</dt>
          <dd className="font-medium text-right @md/current:text-left">
            {Math.round(airQuality.current.europeanAqi)}
          </dd>
        </dl>
      </div>
    </div>
  );
};

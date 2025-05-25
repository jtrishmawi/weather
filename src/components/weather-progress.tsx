import { WeatherContext } from "@/contexts/weather";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";

const Step = ({
  label,
  loading,
  error,
  success,
  retry,
}: {
  label: string;
  loading: boolean;
  error?: Error;
  success: boolean;
  retry?: RetryMeta;
}) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const seconds = retry?.nextRetry
    ? Math.ceil((retry.nextRetry - now) / 1000)
    : null;

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2">
        {loading ? (
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        ) : error ? (
          <XCircle className="w-5 h-5 text-red-500" />
        ) : success ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <div className="w-5 h-5" />
        )}
        <span>{label}</span>
      </div>
      {error && retry?.nextRetry && seconds! > 0 && (
        <span className="text-sm text-red-500 ml-7">
          Retrying in {seconds}s...
        </span>
      )}
    </div>
  );
};

export const WeatherProgress = () => {
  const context = useContext(WeatherContext);
  if (!context) return null;

  const { state } = context;
  const {
    loadingGeolocation,
    loadingWeather,
    loadingAddress,
    errorGeolocation,
    errorWeather,
    errorAddress,
    geolocation,
    weather,
    address,
    retryGeolocation,
    retryWeather,
    retryAddress,
  } = state;

  return (
    <div className="w-full h-screen grid items-center justify-center">
      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow space-y-3 w-fit">
        <Step
          label="Geolocation"
          loading={loadingGeolocation}
          error={errorGeolocation}
          success={!!geolocation}
          retry={retryGeolocation}
        />
        <Step
          label="Weather"
          loading={loadingWeather}
          error={errorWeather}
          success={!!weather}
          retry={retryWeather}
        />
        <Step
          label="Geocoding"
          loading={loadingAddress}
          error={errorAddress}
          success={!!address}
          retry={retryAddress}
        />
      </div>
    </div>
  );
};

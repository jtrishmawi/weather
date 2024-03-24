import { useGeolocation } from "@/hooks/useGeolocation";
import { useReverseGeocoding } from "@/hooks/useReverseGeocoding";
import { useWeatherApi } from "@/hooks/useWeatherApi";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ModeToggle } from "./components/mode-toggle";

export const App = () => {
  const state = useGeolocation();
  const weather = useWeatherApi(state);
  const geocoding = useReverseGeocoding(state);

  if (state.loading) {
    return (
      <p>Geolocation is loading... (you may need to enable permissions)</p>
    );
  }
  if (weather.isLoading) {
    return <p>Weather is loading...</p>;
  }
  if (geocoding.isLoading) {
    return <p>Geocoding is loading...</p>;
  }

  if (state.error) {
    return <p>Enable permissions to access your location data</p>;
  }

  if (weather.isError || geocoding.isError) {
    return <p>Weather error</p>;
  }

  if (geocoding.isError) {
    return <p>Geocoding error</p>;
  }

  const charts = weather.data?.hourly.time.map((time, index) => {
    return {
      rain:
        weather.data?.hourly.rain[index] === 0
          ? null
          : weather.data?.hourly.rain[index],
      temperature: weather.data?.hourly.temperature2m[index],
      time: time,
    };
  });

  return (
    <div className="w-full h-screen">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-3xl font-bold">Weather App</h1>
          <ModeToggle />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          <div>
            <h2>{geocoding.data?.city}</h2>
          </div>
          <div>Map</div>
          <div>
            <h2>Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart width={500} height={300} data={charts}>
                <XAxis dataKey={"time"} />
                <YAxis yAxisId={"rain"} orientation="right" />
                <YAxis yAxisId={"temperature"} />
                <Tooltip />
                <Legend />
                <Line dataKey={"rain"} yAxisId={"rain"} stroke="#8884d8" />
                <Line
                  dataKey={"temperature"}
                  yAxisId={"temperature"}
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>Forecast</div>
        </div>
      </div>
    </div>
  );
};

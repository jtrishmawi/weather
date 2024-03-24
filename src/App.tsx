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

  if (state.loading || weather.isLoading || geocoding.isLoading) {
    return <p>loading... (you may need to enable permissions)</p>;
  }

  if (state.error || weather.isError || geocoding.isError) {
    return <p>Enable permissions to access your location data</p>;
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
      <h1>{geocoding.data?.city}</h1>
      <ModeToggle />
      <ResponsiveContainer width="100%" height="100%">
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
  );
};

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

export const App = () => {
  const state = useGeolocation();
  const { data, isLoading, isError } = useWeatherApi(state);
  const { data: geocoding } = useReverseGeocoding(state);
  console.log(state, geocoding);
  if (state.loading || isLoading) {
    return <p>loading... (you may need to enable permissions)</p>;
  }

  if (state.error || isError) {
    return <p>Enable permissions to access your location data</p>;
  }

  const charts = data?.hourly.time.map((time, index) => {
    return {
      rain: data?.hourly.rain[index] === 0 ? null : data?.hourly.rain[index],
      temperature: data?.hourly.temperature2m[index],
      time: time,
    };
  });

  return (
    <div className="w-full h-screen">
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

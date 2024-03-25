import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

type OverviewChartProps = {
  time: Date[];
  temperature2m: Float32Array;
  rain: Float32Array;
};

export const OverviewChart = (data: OverviewChartProps) => {
  const charts = data.time.map((time, index) => {
    return {
      rain: data.rain[index] === 0 ? null : data.rain[index],
      temperature: data.temperature2m[index],
      time: time,
    };
  });

  return (
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
  );
};

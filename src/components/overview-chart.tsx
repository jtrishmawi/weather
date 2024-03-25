import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OverviewChartProps = {
  time: Date[];
  temperature2m: Float32Array;
  rain: Float32Array;
};

export const OverviewChart = (data: OverviewChartProps) => {
  const charts = data.time.map((time, index) => {
    return {
      rain: data.rain[index] === 0 ? null : data.rain[index].toFixed(0),
      temperature: data.temperature2m[index].toFixed(0),
      time: time.toLocaleDateString(),
    };
  });

  return (
    <>
      <Tabs defaultValue="temperature">
        <div className="flex justify-between items-center">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Overview
          </h2>
          <TabsList>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="rain">Rain</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="temperature">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              width={500}
              height={400}
              data={charts}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey={"time"} padding={{ left: 30, right: 30 }} />
              <YAxis dataKey={"temperature"} />
              <Tooltip />
              <Line dataKey={"temperature"} stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
        <TabsContent value="rain">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              width={500}
              height={400}
              data={charts}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey={"time"} padding={{ left: 30, right: 30 }} />
              <YAxis dataKey={"rain"} />
              <Tooltip />
              <Line dataKey={"rain"} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </>
  );
};

import { HumidityChart } from "@/components/charts/humidity-chart";
import { PrecipProbabilityChart } from "@/components/charts/precip-probability-chart";
import { RainChart } from "@/components/charts/rain-chart";
import { TempChart } from "@/components/charts/temp-chart";
import { UvChart } from "@/components/charts/uv-chart";
import { WindChart } from "@/components/charts/wind-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from "react";

type OverviewChartProps = {
  time: Date[];
  temperature2m: Float32Array;
  precipitation: Float32Array;
  relativeHumidity2m: Float32Array;
  windSpeed10m: Float32Array;
  precipitationProbability: Float32Array;
  uvIndex: Float32Array;
};

export const OverviewChart = (data: OverviewChartProps) => {
  const {
    tempCharts,
    rainCharts,
    humidityCharts,
    windCharts,
    precipProbabilityCharts,
    uvCharts,
  } = useMemo(() => {
    const tempCharts: { temperature: number; time: number }[] = [];
    const rainCharts: { rain: number; time: number }[] = [];
    const humidityCharts: { humidity: number; time: number }[] = [];
    const windCharts: { wind: number; time: number }[] = [];
    const precipProbabilityCharts: { precipProbability: number; time: number }[] =
      [];
    const uvCharts: { uv: number; time: number }[] = [];
    data.time.forEach((t, index) => {
      const time = t.getTime();

      tempCharts.push({
        temperature: +data.temperature2m[index].toFixed(0),
        time: time,
      });

      rainCharts.push({
        rain: +data.precipitation[index].toFixed(0),
        time: time,
      });

      humidityCharts.push({
        humidity: +data.relativeHumidity2m[index].toFixed(0),
        time: time,
      });

      windCharts.push({
        wind: +data.windSpeed10m[index].toFixed(0),
        time: time,
      });

      precipProbabilityCharts.push({
        precipProbability: +data.precipitationProbability[index].toFixed(0),
        time: time,
      });

      uvCharts.push({
        uv: +data.uvIndex[index].toFixed(1),
        time: time,
      });
    });
    return {
      tempCharts,
      rainCharts,
      humidityCharts,
      windCharts,
      precipProbabilityCharts,
      uvCharts,
    };
  }, [
    data.precipitation,
    data.temperature2m,
    data.time,
    data.relativeHumidity2m,
    data.windSpeed10m,
    data.precipitationProbability,
    data.uvIndex,
  ]);

  return (
    <div className="@container/current bg-card text-card-foreground border border-border rounded-xl h-full">
      <Tabs
        defaultValue="temperature"
        className="flex flex-col gap-4 h-full @lg/current:px-6 @sm/current:px-4 p-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <h2 className="scroll-m-20 pb-2 text-2xl sm:text-3xl font-semibold tracking-tight first:mt-0">
            Overview
          </h2>
          <div className="overflow-x-auto">
            <TabsList className="w-max">
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="rain">Rain</TabsTrigger>
              <TabsTrigger value="humidity">Humidity</TabsTrigger>
              <TabsTrigger value="wind">Wind</TabsTrigger>
              <TabsTrigger value="precipProbability">Precip %</TabsTrigger>
              <TabsTrigger value="uv">UV</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="temperature" className="flex-1">
          <TempChart tempCharts={tempCharts} />
        </TabsContent>
        <TabsContent value="rain" className="flex-1">
          <RainChart rainCharts={rainCharts} />
        </TabsContent>
        <TabsContent value="humidity" className="flex-1">
          <HumidityChart humidityCharts={humidityCharts} />
        </TabsContent>
        <TabsContent value="wind" className="flex-1">
          <WindChart windCharts={windCharts} />
        </TabsContent>
        <TabsContent value="precipProbability" className="flex-1">
          <PrecipProbabilityChart precipProbabilityCharts={precipProbabilityCharts} />
        </TabsContent>
        <TabsContent value="uv" className="flex-1">
          <UvChart uvCharts={uvCharts} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

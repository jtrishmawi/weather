import { RainChart } from "@/components/charts/rain-chart";
import { TempChart } from "@/components/charts/temp-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from "react";

type OverviewChartProps = {
  time: Date[];
  temperature2m: Float32Array;
  precipitation: Float32Array;
};

export const OverviewChart = (data: OverviewChartProps) => {
  const { tempCharts, rainCharts } = useMemo(() => {
    const tempCharts: { temperature: number; time: number }[] = [];
    const rainCharts: { rain: number; time: number }[] = [];
    data.time.forEach((t, index) => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const aDayLater = new Date(Date.now() + 22 * 60 * 60 * 1000);

      if (t < twoHoursAgo || t > aDayLater)
        return;

      const time = t.getTime();

      tempCharts.push({
        temperature: +data.temperature2m[index].toFixed(0),
        time: time,
      });

      rainCharts.push({
        rain: +data.precipitation[index].toFixed(0),
        time: time,
      });
    });
    return { tempCharts, rainCharts };
  }, [data.precipitation, data.temperature2m, data.time]);

  return (
    <div className="@container/current h-full">
      <Tabs
        defaultValue="temperature"
        className="flex flex-col gap-4 h-full @lg/current:px-6 @sm/current:px-4"
      >
        <div className="flex justify-between items-center gap-4">
          <h2 className="scroll-m-20 pb-2 text-2xl sm:text-3xl font-semibold tracking-tight first:mt-0">
            Overview
          </h2>
          <TabsList>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="rain">Rain</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="temperature" className="flex-1">
          <TempChart tempCharts={tempCharts} />
        </TabsContent>
        <TabsContent value="rain" className="flex-1">
          <RainChart rainCharts={rainCharts} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

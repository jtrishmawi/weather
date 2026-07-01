import { ZoomableChart } from "@/components/charts/zoomable-chart";

export const WindChart = ({
  windCharts,
}: {
  windCharts: { wind: number; time: number }[];
}) => (
  <ZoomableChart
    kind="line"
    data={windCharts}
    dataKey="wind"
    unit="km/h"
    color="#58c2d8"
  />
);

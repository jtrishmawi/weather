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
    unitKey="unit.kmh"
    color="var(--chart-5)"
    label="chart.windSpeed"
  />
);

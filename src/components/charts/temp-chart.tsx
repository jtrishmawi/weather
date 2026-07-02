import { ZoomableChart } from "@/components/charts/zoomable-chart";

export const TempChart = ({
  tempCharts,
}: {
  tempCharts: { temperature: number; time: number }[];
}) => (
  <ZoomableChart
    kind="line"
    data={tempCharts}
    dataKey="temperature"
    unitKey="unit.celsius"
    color="var(--chart-1)"
    label="chart.temperature"
  />
);

import { ZoomableChart } from "@/components/charts/zoomable-chart";

export const HumidityChart = ({
  humidityCharts,
}: {
  humidityCharts: { humidity: number; time: number }[];
}) => (
  <ZoomableChart
    kind="line"
    data={humidityCharts}
    dataKey="humidity"
    unitKey="unit.percent"
    color="var(--chart-4)"
    label="chart.humidity"
  />
);

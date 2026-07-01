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
    unit="%"
    color="#58c2d8"
  />
);

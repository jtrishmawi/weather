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
    unit="°C"
    color="#58c2d8"
  />
);

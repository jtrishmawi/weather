import { ZoomableChart } from "@/components/charts/zoomable-chart";

export const RainChart = ({
  rainCharts,
}: {
  rainCharts: { rain: number; time: number }[];
}) => (
  <ZoomableChart
    kind="bar"
    data={rainCharts}
    dataKey="rain"
    unit="mm"
    color="#58c2d8"
  />
);

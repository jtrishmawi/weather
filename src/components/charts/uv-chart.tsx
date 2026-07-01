import { ZoomableChart } from "@/components/charts/zoomable-chart";

export const UvChart = ({
  uvCharts,
}: {
  uvCharts: { uv: number; time: number }[];
}) => (
  <ZoomableChart kind="line" data={uvCharts} dataKey="uv" unit="" color="#58c2d8" />
);

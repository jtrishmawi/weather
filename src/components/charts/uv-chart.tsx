import { ZoomableChart } from "@/components/charts/zoomable-chart";

export const UvChart = ({
  uvCharts,
}: {
  uvCharts: { uv: number; time: number }[];
}) => (
  <ZoomableChart
    kind="line"
    data={uvCharts}
    dataKey="uv"
    unit=""
    color="var(--chart-3)"
    label="UV index"
  />
);

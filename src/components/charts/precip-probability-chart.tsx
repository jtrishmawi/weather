import { ZoomableChart } from "@/components/charts/zoomable-chart";

export const PrecipProbabilityChart = ({
  precipProbabilityCharts,
}: {
  precipProbabilityCharts: { precipProbability: number; time: number }[];
}) => (
  <ZoomableChart
    kind="bar"
    data={precipProbabilityCharts}
    dataKey="precipProbability"
    unit="%"
    color="var(--chart-2)"
    label="Precipitation probability"
  />
);

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import Highcharts from "highcharts/esm/highstock.js";
import "highcharts/esm/modules/accessibility.js";
import { HighchartsReact } from "highcharts-react-official";
import { useMemo, useState } from "react";

type ZoomableChartProps<T extends Record<string, number> & { time: number }> =
  {
    kind: "line" | "bar";
    data: T[];
    dataKey: keyof T & string;
    unit: string;
    color: string;
    label: string;
  };

const summarize = <T extends Record<string, number> & { time: number }>(
  data: T[],
  dataKey: keyof T & string
) => {
  if (data.length === 0) return null;
  const now = Date.now();
  let current = data[0];
  let min = data[0][dataKey];
  let max = data[0][dataKey];
  for (const d of data) {
    if (Math.abs(d.time - now) < Math.abs(current.time - now)) current = d;
    if (d[dataKey] < min) min = d[dataKey];
    if (d[dataKey] > max) max = d[dataKey];
  }
  return { current: current[dataKey], min, max };
};

export const ZoomableChart = <
  T extends Record<string, number> & { time: number }
>({
  kind,
  data,
  dataKey,
  unit,
  color,
  label,
}: ZoomableChartProps<T>) => {
  const prefersReducedMotion = useReducedMotion();
  const summary = summarize(data, dataKey);
  // "Now" is frozen at mount so re-renders don't shift the zoom window or the
  // plot line (render purity).
  const [mountedAt] = useState(() => Date.now());

  const options = useMemo<Highcharts.Options>(() => {
    const seriesData: [number, number][] = data.map((d) => [
      d.time,
      d[dataKey],
    ]);
    const chartType = kind === "bar" ? "column" : "line";

    return {
      chart: {
        type: chartType,
        backgroundColor: "transparent",
        animation: !prefersReducedMotion,
        style: { fontFamily: "var(--font-sans)" },
        zooming: { type: "x" },
      },
      title: { text: "" },
      credits: { enabled: false },
      accessibility: {
        enabled: true,
        description: `${label} over time${unit ? `, in ${unit}` : ""}.`,
        point: { valueSuffix: unit },
      },
      rangeSelector: {
        enabled: true,
        inputEnabled: false,
        dropdown: "never",
        buttons: [
          { type: "hour", count: 24, text: "1d" },
          { type: "day", count: 3, text: "3d" },
          { type: "day", count: 7, text: "7d" },
          { type: "all", text: "All" },
        ],
        buttonTheme: {
          fill: "var(--card)",
          stroke: "var(--border)",
          style: { color: "var(--card-foreground)" },
          states: {
            hover: { fill: "var(--muted)" },
            select: {
              fill: "var(--primary)",
              style: { color: "var(--primary-foreground)" },
            },
          },
        },
        labelStyle: { color: "var(--muted-foreground)" },
      },
      navigator: {
        enabled: true,
        series: { color, lineWidth: 1 },
        xAxis: {
          labels: { style: { color: "var(--muted-foreground)" } },
        },
      },
      scrollbar: { enabled: false },
      xAxis: {
        type: "datetime",
        lineColor: "var(--border)",
        tickColor: "var(--border)",
        labels: { style: { color: "var(--muted-foreground)" } },
        dateTimeLabelFormats: {
          hour: { main: "%l%p" },
          day: { main: "%b %e" },
        },
        // Default to a ~1-day window centered on "now" rather than the
        // rangeSelector's own "1d" button, which anchors to the END of the
        // dataset (the last forecast day), not today.
        min: mountedAt - 2 * 60 * 60 * 1000,
        max: mountedAt + 22 * 60 * 60 * 1000,
        plotLines: [
          {
            value: mountedAt,
            color: "var(--accent)",
            width: 2,
            zIndex: 5,
            label: {
              text: "Now",
              style: { color: "var(--accent)" },
            },
          },
        ],
      },
      yAxis: {
        title: { text: "" },
        gridLineColor: "var(--border)",
        labels: {
          style: { color: "var(--muted-foreground)" },
          format: `{value}${unit}`,
        },
      },
      tooltip: {
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        style: { color: "var(--card-foreground)" },
        valueSuffix: unit,
        xDateFormat: "%b %e, %l:%M%p",
      },
      legend: { enabled: false },
      plotOptions: {
        series: {
          animation: !prefersReducedMotion,
          color,
          marker: { enabled: chartType === "line", radius: 2 },
        },
        column: { borderRadius: 2 },
      },
      series: [
        {
          type: chartType,
          name: label,
          data: seriesData,
          color,
        },
      ],
    };
  }, [data, dataKey, kind, color, label, unit, prefersReducedMotion, mountedAt]);

  return (
    <div className="flex flex-col relative h-full">
      {summary && (
        <p className="sr-only">
          {label}: currently {Math.round(summary.current)}
          {unit}, ranging from {Math.round(summary.min)}
          {unit} to {Math.round(summary.max)}
          {unit} over the shown period.
        </p>
      )}
      <div className="flex-1 min-h-64">
        <HighchartsReact
          highcharts={Highcharts}
          constructorType="stockChart"
          options={options}
          containerProps={{ style: { height: "100%", width: "100%" } }}
        />
      </div>
    </div>
  );
};

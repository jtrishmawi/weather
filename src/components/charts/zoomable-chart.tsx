import { useLanguage } from "@/hooks/use-language";
import type { MessageKey } from "@/i18n";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import Highcharts from "highcharts/esm/highstock.js";
import "highcharts/esm/modules/accessibility.js";
import { HighchartsReact } from "highcharts-react-official";
import { useMemo, useState } from "react";

type ZoomableChartProps<T extends Record<string, number> & { time: number }> = {
  kind: "line" | "bar";
  data: T[];
  dataKey: keyof T & string;
  unitKey?: MessageKey;
  color: string;
  label: MessageKey;
};

const summarize = <T extends Record<string, number> & { time: number }>(
  data: T[],
  dataKey: keyof T & string,
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
  T extends Record<string, number> & { time: number },
>({
  kind,
  data,
  dataKey,
  unitKey,
  color,
  label: labelKey,
}: ZoomableChartProps<T>) => {
  const prefersReducedMotion = useReducedMotion();
  const { t, locale } = useLanguage();
  const label = t(labelKey);
  const unit = unitKey ? t(unitKey) : "";
  const summary = summarize(data, dataKey);
  // "Now" is frozen at mount so re-renders don't shift the zoom window or the
  // plot line (render purity).
  const [mountedAt] = useState(() => Date.now());

  const options = useMemo<Highcharts.Options>(() => {
    // Highcharts formats dates/numbers with the Intl APIs behind lang.locale
    // (a global, so set before the chart is built). Charts stay LTR in the
    // Arabic UI — time axes conventionally read left-to-right — but their
    // labels and dates are localized.
    Highcharts.setOptions({
      lang: { locale, rangeSelectorZoom: t("chart.zoom") },
    });

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
        description: unit
          ? t("chart.description", { label, unit })
          : t("chart.descriptionNoUnit", { label }),
        point: { valueSuffix: unit },
      },
      rangeSelector: {
        enabled: true,
        inputEnabled: false,
        dropdown: "never",
        // title doubles as the buttons' accessible description; without it
        // Highcharts falls back to English defaults ("View all").
        buttons: [
          {
            type: "hour",
            count: 24,
            text: t("chart.range1d"),
            title: t("chart.range1dTitle"),
          },
          {
            type: "day",
            count: 3,
            text: t("chart.range3d"),
            title: t("chart.range3dTitle"),
          },
          {
            type: "day",
            count: 7,
            text: t("chart.range7d"),
            title: t("chart.range7dTitle"),
          },
          { type: "all", text: t("chart.rangeAll"), title: t("chart.rangeAllTitle") },
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
              text: t("chart.now"),
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
  }, [
    data,
    dataKey,
    kind,
    color,
    label,
    unit,
    locale,
    t,
    prefersReducedMotion,
    mountedAt,
  ]);

  return (
    <div className="flex flex-col relative h-full">
      {summary && (
        <p className="sr-only">
          {t("chart.summary", {
            label,
            current: Math.round(summary.current),
            min: Math.round(summary.min),
            max: Math.round(summary.max),
            unit,
          })}
        </p>
      )}
      <div className="flex-1 min-h-64">
        <HighchartsReact
          // Remount on language change so the chart is rebuilt with the new
          // global lang.locale (chart.update doesn't re-read it).
          key={locale}
          highcharts={Highcharts}
          constructorType="stockChart"
          options={options}
          containerProps={{ style: { height: "100%", width: "100%" } }}
        />
      </div>
    </div>
  );
};

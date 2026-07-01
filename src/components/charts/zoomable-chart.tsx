import { CustomLabel } from "@/components/charts/custom-label";
import { CustomTick } from "@/components/charts/custom-tick";
import { CustomTooltip } from "@/components/charts/custom-tooltip";
import { useZoomableChart } from "@/components/charts/use-zoomable-chart";
import { Button } from "@/components/ui/button";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AxisDomain } from "recharts/types/util/types";

type ZoomableChartProps<T extends Record<string, number> & { time: number }> =
  {
    kind: "line" | "bar";
    data: T[];
    dataKey: keyof T & string;
    unit: string;
    color: string;
  };

export const ZoomableChart = <
  T extends Record<string, number> & { time: number }
>({
  kind,
  data,
  dataKey,
  unit,
  color,
}: ZoomableChartProps<T>) => {
  const { state, zoomOut, handlers } = useZoomableChart(data, dataKey);
  const Chart = kind === "line" ? LineChart : BarChart;

  return (
    <div className="select-none flex flex-col relative h-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
        className="flex-1 min-h-64"
      >
        <Chart
          width={500}
          height={400}
          data={data}
          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
          onMouseDown={handlers.onMouseDown}
          onMouseMove={handlers.onMouseMove}
          onMouseUp={handlers.onMouseUp}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            allowDataOverflow
            height={120}
            tick={(props) => CustomTick({ ...props, angle: -60 })}
            domain={[state.left, state.right] as AxisDomain}
            type="number"
          />
          <YAxis
            dataKey={dataKey}
            allowDataOverflow
            domain={[state.bottom, state.top] as AxisDomain}
            tickFormatter={(v) => Math.round(v).toString()}
            unit={unit}
            type="number"
            yAxisId="1"
          />
          <Tooltip content={(props) => CustomTooltip({ ...props, units: unit })} />
          {kind === "line" ? (
            <Line
              dataKey={dataKey}
              stroke={color}
              label={(props) => CustomLabel({ ...props, color })}
              yAxisId="1"
              type="natural"
            />
          ) : (
            <Bar
              dataKey={dataKey}
              fill={color}
              label={(props) =>
                +props.value !== 0 ? (
                  CustomLabel({ ...props, color })
                ) : (
                  <></>
                )
              }
              yAxisId="1"
              type="natural"
            />
          )}
          <ReferenceLine
            x={new Date().getTime()}
            stroke="red"
            label={{
              position: "bottom",
              value: "Now",
              fill: "red",
              fontSize: 14,
            }}
            yAxisId="1"
          />
          {state.refAreaLeft && state.refAreaRight ? (
            <ReferenceArea
              yAxisId="1"
              x1={state.refAreaLeft}
              x2={state.refAreaRight}
              strokeOpacity={1}
            />
          ) : null}
        </Chart>
      </ResponsiveContainer>
      <Button
        onClick={zoomOut}
        type="button"
        variant="outline"
        size="sm"
        className="absolute bottom-0 left-6"
      >
        Reset
      </Button>
    </div>
  );
};

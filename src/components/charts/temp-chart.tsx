import { CustomLabel } from "@/components/charts/custom-label";
import { CustomTick } from "@/components/charts/custom-tick";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AxisDomain } from "recharts/types/util/types";

type StateType = {
  tempCharts: { temperature: number; time: number }[];
  left: number | string | null;
  right: number | string | null;
  refAreaLeft: number | string | null;
  refAreaRight: number | string | null;
  top: number | string | null;
  bottom: number | string | null;
};

export const TempChart = ({
  tempCharts,
}: {
  tempCharts: { temperature: number; time: number }[];
}) => {
  const [state, setState] = useState<StateType>({
    tempCharts,
    left: "dataMin",
    right: "dataMax",
    refAreaLeft: null,
    refAreaRight: null,
    top: "dataMax+1",
    bottom: "dataMin-1",
  });

  const getAxisYDomain = (from: number, to: number, offset: number) => {
    const ref = "temperature";
    const refData = state.tempCharts.reduce<
      { temperature: number; time: number }[]
    >((acc, d) => {
      if (d.time >= from && d.time <= to) acc.push(d);
      return acc;
    }, []);

    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });

    return [(+bottom | 0) - offset + "", (+top | 0) + offset + ""];
  };

  const zoom = () => {
    let { refAreaLeft, refAreaRight } = state;
    if (
      refAreaLeft === refAreaRight ||
      refAreaLeft === null ||
      refAreaRight === null
    ) {
      setState({
        ...state,
        refAreaLeft: null,
        refAreaRight: null,
      });
      return;
    }
    // xAxis domain
    if (refAreaLeft > refAreaRight)
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    // yAxis domain
    const [bottom, top] = getAxisYDomain(+refAreaLeft, +refAreaRight, 1);

    setState(() => ({
      ...state,
      tempCharts,
      refAreaLeft: null,
      refAreaRight: null,
      left: +refAreaLeft,
      right: +refAreaRight,
      bottom,
      top,
    }));
  };

  const zoomOut = () => {
    setState({
      ...state,
      tempCharts,
      left: "dataMin",
      right: "dataMax",
      refAreaLeft: null,
      refAreaRight: null,
      top: "dataMax+1",
      bottom: "dataMin-1",
    });
  };

  return (
    <div className="select-none flex flex-col h-full">
      <Button
        onClick={zoomOut}
        type="button"
        variant={"outline"}
        className="self-start"
      >
        Reset
      </Button>
      <ResponsiveContainer width="100%" height="100%" className={"flex-1"}>
        <LineChart
          width={500}
          height={400}
          data={state.tempCharts}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          onMouseDown={(e) => {
            if (e.activeLabel) {
              setState({
                ...state,
                refAreaLeft: new Date(e.activeLabel).getTime().toString(),
              });
            }
          }}
          onMouseMove={(e) => {
            if (state.refAreaLeft && e.activeLabel) {
              setState({
                ...state,
                refAreaRight: new Date(e.activeLabel).getTime().toString(),
              });
            }
          }}
          onMouseUp={zoom}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            allowDataOverflow
            padding={{ left: 30, right: 30 }}
            height={120}
            tick={(props) => CustomTick({ ...props, angle: -45 })}
            domain={[state.left, state.right] as AxisDomain}
            type="number"
          />
          <YAxis
            dataKey={"temperature"}
            allowDataOverflow
            domain={[state.bottom, state.top] as AxisDomain}
            tickFormatter={(v) => Math.round(v).toString()}
            unit={"°C"}
            type="number"
            yAxisId={"1"}
          />
          <Tooltip />
          <Line
            dataKey={"temperature"}
            stroke="#58c2d8"
            label={(props) => CustomLabel({ ...props, color: "#58c2d8" })}
            yAxisId={"1"}
            type={"natural"}
          />
          {state.refAreaLeft && state.refAreaRight ? (
            <ReferenceArea
              yAxisId="1"
              x1={state.refAreaLeft}
              x2={state.refAreaRight}
              strokeOpacity={1}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
import { useState } from "react";

type ZoomableDatum = Record<string, number> & { time: number };

type ZoomState = {
  left: number | string;
  right: number | string;
  refAreaLeft: number | string | null;
  refAreaRight: number | string | null;
  top: number | string;
  bottom: number | string;
};

const initialZoomState: ZoomState = {
  left: "dataMin",
  right: "dataMax",
  refAreaLeft: null,
  refAreaRight: null,
  top: "dataMax+1",
  bottom: "dataMin-1",
};

export const useZoomableChart = <T extends ZoomableDatum>(
  data: T[],
  dataKey: keyof T & string
) => {
  const [state, setState] = useState<ZoomState>(initialZoomState);

  const getAxisYDomain = (from: number, to: number, offset: number) => {
    const refData = data.filter((d) => d.time >= from && d.time <= to);

    let [bottom, top] = [refData[0][dataKey], refData[0][dataKey]];
    refData.forEach((d) => {
      if (d[dataKey] > top) top = d[dataKey];
      if (d[dataKey] < bottom) bottom = d[dataKey];
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
      setState((s) => ({ ...s, refAreaLeft: null, refAreaRight: null }));
      return;
    }
    if (refAreaLeft > refAreaRight)
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    const [bottom, top] = getAxisYDomain(+refAreaLeft, +refAreaRight, 1);

    setState((s) => ({
      ...s,
      refAreaLeft: null,
      refAreaRight: null,
      left: +refAreaLeft,
      right: +refAreaRight,
      bottom,
      top,
    }));
  };

  const zoomOut = () => setState(initialZoomState);

  const onMouseDown = (e: { activeLabel?: string | number }) => {
    if (e?.activeLabel !== undefined) {
      setState((s) => ({
        ...s,
        refAreaLeft: new Date(e.activeLabel!).getTime().toString(),
      }));
    }
  };

  const onMouseMove = (e: { activeLabel?: string | number }) => {
    if (state.refAreaLeft && e?.activeLabel !== undefined) {
      setState((s) => ({
        ...s,
        refAreaRight: new Date(e.activeLabel!).getTime().toString(),
      }));
    }
  };

  return {
    state,
    zoomOut,
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp: zoom,
    },
  };
};

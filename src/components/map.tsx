import { useTheme } from "@/hooks/useTheme";
import { getWMOCode } from "@/lib/wmo-codes";
import { useEffect, useRef, useState } from "react";
import {
  Annotation,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

type MapProps = {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  weatherCode: number;
};

export const Map = ({
  latitude,
  longitude,
  city,
  country,
  temperature,
  humidity,
  weatherCode,
}: MapProps) => {
  const ref = useRef<SVGForeignObjectElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { theme } = useTheme();
  const color = theme === "dark" ? "#686870" : "#1e1f24";

  useEffect(() => {
    setSize({
      width: Number(ref.current?.querySelector("div")?.scrollWidth) + 32,
      height: Number(ref.current?.querySelector("div")?.scrollHeight) + 32,
    });
  }, [city, country]);

  return (
    <ComposableMap
      projection={"geoAzimuthalEqualArea"}
      projectionConfig={{ rotate: [-longitude, -latitude, 0], scale: 1200 }}
    >
      <Geographies geography={"features.json"}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              stroke="#686870"
              fill="#1e1f24"
              className="pointer-events-none"
            />
          ))
        }
      </Geographies>
      <Annotation
        subject={[longitude, latitude]}
        dx={-90}
        dy={-30}
        connectorProps={{
          stroke: color,
          strokeWidth: 3,
          strokeLinecap: "round",
        }}
      >
        <foreignObject
          ref={ref}
          width={size.width}
          height={size.height}
          rx="20"
          ry="20"
          className="pointer-events-none border rounded-xl p-4 bg-slate-300 dark:bg-slate-800 border-slate-800 dark:border-slate-300 whitespace-nowrap"
          x={-(size.width + 10)}
          y={-(size.height / 2)}
        >
          <div>
            <p>
              {city}, {country}
            </p>
            <p className="text-sm">
              {temperature.toFixed(0)}°C {getWMOCode(weatherCode)}
            </p>
            <p className="text-sm">{humidity.toFixed(0)}% humidity</p>
          </div>
        </foreignObject>
      </Annotation>
    </ComposableMap>
  );
};

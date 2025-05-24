import { useTheme } from "@/hooks/useTheme";
import { getWMOCode } from "@/lib/wmo-codes";
import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

type MapProps = {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  weatherCode: number;
  isDay: boolean;
};

function ChangeView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 6);
  }, [coords, map]);
  return null;
}

export const Map = ({
  latitude,
  longitude,
  city,
  country,
  temperature,
  humidity,
  weatherCode,
  isDay,
}: MapProps) => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const [customIcon, setCustomIcon] = useState<L.DivIcon | null>(null);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const nasaDate = yesterday.toISOString().split("T")[0];

  const { format: numberFormat } = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  });

  const html = `
      <div class="min-w-[160px] max-w-[240px] border rounded-xl p-4 bg-slate-300 dark:bg-slate-800 border-slate-800 dark:border-slate-300 rounded-br-none whitespace-nowrap text-xs opacity-65">
        <p>${city}, ${country}</p>
        <p>
          ${numberFormat(temperature)}°C&nbsp;
          ${getWMOCode(weatherCode.toString(), isDay ? "day" : "night")}
        </p>
        <p>${numberFormat(humidity)}% humidity</p>
      </div>
    `;

  useEffect(() => {
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.visibility = "hidden";
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv);

    const content = tempDiv.firstElementChild as HTMLElement;
    const width = content.offsetWidth;
    const height = content.offsetHeight;

    document.body.removeChild(tempDiv);

    // Set icon with dynamic anchor (top-right)
    const icon = new L.DivIcon({
      html,
      className: "",
      iconAnchor: [width, height],
    });

    setCustomIcon(icon);
  }, [html]);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={6}
      minZoom={1}
      maxZoom={9}
      scrollWheelZoom={false}
      className="h-full w-full aspect-video"
    >
      <ChangeView coords={[latitude, longitude]} />
      <TileLayer
        url={
          darkMode
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <TileLayer
        attribution="Imagery courtesy NASA EOSDIS"
        url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${nasaDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`}
        tileSize={256}
        maxZoom={9}
        maxNativeZoom={9}
        opacity={0.6}
        zIndex={1000}
      />
      {customIcon && (
        <Marker position={[latitude, longitude]} icon={customIcon} />
      )}
    </MapContainer>
  );
};

import { useTheme } from "@/hooks/use-theme";
import { getAqiSeverity } from "@/lib/aqi";
import { getWMOCode, getWMOImageUrl } from "@/lib/wmo-codes";
import { fetchRadarLayers } from "@/services/rainviewer";
import L from "leaflet";
import { LocateFixed } from "lucide-react";
import { useEffect, useState } from "react";
import {
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from "react-leaflet";

type MapProps = {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  weatherCode: number;
  isDay: boolean;
  windSpeed: number;
  usAqi?: number;
};

function ChangeView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 6);
  }, [coords, map]);
  return null;
}

function RecenterControl({ coords }: { coords: [number, number] }) {
  const map = useMap();
  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          type="button"
          aria-label="Recenter map on current location"
          onClick={() => map.setView(coords, 6)}
          className="flex! h-8.5! w-8.5! items-center justify-center bg-card! text-card-foreground! hover:bg-muted!"
        >
          <LocateFixed className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
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
  windSpeed,
  usAqi,
}: MapProps) => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const [customIcon, setCustomIcon] = useState<L.DivIcon | null>(null);
  const [radarUrl, setRadarUrl] = useState<string | null>(null);
  const [satelliteUrl, setSatelliteUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchRadarLayers().then(({ radarUrl, satelliteUrl }) => {
      setRadarUrl(radarUrl);
      setSatelliteUrl(satelliteUrl);
    });
  }, []);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const nasaDate = yesterday.toISOString().split("T")[0];

  const { format: numberFormat } = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  });

  const aqiBadge =
    usAqi !== undefined
      ? (() => {
          const { label, colorClass, bgClass } = getAqiSeverity(usAqi);
          return `
            <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium font-mono ${colorClass} ${bgClass}">
              AQI ${numberFormat(usAqi)} &middot; ${label}
            </span>
          `;
        })()
      : "";

  const html = `
      <div class="min-w-47.5 max-w-65 border rounded-xl rounded-br-none p-3 bg-card text-card-foreground border-border shadow-lg text-xs">
        <div class="flex items-center gap-2">
          <img
            src="${getWMOImageUrl(weatherCode.toString(), isDay ? "day" : "night")}"
            alt=""
            class="size-9 shrink-0 invert dark:invert-0"
          />
          <div class="min-w-0">
            <p class="font-semibold text-sm leading-tight truncate">${city}, ${country}</p>
            <p class="font-mono text-base leading-tight">
              ${numberFormat(temperature)}&deg;C
              <span class="font-sans font-normal text-[11px] text-muted-foreground capitalize">
                ${getWMOCode(weatherCode.toString(), isDay ? "day" : "night")}
              </span>
            </p>
          </div>
        </div>
        <div class="flex items-center justify-between gap-3 font-mono text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border">
          <span>${numberFormat(humidity)}% humidity</span>
          <span>${numberFormat(windSpeed)}km/h wind</span>
        </div>
        ${aqiBadge}
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
      className="h-full w-full aspect-video rounded-xl border border-border overflow-hidden"
    >
      <ChangeView coords={[latitude, longitude]} />
      <RecenterControl coords={[latitude, longitude]} />
      <TileLayer
        url={
          darkMode
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LayersControl position="bottomleft">
        {radarUrl && (
          <LayersControl.Overlay checked name="Rain radar">
            <TileLayer
              attribution="Weather radar &copy; RainViewer"
              url={radarUrl}
              tileSize={256}
              maxZoom={9}
              maxNativeZoom={6}
              opacity={0.55}
              zIndex={1000}
            />
          </LayersControl.Overlay>
        )}
        {satelliteUrl && (
          <LayersControl.Overlay name="Cloud satellite (IR)">
            <TileLayer
              attribution="Satellite imagery &copy; RainViewer"
              url={satelliteUrl}
              tileSize={256}
              maxZoom={9}
              maxNativeZoom={6}
              opacity={0.7}
              zIndex={999}
            />
          </LayersControl.Overlay>
        )}
        <LayersControl.Overlay name="Satellite (true color)">
          <TileLayer
            attribution="Imagery courtesy NASA EOSDIS"
            url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${nasaDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`}
            tileSize={256}
            maxZoom={9}
            maxNativeZoom={9}
            opacity={0.7}
            zIndex={998}
          />
        </LayersControl.Overlay>
      </LayersControl>
      {customIcon && (
        <Marker position={[latitude, longitude]} icon={customIcon} />
      )}
    </MapContainer>
  );
};

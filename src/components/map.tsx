import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { getAqiSeverity } from "@/lib/aqi";
import { announce } from "@/lib/announcer";
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
  ZoomControl,
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

// The marker icon is anchored at its bottom-right corner, so it extends up
// and left of the location. Center on the location, then pan just enough to
// keep the whole icon inside the viewport (it can poke past the top/left
// edge on small maps).
const ICON_PADDING = 12;
// Extra left clearance so a panned-in icon lands beside the zoom control
// (30px control + 10px margin + gap) instead of underneath it.
const CONTROL_CLEARANCE = 52;
function setViewWithIconVisible(
  map: L.Map,
  coords: [number, number],
  iconSize: [number, number] | null,
) {
  map.setView(coords, 6, { animate: false });
  if (!iconSize) return;
  const { x: mapWidth, y: mapHeight } = map.getSize();
  // Never pan the marker anchor itself out of view: if the icon is larger
  // than the viewport allows, clamp instead of pushing the location off-map.
  const clamp = (wanted: number, limit: number) =>
    Math.min(0, Math.max(wanted, -limit));
  const dx = clamp(
    mapWidth / 2 - iconSize[0] - CONTROL_CLEARANCE,
    mapWidth / 2 - ICON_PADDING,
  );
  const dy = clamp(
    mapHeight / 2 - iconSize[1] - ICON_PADDING,
    mapHeight / 2 - ICON_PADDING,
  );
  if (dx || dy) map.panBy([dx, dy], { animate: false });
}

function ChangeView({
  coords,
  iconSize,
}: {
  coords: [number, number];
  iconSize: [number, number] | null;
}) {
  const map = useMap();
  useEffect(() => {
    setViewWithIconVisible(map, coords, iconSize);
  }, [coords, map, iconSize]);
  return null;
}

// Leaflet's layers-control toggle hardcodes an English "Layers" label and
// exposes no option for it; relabel it after the control mounts. Rendered
// after (and re-keyed with) the LayersControl so it runs on each rebuild.
function LayersToggleLabel() {
  const map = useMap();
  const { t } = useLanguage();
  useEffect(() => {
    const toggle = map
      .getContainer()
      .querySelector(".leaflet-control-layers-toggle");
    toggle?.setAttribute("title", t("map.layers"));
    toggle?.setAttribute("aria-label", t("map.layers"));
  }, [map, t]);
  return null;
}

function RecenterControl({
  coords,
  iconSize,
  city,
}: {
  coords: [number, number];
  iconSize: [number, number] | null;
  city: string;
}) {
  const map = useMap();
  const { t } = useLanguage();
  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          type="button"
          aria-label={t("map.recenter")}
          onClick={() => {
            setViewWithIconVisible(map, coords, iconSize);
            announce(t("map.recentered", { city }));
          }}
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
  const { t, locale, dir } = useLanguage();
  const darkMode = theme === "dark";
  const [customIcon, setCustomIcon] = useState<L.DivIcon | null>(null);
  const [iconSize, setIconSize] = useState<[number, number] | null>(null);
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

  const { format: numberFormat } = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  });

  const aqiBadge =
    usAqi !== undefined
      ? (() => {
          const { labelKey, colorClass, bgClass } = getAqiSeverity(usAqi);
          return `
            <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium font-mono ${colorClass} ${bgClass}">
              ${t("map.aqiBadge", { value: numberFormat(usAqi), label: t(labelKey) })}
            </span>
          `;
        })()
      : "";

  // dir on the tooltip root: the map itself stays LTR, but the tooltip text
  // follows the app language. bdi keeps a Latin city name from reordering
  // inside Arabic text (and vice versa). The bottom-right rounded corner is
  // physical on purpose — it matches the icon's physical bottom-right anchor.
  const html = `
      <div dir="${dir}" class="min-w-47.5 max-w-65 border rounded-xl rounded-br-none p-3 bg-card text-card-foreground border-border shadow-lg text-xs">
        <div class="flex items-center gap-2">
          <img
            src="${getWMOImageUrl(weatherCode.toString(), isDay ? "day" : "night")}"
            alt=""
            class="size-9 shrink-0 invert dark:invert-0"
          />
          <div class="min-w-0">
            <p class="font-semibold text-sm leading-tight truncate"><bdi>${city}, ${country}</bdi></p>
            <p class="font-mono text-base leading-tight">
              ${numberFormat(temperature)}${t("unit.celsius")}
              <span class="font-sans font-normal text-[11px] text-muted-foreground capitalize">
                ${t(getWMOCode(weatherCode.toString(), isDay ? "day" : "night"))}
              </span>
            </p>
          </div>
        </div>
        <div class="flex items-center justify-between gap-3 font-mono text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border">
          <span>${t("map.humidity", { value: `${numberFormat(humidity)}${t("unit.percent")}` })}</span>
          <span>${t("map.wind", { value: `${numberFormat(windSpeed)}${t("unit.kmh")}` })}</span>
        </div>
        ${aqiBadge}
      </div>
    `;

  useEffect(() => {
    // Measure in a rAF callback so the setState happens asynchronously (no
    // cascading sync render) and the off-screen measurement doesn't force an
    // extra layout mid-render.
    const frame = requestAnimationFrame(() => {
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
      setCustomIcon(
        new L.DivIcon({
          html,
          className: "",
          iconAnchor: [width, height],
        }),
      );
      setIconSize([width, height]);
    });

    return () => cancelAnimationFrame(frame);
  }, [html]);

  // isolate confines Leaflet's internal z-indexes (controls go up to 1000)
  // to the map's own stacking context, so they can't cover the header
  // dropdowns/panel.
  //
  // The wrapper pins the map to LTR even in the Arabic UI: maps aren't
  // text-flow content, and the pan/clearance math above assumes the zoom
  // control sits top-left.
  return (
    <div dir="ltr" className="h-full w-full">
      <MapContainer
        center={[latitude, longitude]}
        zoom={6}
        minZoom={1}
        maxZoom={9}
        scrollWheelZoom={false}
        zoomControl={false}
        className="isolate h-full w-full aspect-video rounded-xl border border-border overflow-hidden"
      >
        {/* Replaces the default zoom control, whose titles Leaflet hardcodes
            in English; keyed so a language switch rebuilds it. */}
        <ZoomControl
          key={`zoom-${locale}`}
          position="topleft"
          zoomInTitle={t("map.zoomIn")}
          zoomOutTitle={t("map.zoomOut")}
        />
        <ChangeView coords={[latitude, longitude]} iconSize={iconSize} />
        <RecenterControl
          coords={[latitude, longitude]}
          iconSize={iconSize}
          city={city}
        />
        <TileLayer
          url={
            darkMode
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Keyed by locale: Leaflet bakes overlay names into the control at
            creation, so a language switch must rebuild it. */}
        <LayersControl key={locale} position="bottomleft">
          {radarUrl && (
            <LayersControl.Overlay checked name={t("map.rainRadar")}>
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
            <LayersControl.Overlay name={t("map.cloudIr")}>
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
          <LayersControl.Overlay name={t("map.satTrueColor")}>
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
        <LayersToggleLabel key={`layers-label-${locale}`} />
        {customIcon && (
          <Marker position={[latitude, longitude]} icon={customIcon} />
        )}
      </MapContainer>
    </div>
  );
};

type RainViewerFrame = {
  time: number;
  path: string;
};

type RainViewerResponse = {
  radar: {
    past: RainViewerFrame[];
    nowcast: RainViewerFrame[];
  };
  satellite: {
    infrared: RainViewerFrame[];
  };
};

const toTileUrl = (host: string, frame: RainViewerFrame, color: string) =>
  `${host}${frame.path}/256/{z}/{x}/{y}/${color}/1_1.png`;

export const fetchRadarLayers = async (): Promise<{
  radarUrl: string | null;
  satelliteUrl: string | null;
}> => {
  const response = await fetch(
    "https://api.rainviewer.com/public/weather-maps.json"
  );
  if (!response.ok) return { radarUrl: null, satelliteUrl: null };

  const data: RainViewerResponse = await response.json();
  const host = "https://tilecache.rainviewer.com";

  const radarFrames = data.radar?.past ?? [];
  const satelliteFrames = data.satellite?.infrared ?? [];

  return {
    radarUrl:
      radarFrames.length > 0
        ? toTileUrl(host, radarFrames[radarFrames.length - 1], "2")
        : null,
    satelliteUrl:
      satelliteFrames.length > 0
        ? toTileUrl(host, satelliteFrames[satelliteFrames.length - 1], "0")
        : null,
  };
};

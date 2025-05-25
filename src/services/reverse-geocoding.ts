export const fetchAddress = async ({
  latitude,
  longitude,
}: GeolocationObject): Promise<GeocodingObject> => {
  if (!latitude || !longitude) {
    return Promise.reject(new Error("latitude and longitude are required"));
  }
  const url = new URL(
    "https://api.bigdatacloud.net/data/reverse-geocode-client"
  );
  url.searchParams.append("latitude", String(latitude));
  url.searchParams.append("longitude", String(longitude));
  const response = await fetch(url);

  if (!response.ok) throw new Error("Address fetch failed");

  return response.json();
};

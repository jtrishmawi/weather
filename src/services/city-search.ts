type GeocodingSearchResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
};

export const searchCities = async (query: string): Promise<City[]> => {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "8");
  url.searchParams.set("format", "json");

  const response = await fetch(url);
  if (!response.ok) throw new Error("City search failed");

  const data: { results?: GeocodingSearchResult[] } = await response.json();

  return (data.results ?? []).map((result) => ({
    id: `city-${result.id}`,
    name: result.name,
    admin1: result.admin1,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  }));
};

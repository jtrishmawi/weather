type GeocodingSearchResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
};

// Open-Meteo geocoding localizes name/admin1/country. It has no Arabic, so
// the Arabic UI falls back to English names (proper nouns, acceptable).
const GEOCODING_LANGUAGES: Record<Lang, string> = {
  en: "en",
  fr: "fr",
  ar: "en",
};

export const searchCities = async (
  query: string,
  lang: Lang,
): Promise<City[]> => {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "8");
  url.searchParams.set("format", "json");
  url.searchParams.set("language", GEOCODING_LANGUAGES[lang]);

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

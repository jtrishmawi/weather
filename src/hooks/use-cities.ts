import { useEffect, useState } from "react";

export const GEO_CITY_ID = "geo";

const STORAGE_KEY = "weather-cities";

type CitiesState = {
  cities: City[];
  selectedId: string;
};

const defaultState: CitiesState = { cities: [], selectedId: GEO_CITY_ID };

const loadCities = (): CitiesState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<CitiesState>;
    if (!Array.isArray(parsed.cities)) return defaultState;
    return {
      cities: parsed.cities.filter(
        (c): c is City =>
          !!c &&
          typeof c.id === "string" &&
          typeof c.name === "string" &&
          typeof c.latitude === "number" &&
          typeof c.longitude === "number"
      ),
      selectedId:
        typeof parsed.selectedId === "string" ? parsed.selectedId : GEO_CITY_ID,
    };
  } catch {
    return defaultState;
  }
};

export const cityLabel = (city: City) =>
  [city.name, city.admin1, city.country].filter(Boolean).join(", ");

export const useCities = () => {
  const [state, setState] = useState<CitiesState>(loadCities);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Persistence is best-effort; the session still works in memory.
    }
  }, [state]);

  const addCity = (city: City) =>
    setState((s) => ({
      cities: s.cities.some((c) => c.id === city.id)
        ? s.cities
        : [...s.cities, city],
      selectedId: city.id,
    }));

  const removeCity = (id: string) =>
    setState((s) => ({
      cities: s.cities.filter((c) => c.id !== id),
      selectedId: s.selectedId === id ? GEO_CITY_ID : s.selectedId,
    }));

  const selectCity = (id: string) => setState((s) => ({ ...s, selectedId: id }));

  return { ...state, addCity, removeCity, selectCity };
};

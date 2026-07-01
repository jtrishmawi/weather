import { CitySwitcher, GeoStatus } from "@/components/city-switcher";
import { CurrentCard } from "@/components/current-card";
import { Forecast } from "@/components/forecast";
import { LoadingScreen, StepInfo } from "@/components/loading-screen";
import { Map } from "@/components/map";
import { ModeToggle } from "@/components/mode-toggle";
import { OverviewChart } from "@/components/overview-chart";
import { Button } from "@/components/ui/button";
import { cityLabel, GEO_CITY_ID, useCities } from "@/hooks/use-cities";
import {
  useAddress,
  useAirQualityForLocations,
  useGeolocation,
  useWeatherForLocations,
} from "@/hooks/use-weather-queries";
import { announce } from "@/lib/announcer";
import { isPermissionDenied } from "@/services/geolocation";
import { useEffect, useMemo, useRef } from "react";

export const App = () => {
  const geo = useGeolocation();
  const { cities, selectedId, addCity, removeCity, selectCity } = useCities();

  const locations = useMemo<WeatherLocation[]>(
    () => [
      ...(geo.data
        ? [
            {
              id: GEO_CITY_ID,
              latitude: geo.data.latitude,
              longitude: geo.data.longitude,
            },
          ]
        : []),
      ...cities.map(({ id, latitude, longitude }) => ({
        id,
        latitude,
        longitude,
      })),
    ],
    [geo.data, cities]
  );

  const weatherQuery = useWeatherForLocations(locations);
  const airQualityQuery = useAirQualityForLocations(locations);
  const addressQuery = useAddress(geo.data);

  const geoStatus: GeoStatus = geo.data
    ? "ready"
    : geo.isError && !geo.isFetching
      ? "unavailable"
      : "locating";

  // If "My location" is selected but geolocation hasn't resolved yet (still
  // locating, or failed), show the first saved city instead of blocking on
  // the loading screen. When geolocation resolves, the display switches back.
  const isGeoFallback =
    selectedId === GEO_CITY_ID && !geo.data && cities.length > 0;
  const activeId = isGeoFallback ? cities[0].id : selectedId;

  const weather = weatherQuery.data?.[activeId];
  const airQuality = airQualityQuery.data?.[activeId];
  const address = addressQuery.data;

  const activeCity = cities.find((c) => c.id === activeId);
  const geoLabel = address ? address.city : "My location";
  const currentLabel = activeCity ? cityLabel(activeCity) : geoLabel;
  const headingLabel = activeCity
    ? cityLabel(activeCity)
    : address
      ? `${address.city} ${
          address.locality.toLowerCase() !== address.city.toLowerCase()
            ? address.locality
            : address.countryName
        }`
      : "My location";

  // The switch back from the fallback city to the located position is an
  // unrequested context change: announce it once, without moving focus.
  const wasGeoFallback = useRef(isGeoFallback);
  useEffect(() => {
    if (wasGeoFallback.current && !isGeoFallback && geo.data) {
      announce(`Showing weather for your location, ${geoLabel}`);
    }
    wasGeoFallback.current = isGeoFallback;
  }, [isGeoFallback, geo.data, geoLabel]);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const wasLoaded = useRef(false);
  useEffect(() => {
    if (!weather) {
      // Reset so the next loading-screen -> app transition (e.g. switching to
      // a not-yet-fetched city) also gets the announce + focus handoff.
      wasLoaded.current = false;
      return;
    }
    document.title = `${activeCity ? activeCity.name : geoLabel} – Weather`;
    if (!wasLoaded.current) {
      // Handoff from the loading screen: without this, focus is dropped on
      // <body> when LoadingScreen unmounts.
      wasLoaded.current = true;
      announce(`Weather for ${currentLabel} loaded`);
      headingRef.current?.focus();
    }
  }, [weather, activeCity, geoLabel, currentLabel]);

  const handleSelect = (id: string) => {
    selectCity(id);
    // Re-selecting "My location" after a failure is the natural "try again"
    // gesture — kick off a new geolocation attempt.
    if (id === GEO_CITY_ID && geo.isError && !geo.isFetching) geo.refetch();
  };

  if (!weather) {
    // While fetching (initial or retry, automatic or manual) show the spinner
    // even if the previous attempt errored — isError stays true during
    // refetches and would otherwise leave the step stuck on "failed".
    const geolocationStep: StepInfo = geo.isFetching
      ? { status: "loading", attempt: geo.failureCount }
      : geo.isError
        ? {
            status: "failed",
            error: geo.error.message,
            onRetry: () => {
              announce("Retrying geolocation");
              geo.refetch();
            },
          }
        : geo.data
          ? { status: "complete" }
          : { status: "loading", attempt: geo.failureCount };

    const weatherStep: StepInfo =
      locations.length === 0
        ? { status: "waiting" }
        : weatherQuery.isFetching
          ? { status: "loading", attempt: weatherQuery.failureCount }
          : weatherQuery.isError
            ? {
                status: "failed",
                error: "Weather data couldn't be loaded",
                onRetry: () => {
                  announce("Retrying weather");
                  weatherQuery.refetch();
                },
              }
            : { status: "loading", attempt: weatherQuery.failureCount };

    return (
      <LoadingScreen
        geolocation={geolocationStep}
        weather={weatherStep}
        geoDenied={isPermissionDenied(geo.error)}
        onAddCity={addCity}
      />
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col px-2 sm:px-8 pb-4">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[500] focus:rounded-md focus:border focus:bg-background focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="relative flex items-center py-4 gap-4">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight outline-none"
        >
          <span className="hidden sm:inline-block">Weather in</span>{" "}
          {headingLabel}
        </h1>
        <div className="ml-auto flex items-center gap-4">
          <CitySwitcher
            cities={cities}
            selectedId={activeId}
            currentLabel={currentLabel}
            geoLabel={geoLabel}
            geoStatus={geoStatus}
            onSelect={handleSelect}
            onAdd={addCity}
            onRemove={removeCity}
          />
          <Button
            onClick={() => {
              announce("Reloading weather");
              Promise.allSettled([
                weatherQuery.refetch(),
                airQualityQuery.refetch(),
              ]).then(() => announce("Weather updated"));
            }}
            variant="outline"
          >
            Reload
          </Button>
          <ModeToggle />
        </div>
      </header>
      {/*
        Pairing: Current + Map together (both "at a glance" current-state
        cards), Overview + Forecast together (both detailed/browsable). On
        mobile the charts come before the map (order-2 vs order-3); desktop
        pairs Current with Map in row one and Overview with Forecast in row
        two via lg:order.
      */}
      <main id="main-content" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="order-1 lg:order-1">
          <CurrentCard weather={weather} airQuality={airQuality} />
        </div>
        <div className="order-3 lg:order-2 h-full">
          <Map
            latitude={weather.latitude}
            longitude={weather.longitude}
            city={activeCity ? activeCity.name : geoLabel}
            country={activeCity?.country ?? address?.countryName ?? ""}
            temperature={weather.current.temperature2m}
            humidity={weather.current.relativeHumidity2m}
            weatherCode={weather.current.weatherCode}
            isDay={weather.current.isDay}
            windSpeed={weather.current.windSpeed10m}
            usAqi={airQuality?.current.usAqi}
          />
        </div>
        <div className="order-2 lg:order-3">
          <OverviewChart {...weather.hourly} />
        </div>
        <div className="order-4 lg:order-4 h-full">
          <Forecast {...weather.daily} />
        </div>
      </main>
    </div>
  );
};

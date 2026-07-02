import { CitySwitcher, GeoStatus } from "@/components/city-switcher";
import { CurrentCard } from "@/components/current-card";
import { Forecast } from "@/components/forecast";
import { LanguageToggle } from "@/components/language-toggle";
import { LoadingScreen, StepInfo } from "@/components/loading-screen";
import { Map } from "@/components/map";
import { ModeToggle } from "@/components/mode-toggle";
import { OverviewChart } from "@/components/overview-chart";
import { Button } from "@/components/ui/button";
import { cityLabel, GEO_CITY_ID, useCities } from "@/hooks/use-cities";
import { useLanguage } from "@/hooks/use-language";
import {
  useAddress,
  useAirQualityForLocations,
  useGeolocation,
  useWeatherForLocations,
} from "@/hooks/use-weather-queries";
import { announce } from "@/lib/announcer";
import {
  getGeoErrorMessageKey,
  isPermissionDenied,
} from "@/services/geolocation";
import { useEffect, useMemo, useRef } from "react";

export const App = () => {
  const { t, lang } = useLanguage();
  // Latest t for callbacks that resolve later (e.g. after a refetch): a
  // closure-captured t would announce in a language the user already left.
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);
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
    [geo.data, cities],
  );

  const weatherQuery = useWeatherForLocations(locations);
  const airQualityQuery = useAirQualityForLocations(locations);
  const addressQuery = useAddress(geo.data, lang);

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
  const geoLabel = address ? address.city : t("app.myLocation");
  const currentLabel = activeCity ? cityLabel(activeCity) : geoLabel;
  const headingLabel = activeCity
    ? cityLabel(activeCity)
    : address
      ? `${address.city} ${
          address.locality.toLowerCase() !== address.city.toLowerCase()
            ? address.locality
            : address.countryName
        }`
      : t("app.myLocation");

  // The switch back from the fallback city to the located position is an
  // unrequested context change: announce it once, without moving focus.
  const wasGeoFallback = useRef(isGeoFallback);
  useEffect(() => {
    if (wasGeoFallback.current && !isGeoFallback && geo.data) {
      announce(t("app.showingYourLocation", { city: geoLabel }));
    }
    wasGeoFallback.current = isGeoFallback;
  }, [isGeoFallback, geo.data, geoLabel, t]);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const wasLoaded = useRef(false);
  useEffect(() => {
    if (!weather) {
      // Reset so the next loading-screen -> app transition (e.g. switching to
      // a not-yet-fetched city) also gets the announce + focus handoff.
      wasLoaded.current = false;
      return;
    }
    document.title = t("app.docTitle", {
      city: activeCity ? activeCity.name : geoLabel,
    });
    if (!wasLoaded.current) {
      // Handoff from the loading screen: without this, focus is dropped on
      // <body> when LoadingScreen unmounts.
      wasLoaded.current = true;
      announce(t("app.weatherLoaded", { city: currentLabel }));
      headingRef.current?.focus();
    }
  }, [weather, activeCity, geoLabel, currentLabel, t]);

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
            error: t(getGeoErrorMessageKey(geo.error)),
            onRetry: () => {
              announce(t("app.retryingGeolocation"));
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
                error: t("app.weatherLoadFailed"),
                onRetry: () => {
                  announce(t("app.retryingWeather"));
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
        className="sr-only focus:not-sr-only focus:absolute focus:inset-s-2 focus:top-2 focus:z-500 focus:rounded-md focus:border focus:bg-background focus:px-3 focus:py-2"
      >
        {t("app.skipToContent")}
      </a>
      <header className="relative flex flex-wrap items-center py-4 gap-x-4 gap-y-2">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight outline-none"
        >
          <span className="hidden sm:inline-block">{t("app.weatherIn")}</span>{" "}
          {/* bdi: a Latin-script city name inside the Arabic heading (or an
              Arabic one inside English) must not reorder the surrounding
              text. */}
          <bdi>{headingLabel}</bdi>
        </h1>
        <div className="ms-auto flex flex-wrap items-center justify-end gap-2 gap-y-2 sm:gap-4">
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
              announce(t("app.reloadingWeather"));
              Promise.allSettled([
                weatherQuery.refetch(),
                airQualityQuery.refetch(),
              ]).then(() => announce(tRef.current("app.weatherUpdated")));
            }}
            variant="outline"
          >
            {t("app.reload")}
          </Button>
          <LanguageToggle />
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

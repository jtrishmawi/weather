import { CurrentCard } from "@/components/current-card";
import { Forecast } from "@/components/forecast";
import { Map } from "@/components/map";
import { ModeToggle } from "@/components/mode-toggle";
import { OverviewChart } from "@/components/overview-chart";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useReverseGeocoding } from "@/hooks/useReverseGeocoding";
import { useWeatherApi } from "@/hooks/useWeatherApi";

export const App = () => {
  const geolocation = useGeolocation();
  const weather = useWeatherApi(geolocation.data);
  const geocoding = useReverseGeocoding(weather.data);

  if (geolocation.isLoading) {
    return (
      <p className="w-full h-screen flex items-center justify-center gap-4">
        Geolocation is loading...
        <br />
        (you may need to enable permissions)
      </p>
    );
  }

  if (weather.isLoading) {
    return (
      <p className="w-full h-screen flex items-center justify-center gap-4">
        Weather is loading...
      </p>
    );
  }

  if (geocoding.isLoading) {
    return (
      <p className="w-full h-screen flex items-center justify-center gap-4">
        Geocoding is loading...
      </p>
    );
  }

  if (geolocation.isError) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <p>
          Enable permissions to access your location data or check or device
          settings
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (weather.isError) {
    return (
      <p className="w-full h-screen flex flex-col items-center justify-center gap-4">
        Weather error...
      </p>
    );
  }

  if (geocoding.isError) {
    return (
      <p className="w-full h-screen flex flex-col items-center justify-center gap-4">
        Geocoding error...
      </p>
    );
  }

  if (geolocation.isFetching || weather.isFetching || geocoding.isFetching) {
    return (
      <p className="w-full h-screen flex flex-col items-center justify-center gap-4">
        Loading data...
      </p>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col px-2 sm:px-8 pb-4">
      <div className="flex items-center py-4 gap-4">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
          <span className="hidden sm:inline-block">Weather in</span>{" "}
          {geocoding.data?.city}, {geocoding.data?.countryName}
        </h1>
        <Button
          onClick={() => weather.refetch()}
          variant="outline"
          className="ml-auto"
        >
          Reload
        </Button>
        <ModeToggle />
      </div>
      <div className="flex flex-col lg:flex-row lg:flex-wrap gap-y-4">
        <div className="lg:basis-1/2 xl:basis-2/3 order-1">
          <CurrentCard weather={weather.data!} />
        </div>
        <div className="lg:basis-1/2 order-2 lg:order-3">
          <OverviewChart {...weather.data!.hourly} />
        </div>
        <div className="lg:basis-1/2 xl:basis-1/3 order-3 lg:order-2">
          <Map
            latitude={weather.data!.latitude}
            longitude={weather.data!.longitude}
            city={geocoding.data!.city}
            country={geocoding.data!.countryName}
            temperature={weather.data!.current.temperature2m}
            humidity={weather.data!.current.relativeHumidity2m}
            weatherCode={weather.data!.current.weatherCode}
            isDay={weather.data!.current.isDay}
          />
        </div>
        <div className="lg:basis-1/2 order-4">
          <Forecast {...weather.data!.daily} />
        </div>
      </div>
    </div>
  );
};

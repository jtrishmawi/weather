import { Forecast } from "@/components/forecast";
import { Map } from "@/components/map";
import { ModeToggle } from "@/components/mode-toggle";
import { OverviewChart } from "@/components/overview-chart";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useReverseGeocoding } from "@/hooks/useReverseGeocoding";
import { useWeatherApi } from "@/hooks/useWeatherApi";
import { CurrentCard } from "./components/current-card";
import { Button } from "./components/ui/button";

export const App = () => {
  const geolocation = useGeolocation();
  const weather = useWeatherApi(geolocation.data);
  const geocoding = useReverseGeocoding(geolocation.data);

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
        <p>Enable permissions to access your location data</p>
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
    <div className="w-full h-screen flex flex-col px-8 pb-4">
      <div className="flex items-center justify-between py-4 col-span-2">
        <h1 className="text-3xl font-bold">WeatherApp</h1>
        <div className="flex gap-2">
          <Button onClick={() => weather.refetch()} variant="outline">
            Reload
          </Button>
          <ModeToggle />
        </div>
      </div>
      <div className="grid grid-cols-2">
        <CurrentCard geocoding={geocoding.data!} weather={weather.data!} />
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
        <OverviewChart {...weather.data!.hourly} />
        <Forecast {...weather.data!.daily} />
      </div>
    </div>
  );
};

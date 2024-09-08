import { Forecast } from "@/components/forecast";
import { Map } from "@/components/map";
import { ModeToggle } from "@/components/mode-toggle";
import { OverviewChart } from "@/components/overview-chart";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useReverseGeocoding } from "@/hooks/useReverseGeocoding";
import { useWeatherApi } from "@/hooks/useWeatherApi";
import { CurrentCard } from "./components/current-card";
import { Button } from "./components/ui/button";

export const App = () => {
  const geolocation = useGeolocation();
  const weather = useWeatherApi(geolocation.data!);
  const geocoding = useReverseGeocoding(geolocation.data!);

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

  if (geolocation.isIdle || weather.isIdle || geocoding.isIdle) {
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
        <ModeToggle />
      </div>

      <ResizablePanelGroup direction="vertical">
        <ResizablePanel>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="rounded-xl border-2 dark:bg-neutral-800 bg-neutral-100">
              <CurrentCard
                geocoding={geocoding.data!}
                weather={weather.data!}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="rounded-xl border-2 overflow-hidden dark:bg-neutral-800 bg-neutral-100">
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
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="rounded-xl border-2 dark:bg-neutral-800 bg-neutral-100">
              <OverviewChart {...weather.data!.hourly} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="rounded-xl border-2 dark:bg-neutral-800 bg-neutral-100">
              <Forecast {...weather.data!.daily} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

import { ModeToggle } from "@/components/mode-toggle";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useReverseGeocoding } from "@/hooks/useReverseGeocoding";
import { useWeatherApi } from "@/hooks/useWeatherApi";
import { OverviewChart } from "./components/overview-chart";

export const App = () => {
  const state = useGeolocation();
  const weather = useWeatherApi(state);
  const geocoding = useReverseGeocoding(state);

  if (state.loading) {
    return (
      <p>Geolocation is loading... (you may need to enable permissions)</p>
    );
  }
  if (weather.isLoading) {
    return <p>Weather is loading...</p>;
  }
  if (geocoding.isLoading) {
    return <p>Geocoding is loading...</p>;
  }

  if (state.error) {
    return <p>Enable permissions to access your location data</p>;
  }

  if (weather.isError || geocoding.isError) {
    return <p>Weather error</p>;
  }

  if (geocoding.isError) {
    return <p>Geocoding error</p>;
  }

  return (
    <div className="w-full h-screen">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-3xl font-bold">Weather App</h1>
          <ModeToggle />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          <div className="rounded-xl border-2 p-2">
            <h2>{geocoding.data?.city}</h2>
          </div>
          <div className="rounded-xl border-2">Map</div>
          <div className="rounded-xl border-2 p-2">
            <h2>Overview</h2>
            <OverviewChart {...weather.data!.hourly} />
          </div>
          <div className="rounded-xl border-2 p-2">Forecast</div>
        </div>
      </div>
    </div>
  );
};

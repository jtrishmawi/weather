import { Map } from "@/components/map";
import { ModeToggle } from "@/components/mode-toggle";
import { OverviewChart } from "@/components/overview-chart";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useReverseGeocoding } from "@/hooks/useReverseGeocoding";
import { useWeatherApi } from "@/hooks/useWeatherApi";
import { Forecast } from "@/components/forecast";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { getWMOCode, getWMOImageUrl } from "./lib/wmo-codes";

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

  if (state.error && state.latitude === null && state.longitude === null) {
    console.error(state.error);
    return <p>Enable permissions to access your location data</p>;
  }

  if (weather.isError || geocoding.isError) {
    return <p>Weather error</p>;
  }

  if (geocoding.isError) {
    return <p>Geocoding error</p>;
  }
  console.log(weather.data?.current);
  return (
    <div className="w-full h-screen flex flex-col px-8 pb-4">
      <div className="flex items-center justify-between py-4 col-span-2">
        <h1 className="text-3xl font-bold">Weather App</h1>
        <ModeToggle />
      </div>

      <ResizablePanelGroup direction="vertical">
        <ResizablePanel>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="rounded-xl border-2 dark:bg-neutral-800 bg-neutral-100">
              <h2 className="scroll-m-20 m-2 text-3xl font-semibold tracking-tight first:mt-0">
                {geocoding.data?.city}, {geocoding.data?.countryName}
              </h2>
              {weather.data?.current && (
                <div>
                  <div>
                    <img
                      src={getWMOImageUrl(
                        weather.data?.current.weatherCode.toString(),
                        weather.data?.current.isDay ? "day" : "night"
                      )}
                      alt={getWMOCode(
                        weather.data?.current.weatherCode.toString()
                      )}
                    />
                    {weather.data?.current.temperature2m.toFixed(1)}&deg;C /
                    feels like:&nbsp;
                    {weather.data?.current.apparentTemperature.toFixed(1)}&deg;C
                  </div>
                  <div>
                    <div>
                      Humidity: {weather.data?.current.relativeHumidity2m}%
                    </div>
                    <div>Rain: {weather.data?.current.rain}mm</div>
                    <div>
                      Precipitation: {weather.data?.current.precipitation} mm
                    </div>
                    <div>Showers: {weather.data?.current.showers}mm</div>
                    <div>Snowfall: {weather.data?.current.snowfall}cm</div>
                    <div>Cloud cover: {weather.data?.current.cloudCover}%</div>
                    <div>
                      Wind: {weather.data?.current.windSpeed10m.toFixed(1)} km/h
                    </div>
                    <div>
                      Wind direction:{" "}
                      {weather.data?.current.windDirection10m.toFixed(1)}&deg;
                    </div>
                    <div>
                      Wind gusts:{" "}
                      {weather.data?.current.windGusts10m.toFixed(1)} km/h
                    </div>
                  </div>
                </div>
              )}
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

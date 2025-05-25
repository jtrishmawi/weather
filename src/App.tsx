import { CurrentCard } from "@/components/current-card";
import { Forecast } from "@/components/forecast";
import { Map } from "@/components/map";
import { ModeToggle } from "@/components/mode-toggle";
import { OverviewChart } from "@/components/overview-chart";
import { Button } from "@/components/ui/button";
import { WeatherProgress } from "./components/weather-progress";
import { useWeather } from "./hooks/use-weather";

export const App = () => {
  const { state, actions } = useWeather();
  const { geolocation, weather, address } = state;

  const isLoaded = !!geolocation && !!weather && !!address;

  if (!isLoaded) return <WeatherProgress />;

  return (
    <div className="w-full h-screen flex flex-col px-2 sm:px-8 pb-4">
      <div className="flex items-center py-4 gap-4">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
          <span className="hidden sm:inline-block">Weather in</span>{" "}
          {address.city}{" "}
          {address.locality.toLowerCase() !== address.city.toLowerCase()
            ? address.locality
            : address.countryName}
        </h1>
        <Button
          onClick={() => actions.fetchWeather(geolocation)}
          variant="outline"
          className="ml-auto"
        >
          Reload
        </Button>
        <ModeToggle />
      </div>
      <div className="flex flex-col lg:flex-row lg:flex-wrap gap-y-4">
        <div className="lg:basis-1/2 xl:basis-2/3 order-1">
          <CurrentCard weather={weather} />
        </div>
        <div className="lg:basis-1/2 order-2 lg:order-3">
          <OverviewChart {...weather.hourly} />
        </div>
        <div className="lg:basis-1/2 xl:basis-1/3 order-3 lg:order-2">
          <Map
            latitude={weather.latitude}
            longitude={weather.longitude}
            city={address.city}
            country={address.countryName}
            temperature={weather.current.temperature2m}
            humidity={weather.current.relativeHumidity2m}
            weatherCode={weather.current.weatherCode}
            isDay={weather.current.isDay}
          />
        </div>
        <div className="lg:basis-1/2 order-4">
          <Forecast {...weather.daily} />
        </div>
      </div>
    </div>
  );
};

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
  const { geolocation, weather, address, airQuality } = state;

  const isLoaded = !!geolocation && !!weather && !!address && !!airQuality;

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
      {/*
        Pairing: Current + Map together (both "at a glance" current-state
        cards), Overview + Forecast together (both detailed/browsable). On
        mobile the charts come before the map (order-2 vs order-3); desktop
        pairs Current with Map in row one and Overview with Forecast in row
        two via lg:order.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="order-1 lg:order-1">
          <CurrentCard weather={weather} airQuality={airQuality} />
        </div>
        <div className="order-3 lg:order-2 h-full">
          <Map
            latitude={weather.latitude}
            longitude={weather.longitude}
            city={address.city}
            country={address.countryName}
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
      </div>
    </div>
  );
};

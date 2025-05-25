import { WeatherContext } from "@/contexts/weather";
import { useContext } from "react";

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context)
    throw new Error("useWeatherContext must be used within WeatherProvider");
  return context;
};

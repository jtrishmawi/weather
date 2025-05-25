import { createContext } from "react";

export const WeatherContext = createContext<{
  state: WeatherState;
  actions: DispatchedActions;
} | null>(null);

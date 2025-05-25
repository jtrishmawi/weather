import { WeatherContext } from "@/contexts/weather";
import { actions } from "@/contexts/weather/actions";
import { reducer } from "@/contexts/weather/reducer";
import { initialState } from "@/contexts/weather/state";
import { useEffect, useReducer } from "react";

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dispatchedActions = actions(dispatch);

  useEffect(() => {
    const now = Date.now();
    const canRetry =
      (!state.retryGeolocation.nextRetry ||
        now >= state.retryGeolocation.nextRetry) &&
      (!state.retryWeather.nextRetry || now >= state.retryWeather.nextRetry) &&
      (!state.retryAddress.nextRetry || now >= state.retryAddress.nextRetry);

    if (canRetry) {
      dispatchedActions.fetchAll();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (
        state.retryGeolocation.nextRetry &&
        now >= state.retryGeolocation.nextRetry
      ) {
        dispatchedActions.fetchGeolocation();
      }
      if (
        state.retryWeather.nextRetry &&
        now >= state.retryWeather.nextRetry &&
        state.geolocation
      ) {
        dispatchedActions.fetchWeather(state.geolocation);
      }
      if (
        state.retryAddress.nextRetry &&
        now >= state.retryAddress.nextRetry &&
        state.weather
      ) {
        dispatchedActions.fetchAddress(state.weather);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    state.retryGeolocation.nextRetry,
    state.retryWeather.nextRetry,
    state.retryAddress.nextRetry,
  ]);

  return (
    <WeatherContext.Provider value={{ state, actions: dispatchedActions }}>
      {children}
    </WeatherContext.Provider>
  );
};

import { queryClient } from "@/lib/query-client";
import { fetchGeolocation } from "@/services/geolocation";
import { fetchAddress } from "@/services/reverse-geocoding";
import { fetchWeather } from "@/services/weather";
import { Dispatch } from "react";

export const actions = (dispatch: Dispatch<Actions>): DispatchedActions => {
  const fetchGeolocationAction = async () => {
    try {
      dispatch({ type: "FETCH_GEO_START" });
      const data = await queryClient.fetchQuery({
        queryKey: ["geolocation"],
        queryFn: fetchGeolocation,
      });
      dispatch({ type: "FETCH_GEO_SUCCESS", payload: data });
      return data;
    } catch (error) {
      dispatch({ type: "FETCH_GEO_ERROR", payload: error as Error });
      throw error;
    }
  };

  const fetchWeatherAction = async (geoData: GeolocationObject) => {
    try {
      dispatch({ type: "FETCH_WEATHER_START" });
      const data = await queryClient.fetchQuery({
        queryKey: ["weather", geoData],
        queryFn: () => fetchWeather(geoData),
      });
      dispatch({ type: "FETCH_WEATHER_SUCCESS", payload: data });
      return data;
    } catch (error) {
      dispatch({ type: "FETCH_WEATHER_ERROR", payload: error as Error });
      throw error;
    }
  };

  const fetchAddressAction = async (weatherData: WeatherObject) => {
    try {
      dispatch({ type: "FETCH_ADDRESS_START" });
      const data = await queryClient.fetchQuery({
        queryKey: ["address", weatherData],
        queryFn: () => fetchAddress(weatherData),
      });
      dispatch({ type: "FETCH_ADDRESS_SUCCESS", payload: data });
      return data;
    } catch (error) {
      dispatch({ type: "FETCH_ADDRESS_ERROR", payload: error as Error });
      throw error;
    }
  };

  const fetchAll = async () => {
    try {
      const geo = await fetchGeolocationAction();
      const weather = await fetchWeatherAction(geo);
      await fetchAddressAction(weather);
    } catch (err) {
      console.error("fetchAll chain failed:", err);
    }
  };

  return {
    fetchGeolocation: fetchGeolocationAction,
    fetchWeather: fetchWeatherAction,
    fetchAddress: fetchAddressAction,
    fetchAll,
  };
};

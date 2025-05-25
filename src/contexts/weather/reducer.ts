import { initialRetryMeta } from "./state";

export const reducer = (state: WeatherState, action: Actions): WeatherState => {
  const timestamp = new Date().toISOString();

  const baseState = (() => {
    switch (action.type) {
      case "FETCH_GEO_START":
        return { ...state, loadingGeolocation: true };
      case "FETCH_GEO_SUCCESS":
        return {
          ...state,
          loadingGeolocation: false,
          geolocation: action.payload,
          retryGeolocation: initialRetryMeta(),
          history: [...state.history, `Geo success @ ${timestamp}`],
        };
      case "FETCH_GEO_ERROR": {
        const geoRetries = state.retryGeolocation.retries + 1;
        return {
          ...state,
          loadingGeolocation: false,
          errorGeolocation: action.payload,
          retryGeolocation: {
            retries: geoRetries,
            nextRetry: Date.now() + Math.min(300000, 2 ** geoRetries * 1000),
          },
        };
      }
      case "FETCH_WEATHER_START":
        return { ...state, loadingWeather: true };
      case "FETCH_WEATHER_SUCCESS":
        return {
          ...state,
          loadingWeather: false,
          weather: action.payload,
          retryWeather: initialRetryMeta(),
          history: [...state.history, `Weather success @ ${timestamp}`],
        };
      case "FETCH_WEATHER_ERROR": {
        const weatherRetries = state.retryWeather.retries + 1;
        return {
          ...state,
          loadingWeather: false,
          errorWeather: action.payload,
          retryWeather: {
            retries: weatherRetries,
            nextRetry:
              Date.now() + Math.min(300000, 2 ** weatherRetries * 1000),
          },
        };
      }
      case "FETCH_ADDRESS_START":
        return { ...state, loadingAddress: true };
      case "FETCH_ADDRESS_SUCCESS":
        return {
          ...state,
          loadingAddress: false,
          address: action.payload,
          retryAddress: initialRetryMeta(),
          history: [...state.history, `Address success @ ${timestamp}`],
        };
      case "FETCH_ADDRESS_ERROR": {
        const addressRetries = state.retryWeather.retries + 1;
        return {
          ...state,
          loadingAddress: false,
          errorAddress: action.payload,
          retryAddress: {
            retries: addressRetries,
            nextRetry:
              Date.now() + Math.min(300000, 2 ** addressRetries * 1000),
          },
        };
      }
      default:
        return state;
    }
  })();

  return {
    ...baseState,
    dispatchHistory: [
      ...state.dispatchHistory,
      {
        action: action.type,
        timestamp,
        payload: "payload" in action ? action.payload : undefined,
      },
    ],
  };
};

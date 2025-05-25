export const initialRetryMeta = (): RetryMeta => ({
  retries: 0,
  nextRetry: null,
});

export const initialState: WeatherState = {
  loadingGeolocation: false,
  loadingWeather: false,
  loadingAddress: false,
  retryGeolocation: initialRetryMeta(),
  retryWeather: initialRetryMeta(),
  retryAddress: initialRetryMeta(),
  history: [],
  dispatchHistory: [],
};

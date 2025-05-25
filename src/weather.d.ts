type ActionMap<M extends { [index: string]: unknown }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

type Theme = "dark" | "light" | "system";

type GeolocationObject = {
  latitude: number | null;
  longitude: number | null;
};

type WeatherObject = {
  current: {
    time: Date;
    temperature2m: number;
    relativeHumidity2m: number;
    apparentTemperature: number;
    isDay: boolean;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weatherCode: number;
    cloudCover: number;
    windSpeed10m: number;
    windDirection10m: number;
    windGusts10m: number;
  };
  daily: {
    time: Date[];
    weatherCode: Float32Array<ArrayBufferLike>;
    temperature2mMax: Float32Array<ArrayBufferLike>;
    temperature2mMin: Float32Array<ArrayBufferLike>;
    precipitationSum: Float32Array<ArrayBufferLike>;
  };
  hourly: {
    time: Date[];
    temperature2m: Float32Array<ArrayBufferLike>;
    precipitation: Float32Array<ArrayBufferLike>;
  };
  latitude: number;
  longitude: number;
};

type GeocodingObject = {
  latitude: number;
  lookupSource: string;
  longitude: number;
  localityLanguageRequested: string;
  continent: string;
  continentCode: string;
  countryName: string;
  countryCode: string;
  principalSubdivision: string;
  principalSubdivisionCode: string;
  city: string;
  locality: string;
  postcode: string;
  plusCode: string;
  fips: {
    state: string;
    country: string;
    countySubdivision: string;
    place: string;
  };
  csdCode: string;
  localityInfo: {
    administrative: {
      name: string;
      description: string;
      isoName: string;
      order: number;
      adminLevel: number;
      isoCode: string;
      wikidataId: string;
      geonameId: number;
      chinaAdminCode: string;
    }[];
    informative: {
      name: string;
      description: string;
      isoName: string;
      order: number;
      adminLevel: number;
      isoCode: string;
      wikidataId: string;
      geonameId: number;
      chinaAdminCode: string;
    }[];
  };
};

type RetryMeta = {
  retries: number;
  nextRetry: number | null;
};

type DispatchHistoryEntry = {
  action: string;
  timestamp: string;
  payload?: unknown;
};

type WeatherState = {
  geolocation?: GeolocationObject;
  weather?: WeatherObject;
  address?: GeocodingObject;
  loadingGeolocation: boolean;
  loadingWeather: boolean;
  loadingAddress: boolean;
  errorGeolocation?: Error;
  errorWeather?: Error;
  errorAddress?: Error;
  retryGeolocation: RetryMeta;
  retryWeather: RetryMeta;
  retryAddress: RetryMeta;
  history: string[];
  dispatchHistory: DispatchHistoryEntry[];
};

type Payload = {
  FETCH_GEO_START: undefined;
  FETCH_GEO_SUCCESS: GeolocationObject;
  FETCH_GEO_ERROR: Error;
  FETCH_WEATHER_START: undefined;
  FETCH_WEATHER_SUCCESS: WeatherObject;
  FETCH_WEATHER_ERROR: Error;
  FETCH_ADDRESS_START: undefined;
  FETCH_ADDRESS_SUCCESS: GeocodingObject;
  FETCH_ADDRESS_ERROR: Error;
};

type DispatchedActions = {
  fetchGeolocation: () => Promise<GeolocationObject>;
  fetchWeather: (geoData: GeolocationObject) => Promise<WeatherObject>;
  fetchAddress: (weatherData: WeatherObject) => Promise<GeocodingObject>;
  fetchAll: () => Promise<void>;
};

type Actions = ActionMap<Payload>[keyof ActionMap<Payload>];

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
    uvIndex: number;
    dewPoint2m: number;
    visibility: number;
  };
  daily: {
    time: Date[];
    weatherCode: Float32Array<ArrayBufferLike>;
    temperature2mMax: Float32Array<ArrayBufferLike>;
    temperature2mMin: Float32Array<ArrayBufferLike>;
    precipitationSum: Float32Array<ArrayBufferLike>;
    sunrise: Date[];
    sunset: Date[];
    daylightDuration: Float32Array<ArrayBufferLike>;
    uvIndexMax: Float32Array<ArrayBufferLike>;
    precipitationProbabilityMax: Float32Array<ArrayBufferLike>;
    windSpeed10mMax: Float32Array<ArrayBufferLike>;
    windGusts10mMax: Float32Array<ArrayBufferLike>;
    windDirection10mDominant: Float32Array<ArrayBufferLike>;
  };
  hourly: {
    time: Date[];
    temperature2m: Float32Array<ArrayBufferLike>;
    precipitation: Float32Array<ArrayBufferLike>;
    relativeHumidity2m: Float32Array<ArrayBufferLike>;
    windSpeed10m: Float32Array<ArrayBufferLike>;
    precipitationProbability: Float32Array<ArrayBufferLike>;
    uvIndex: Float32Array<ArrayBufferLike>;
  };
  latitude: number;
  longitude: number;
};

type AirQualityObject = {
  current: {
    time: Date;
    usAqi: number;
    europeanAqi: number;
    pm2_5: number;
    pm10: number;
    ozone: number;
  };
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
  airQuality?: AirQualityObject;
  loadingGeolocation: boolean;
  loadingWeather: boolean;
  loadingAddress: boolean;
  loadingAirQuality: boolean;
  errorGeolocation?: Error;
  errorWeather?: Error;
  errorAddress?: Error;
  errorAirQuality?: Error;
  retryGeolocation: RetryMeta;
  retryWeather: RetryMeta;
  retryAddress: RetryMeta;
  retryAirQuality: RetryMeta;
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
  FETCH_AIR_QUALITY_START: undefined;
  FETCH_AIR_QUALITY_SUCCESS: AirQualityObject;
  FETCH_AIR_QUALITY_ERROR: Error;
};

type DispatchedActions = {
  fetchGeolocation: () => Promise<GeolocationObject>;
  fetchWeather: (geoData: GeolocationObject) => Promise<WeatherObject>;
  fetchAddress: (weatherData: WeatherObject) => Promise<GeocodingObject>;
  fetchAirQuality: (weatherData: WeatherObject) => Promise<AirQualityObject>;
  fetchAll: () => Promise<void>;
};

type Actions = ActionMap<Payload>[keyof ActionMap<Payload>];

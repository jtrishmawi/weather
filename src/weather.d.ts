type Theme = "dark" | "light" | "system";

type GeolocationObject = {
  latitude: number;
  longitude: number;
};

type City = {
  id: string;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
};

type WeatherLocation = {
  id: string;
  latitude: number;
  longitude: number;
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

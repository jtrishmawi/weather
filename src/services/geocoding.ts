type GeocodingParams = {
  latitude: number | null;
  longitude: number | null;
};

type GeocodingResponse = {
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

export const geocode = async ({
  latitude,
  longitude,
}: GeocodingParams): Promise<GeocodingResponse> => {
  if (!latitude || !longitude) {
    return Promise.reject(new Error("latitude and longitude are required"));
  }
  const url = new URL(
    "https://api.bigdatacloud.net/data/reverse-geocode-client"
  );
  url.searchParams.append("latitude", String(latitude));
  url.searchParams.append("longitude", String(longitude));
  url.searchParams.append("localityLanguage", "fr");
  const response = await fetch(url);
  return response.json();
};

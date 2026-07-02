import type { MessageKey } from "@/i18n";

// Descriptions are i18n message keys; render them with t(getWMOCode(...)).
const lookup: Record<
  string,
  {
    day: { description: MessageKey; image: string };
    night: { description: MessageKey; image: string };
  }
> = {
  "0": {
    day: {
      description: "wmo.sunny",
      image: "https://openweathermap.org/img/wn/01d@2x.png",
    },
    night: {
      description: "wmo.clear",
      image: "https://openweathermap.org/img/wn/01n@2x.png",
    },
  },
  "1": {
    day: {
      description: "wmo.mainlySunny",
      image: "https://openweathermap.org/img/wn/01d@2x.png",
    },
    night: {
      description: "wmo.mainlyClear",
      image: "https://openweathermap.org/img/wn/01n@2x.png",
    },
  },
  "2": {
    day: {
      description: "wmo.partlyCloudy",
      image: "https://openweathermap.org/img/wn/02d@2x.png",
    },
    night: {
      description: "wmo.partlyCloudy",
      image: "https://openweathermap.org/img/wn/02n@2x.png",
    },
  },
  "3": {
    day: {
      description: "wmo.cloudy",
      image: "https://openweathermap.org/img/wn/03d@2x.png",
    },
    night: {
      description: "wmo.cloudy",
      image: "https://openweathermap.org/img/wn/03n@2x.png",
    },
  },
  "45": {
    day: {
      description: "wmo.foggy",
      image: "https://openweathermap.org/img/wn/50d@2x.png",
    },
    night: {
      description: "wmo.foggy",
      image: "https://openweathermap.org/img/wn/50n@2x.png",
    },
  },
  "48": {
    day: {
      description: "wmo.rimeFog",
      image: "https://openweathermap.org/img/wn/50d@2x.png",
    },
    night: {
      description: "wmo.rimeFog",
      image: "https://openweathermap.org/img/wn/50n@2x.png",
    },
  },
  "51": {
    day: {
      description: "wmo.lightDrizzle",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "wmo.lightDrizzle",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "53": {
    day: {
      description: "wmo.drizzle",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "wmo.drizzle",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "55": {
    day: {
      description: "wmo.heavyDrizzle",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "wmo.heavyDrizzle",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "56": {
    day: {
      description: "wmo.lightFreezingDrizzle",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "wmo.lightFreezingDrizzle",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "57": {
    day: {
      description: "wmo.freezingDrizzle",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "wmo.freezingDrizzle",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "61": {
    day: {
      description: "wmo.lightRain",
      image: "https://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "wmo.lightRain",
      image: "https://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  "63": {
    day: {
      description: "wmo.rain",
      image: "https://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "wmo.rain",
      image: "https://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  "65": {
    day: {
      description: "wmo.heavyRain",
      image: "https://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "wmo.heavyRain",
      image: "https://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  "66": {
    day: {
      description: "wmo.lightFreezingRain",
      image: "https://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "wmo.lightFreezingRain",
      image: "https://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  "67": {
    day: {
      description: "wmo.freezingRain",
      image: "https://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "wmo.freezingRain",
      image: "https://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  "71": {
    day: {
      description: "wmo.lightSnow",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "wmo.lightSnow",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  "73": {
    day: {
      description: "wmo.snow",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "wmo.snow",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  "75": {
    day: {
      description: "wmo.heavySnow",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "wmo.heavySnow",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  "77": {
    day: {
      description: "wmo.snowGrains",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "wmo.snowGrains",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  "80": {
    day: {
      description: "wmo.lightShowers",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "wmo.lightShowers",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "81": {
    day: {
      description: "wmo.showers",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "wmo.showers",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "82": {
    day: {
      description: "wmo.heavyShowers",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "wmo.heavyShowers",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "85": {
    day: {
      description: "wmo.lightSnowShowers",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "wmo.lightSnowShowers",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  "86": {
    day: {
      description: "wmo.snowShowers",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "wmo.snowShowers",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  "95": {
    day: {
      description: "wmo.thunderstorm",
      image: "https://openweathermap.org/img/wn/11d@2x.png",
    },
    night: {
      description: "wmo.thunderstorm",
      image: "https://openweathermap.org/img/wn/11n@2x.png",
    },
  },
  "96": {
    day: {
      description: "wmo.lightThunderstormsHail",
      image: "https://openweathermap.org/img/wn/11d@2x.png",
    },
    night: {
      description: "wmo.lightThunderstormsHail",
      image: "https://openweathermap.org/img/wn/11n@2x.png",
    },
  },
  "99": {
    day: {
      description: "wmo.thunderstormHail",
      image: "https://openweathermap.org/img/wn/11d@2x.png",
    },
    night: {
      description: "wmo.thunderstormHail",
      image: "https://openweathermap.org/img/wn/11n@2x.png",
    },
  },
};
export const getWMOCode = (
  wmoCode: string,
  time: "day" | "night" = "day",
): MessageKey => lookup[wmoCode]?.[time]?.["description"] || "wmo.unknown";

export const getWMOImageUrl = (
  wmoCode: string,
  time: "day" | "night" = "day",
) =>
  lookup[wmoCode]?.[time]?.["image"] || "https://placehold.co/100?text=Unknown";

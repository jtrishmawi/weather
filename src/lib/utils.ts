import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export const getCardinalDirection = (deg: number) => {
  const directions = [
    "North",
    "Northeast",
    "East",
    "Southeast",
    "South",
    "Southwest",
    "West",
    "Northwest",
  ];
  return directions[Math.round(deg / 45) % 8];
};

export const timeAgo = (date: Date) => {
  const formatter = new Intl.RelativeTimeFormat();
  const ranges = {
    years: 3600 * 24 * 365,
    months: 3600 * 24 * 30,
    weeks: 3600 * 24 * 7,
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1,
  };
  const secondsElapsed = (date.getTime() - new Date().getTime()) / 1000;
  let key: keyof typeof ranges;
  for (key in ranges) {
    if (ranges[key] <= Math.abs(secondsElapsed)) {
      return formatter.format(Math.round(secondsElapsed / ranges[key]), key);
    }
  }
};

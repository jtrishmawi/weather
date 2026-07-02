import type { MessageKey } from "@/i18n";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export const getUvSeverityLabel = (uv: number): MessageKey => {
  if (uv < 3) return "uv.low";
  if (uv < 6) return "uv.moderate";
  if (uv < 8) return "uv.high";
  if (uv < 11) return "uv.veryHigh";
  return "uv.extreme";
};

export const getCardinalDirection = (deg: number): MessageKey => {
  const directions: MessageKey[] = [
    "dir.n",
    "dir.ne",
    "dir.e",
    "dir.se",
    "dir.s",
    "dir.sw",
    "dir.w",
    "dir.nw",
  ];
  return directions[Math.round(deg / 45) % 8];
};

import type { MessageKey } from "@/i18n";

export const getAqiSeverity = (
  aqi: number,
): { labelKey: MessageKey; colorClass: string; bgClass: string } => {
  if (aqi <= 50)
    return {
      labelKey: "aqi.good",
      colorClass: "text-green-500",
      bgClass: "bg-green-500/15",
    };
  if (aqi <= 100)
    return {
      labelKey: "aqi.moderate",
      colorClass: "text-yellow-500",
      bgClass: "bg-yellow-500/15",
    };
  if (aqi <= 150)
    return {
      labelKey: "aqi.sensitive",
      colorClass: "text-orange-500",
      bgClass: "bg-orange-500/15",
    };
  if (aqi <= 200)
    return {
      labelKey: "aqi.unhealthy",
      colorClass: "text-red-500",
      bgClass: "bg-red-500/15",
    };
  if (aqi <= 300)
    return {
      labelKey: "aqi.veryUnhealthy",
      colorClass: "text-purple-500",
      bgClass: "bg-purple-500/15",
    };
  return {
    labelKey: "aqi.hazardous",
    colorClass: "text-red-800",
    bgClass: "bg-red-800/15",
  };
};

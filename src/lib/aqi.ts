export const getAqiSeverity = (aqi: number) => {
  if (aqi <= 50) return { label: "Good", colorClass: "text-green-500" };
  if (aqi <= 100) return { label: "Moderate", colorClass: "text-yellow-500" };
  if (aqi <= 150)
    return {
      label: "Unhealthy for Sensitive Groups",
      colorClass: "text-orange-500",
    };
  if (aqi <= 200) return { label: "Unhealthy", colorClass: "text-red-500" };
  if (aqi <= 300)
    return { label: "Very Unhealthy", colorClass: "text-purple-500" };
  return { label: "Hazardous", colorClass: "text-red-800" };
};

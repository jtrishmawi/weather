export const getAqiSeverity = (aqi: number) => {
  if (aqi <= 50)
    return {
      label: "Good",
      colorClass: "text-green-500",
      bgClass: "bg-green-500/15",
    };
  if (aqi <= 100)
    return {
      label: "Moderate",
      colorClass: "text-yellow-500",
      bgClass: "bg-yellow-500/15",
    };
  if (aqi <= 150)
    return {
      label: "Unhealthy for Sensitive Groups",
      colorClass: "text-orange-500",
      bgClass: "bg-orange-500/15",
    };
  if (aqi <= 200)
    return {
      label: "Unhealthy",
      colorClass: "text-red-500",
      bgClass: "bg-red-500/15",
    };
  if (aqi <= 300)
    return {
      label: "Very Unhealthy",
      colorClass: "text-purple-500",
      bgClass: "bg-purple-500/15",
    };
  return {
    label: "Hazardous",
    colorClass: "text-red-800",
    bgClass: "bg-red-800/15",
  };
};

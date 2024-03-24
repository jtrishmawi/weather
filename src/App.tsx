import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeather } from "./hooks/useWeather";

export const App = () => {
  const state = useGeolocation();
  const { data, isLoading, isError } = useWeather(state);
console.log(data)
  if (isLoading) {
    return <p>loading... (you may need to enable permissions)</p>;
  }

  if (isError) {
    return <p>Enable permissions to access your location data</p>;
  }

  return <div>App</div>;
};

import { App } from "@/App";
import "@/index.css";
import { queryClient } from "@/lib/query-client";
import { ThemeProvider } from "@/providers/theme-provider";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import React from "react";
import ReactDOM from "react-dom/client";
import superjson from "superjson";
import { WeatherProvider } from "./providers/weather-provider";

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  serialize: superjson.stringify,
  deserialize: superjson.parse,
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WeatherProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </WeatherProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

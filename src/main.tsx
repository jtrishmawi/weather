import { App } from "@/App";
import { StatusAnnouncer } from "@/components/status-announcer";
import "@/index.css";
import { queryClient } from "@/lib/query-client";
import { ThemeProvider } from "@/providers/theme-provider";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import React from "react";
import ReactDOM from "react-dom/client";
import superjson from "superjson";

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
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <StatusAnnouncer />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

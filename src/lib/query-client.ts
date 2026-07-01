import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // gcTime must cover the persister's maxAge (24 h default) or restored
      // queries are garbage-collected instead of served from localStorage.
      gcTime: 24 * 60 * 60 * 1000,
      retry: 3,
    },
  },
});

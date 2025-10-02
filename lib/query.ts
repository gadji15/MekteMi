// TanStack Query client configuration

import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 min
      gcTime: 5 * 60_000, // 5 min
      refetchOnWindowFocus: true,
      retry: 2,
    },
    mutations: {
      retry: 1,
    },
  },
})
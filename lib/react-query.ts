// React Query client setup

import { QueryClient } from "@tanstack/react-query"

// Create a QueryClient with sensible defaults
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 60_000, // 1 minute
        gcTime: 5 * 60_000, // 5 minutes
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}
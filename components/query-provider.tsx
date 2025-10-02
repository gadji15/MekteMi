"use client"

import type React from "react"
import { useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { createQueryClient } from "@/lib/react-query"

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient())

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
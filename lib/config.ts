// Global configuration for API integration

export const config = {
  // Base URL of your Laravel backend (e.g. https://api.mbektemi.sn)
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  // Default timeout for API requests (ms)
  apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT || 10000),
}
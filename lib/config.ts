// Global configuration for API integration

export const config = {
  // Base URL of your Laravel backend (e.g. https://api.mbektemi.sn)
  // Fallback to http://localhost (Sail default) if env is not defined
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost",
  // Default timeout for API requests (ms)
  apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT || 10000),
}
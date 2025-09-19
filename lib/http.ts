// Minimal HTTP client for Laravel API integration
import { config } from "@/lib/config"

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface HttpOptions {
  method?: HttpMethod
  headers?: HeadersInit
  body?: any
  signal?: AbortSignal
  // If the endpoint is absolute, skip baseUrl prefix
  absolute?: boolean
  // Set to true only if you rely on Laravel cookies (Sanctum SPA mode)
  withCredentials?: boolean
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  // Read directly to avoid circular imports
  return localStorage.getItem("auth-token")
}

function buildUrl(path: string, absolute?: boolean) {
  if (absolute) return path
  const base = config.apiBaseUrl.replace(/\/+$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

export async function http<T = unknown>(path: string, options: HttpOptions = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), config.apiTimeout)

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    }

    const token = getAuthToken()
    if (token) {
      // Attach Bearer token for protected routes
      ;(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
    }

    const res = await fetch(buildUrl(path, options.absolute), {
      method: options.method || "GET",
      headers,
      signal: options.signal ?? controller.signal,
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: options.withCredentials ? "include" : "omit",
      mode: "cors",
      cache: "no-store",
    })

    const contentType = res.headers.get("content-type")
    const isJson = contentType && contentType.includes("application/json")
    const payload = isJson ? await res.json() : await res.text()

    if (!res.ok) {
      // Try to surface a meaningful error message
      const message =
        (isJson && (payload?.message || payload?.error)) ||
        res.statusText ||
        "Request failed"
      const error = new Error(message) as Error & { status?: number; data?: unknown }
      error.status = res.status
      error.data = payload
      throw error
    }

    // Some Laravel APIs wrap data as { data: ... }
    return (payload?.data !== undefined ? payload.data : payload) as T
  } finally {
    clearTimeout(timeout)
  }
}

// Convenience helpers
export const httpGet = <T = unknown>(path: string, options?: Omit<HttpOptions, "method" | "body">) =>
  http<T>(path, { ...options, method: "GET" })

export const httpPost = <T = unknown>(path: string, body?: any, options?: Omit<HttpOptions, "method">) =>
  http<T>(path, { ...options, method: "POST", body })

export const httpPut = <T = unknown>(path: string, body?: any, options?: Omit<HttpOptions, "method">) =>
  http<T>(path, { ...options, method: "PUT", body })

export const httpPatch = <T = unknown>(path: string, body?: any, options?: Omit<HttpOptions, "method">) =>
  http<T>(path, { ...options, method: "PATCH", body })

export const httpDelete = <T = unknown>(path: string, options?: Omit<HttpOptions, "method" | "body">) =>
  http<T>(path, { ...options, method: "DELETE" })
// Axios-based HTTP client for Laravel API integration (meets academic requirement)
import axios, { type AxiosRequestConfig, type Method } from "axios"
import { config } from "@/lib/config"

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface HttpOptions {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: unknown
  signal?: AbortSignal
  absolute?: boolean
  withCredentials?: boolean
}

function buildUrl(path: string, absolute?: boolean) {
  if (absolute) return path
  const base = config.apiBaseUrl.replace(/\/+$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const prefix = `${name}=`
  const cookies = document.cookie ? document.cookie.split("; ") : []
  for (const c of cookies) {
    if (c.startsWith(prefix)) {
      return decodeURIComponent(c.slice(prefix.length))
    }
  }
  return null
}

// Create Axios instance
const client = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  withCredentials: false, // will be overridden per-request
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    "Content-Type": "application/json",
  },
})

// Optional: attach legacy bearer token if stored and not using cookies
client.interceptors.request.use((cfg) => {
  try {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth-token")
      if (token && !cfg.withCredentials) {
        cfg.headers = cfg.headers ?? {}
        cfg.headers["Authorization"] = `Bearer ${token}`
      }
      // Extra safety: when using cookies, ensure XSRF header is present
      if (cfg.withCredentials) {
        const xsrf = readCookie("XSRF-TOKEN")
        if (xsrf) {
          cfg.headers = cfg.headers ?? {}
          // Do not overwrite if already set by axios
          if (!("X-XSRF-TOKEN" in cfg.headers)) {
            cfg.headers["X-XSRF-TOKEN"] = xsrf
          }
        }
      }
    }
  } catch {
    // ignore
  }
  return cfg
})

// Normalize Laravel response: if {data: ...} exists, unwrap it
client.interceptors.response.use(
  (res) => {
    const payload = res.data
    return {
      ...res,
      data: payload?.data !== undefined ? payload.data : payload,
    }
  },
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Request failed"
    const e = new Error(message) as Error & { status?: number; data?: unknown }
    e.status = error?.response?.status
    e.data = error?.response?.data
    return Promise.reject(e)
  },
)

/**
 * Fetch the Sanctum CSRF cookie to enable session-based auth.
 */
export async function fetchCsrfCookie(): Promise<void> {
  await client.get("/sanctum/csrf-cookie", { withCredentials: true })
}

export async function http<T = unknown>(path: string, options: HttpOptions = {}): Promise<T> {
  const cfg: AxiosRequestConfig = {
    url: buildUrl(path, options.absolute),
    method: (options.method || "GET") as Method,
    headers: options.headers,
    data: options.body,
    signal: options.signal,
    withCredentials: options.withCredentials ?? false,
  }
  const res = await client.request<T>(cfg)
  return res.data as T
}

// Convenience helpers
export const httpGet = <T = unknown>(path: string, options?: Omit<HttpOptions, "method" | "body">) =>
  http<T>(path, { ...options, method: "GET" })

export const httpPost = <T = unknown>(path: string, body?: unknown, options?: Omit<HttpOptions, "method">) =>
  http<T>(path, { ...options, method: "POST", body })

export const httpPut = <T = unknown>(path: string, body?: unknown, options?: Omit<HttpOptions, "method">) =>
  http<T>(path, { ...options, method: "PUT", body })

export const httpPatch = <T = unknown>(path: string, body?: unknown, options?: Omit<HttpOptions, "method">) =>
  http<T>(path, { ...options, method: "PATCH", body })

export const httpDelete = <T = unknown>(path: string, options?: Omit<HttpOptions, "method" | "body">) =>
  http<T>(path, { ...options, method: "DELETE" })
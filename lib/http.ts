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

const DEBUG = process.env.NODE_ENV !== "production"

function logDebug(...args: unknown[]) {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.debug("[HTTP]", ...args)
  }
}

function buildUrl(path: string, absolute?: boolean) {
  if (absolute) return path
  const base = config.apiBaseUrl.replace(/\/*$/, "")
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
  withCredentials: true, // enable cookies by default
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor with diagnostics
client.interceptors.request.use((cfg) => {
  try {
    const xsrfCookie = readCookie("XSRF-TOKEN")
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth-token")
      if (token && !cfg.withCredentials) {
        cfg.headers = cfg.headers ?? {}
        cfg.headers["Authorization"] = `Bearer ${token}`
      }
    }
    // Ensure xsrf header when using cookies
    if (cfg.withCredentials) {
      const xsrf = xsrfCookie
      if (xsrf) {
        cfg.headers = cfg.headers ?? {}
        if (!("X-XSRF-TOKEN" in cfg.headers)) {
          cfg.headers["X-XSRF-TOKEN"] = xsrf
        }
      }
    }

    logDebug("REQUEST", {
      method: cfg.method,
      url: cfg.baseURL ? `${cfg.baseURL}${cfg.url}` : cfg.url,
      withCredentials: cfg.withCredentials,
      hasXsrfCookie: Boolean(xsrfCookie),
      hasXsrfHeader: Boolean(cfg.headers && (cfg.headers as any)["X-XSRF-TOKEN"]),
    })
  } catch (e) {
    logDebug("REQUEST-INTERCEPTOR-ERROR", e)
  }
  return cfg
})

// Normalize Laravel response and add diagnostics
client.interceptors.response.use(
  (res) => {
    const payload = res.data
    const normalized = payload?.data !== undefined ? payload.data : payload
    logDebug("RESPONSE", {
      url: res.config?.url,
      status: res.status,
      ok: true,
    })
    return {
      ...res,
      data: normalized,
    }
  },
  async (error) => {
    const status = error?.response?.status
    const originalConfig = error?.config as AxiosRequestConfig & { _csrfRetry?: boolean }
    logDebug("ERROR", {
      url: originalConfig?.url,
      status,
      data: error?.response?.data,
      withCredentials: originalConfig?.withCredentials,
      hasXsrfCookie: typeof document !== "undefined" ? Boolean(readCookie("XSRF-TOKEN")) : undefined,
      hasXsrfHeader: Boolean(originalConfig?.headers && (originalConfig.headers as any)["X-XSRF-TOKEN"]),
    })

    // Retry once on 401 for withCredentials requests after refreshing CSRF cookie
    if (
      status === 401 &&
      originalConfig &&
      originalConfig.withCredentials &&
      !originalConfig._csrfRetry
    ) {
      try {
        originalConfig._csrfRetry = true
        logDebug("401-RETRY", { step: "fetch-csrf-cookie" })
        await client.get("/sanctum/csrf-cookie", { withCredentials: true })
        const xsrf = readCookie("XSRF-TOKEN")
        if (xsrf) {
          originalConfig.headers = originalConfig.headers ?? {}
          ;(originalConfig.headers as any)["X-XSRF-TOKEN"] = xsrf
        }
        logDebug("401-RETRY", {
          step: "retry-request",
          url: originalConfig.url,
          hasXsrfCookie: Boolean(xsrf),
        })
        const retryRes = await client.request(originalConfig)
        const payload = retryRes.data
        return Promise.resolve({
          ...retryRes,
          data: payload?.data !== undefined ? payload.data : payload,
        })
      } catch (retryErr) {
        logDebug("401-RETRY-FAILED", retryErr)
        // fall through to error normalization
      }
    }

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
  logDebug("FETCH-CSRF-COOKIE", { url: "/sanctum/csrf-cookie" })
  await client.get("/sanctum/csrf-cookie", { withCredentials: true })
  logDebug("FETCH-CSRF-COOKIE-DONE", { hasXsrfCookie: Boolean(readCookie("XSRF-TOKEN")) })
}

export async function http<T = unknown>(path: string, options: HttpOptions = {}): Promise<T> {
  const cfg: AxiosRequestConfig = {
    url: buildUrl(path, options.absolute),
    method: (options.method || "GET") as Method,
    headers: options.headers,
    data: options.body,
    signal: options.signal,
    withCredentials: options.withCredentials ?? true, // default to true
  }
  logDebug("HTTP-CALL", {
    method: cfg.method,
    url: cfg.url,
    withCredentials: cfg.withCredentials,
  })
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
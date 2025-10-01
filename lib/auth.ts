// Authentication utilities for the Magal de Touba application
// Cookie (Sanctum SPA) based flow: we fetch CSRF cookie, then perform auth with credentials included.

import { fetchCsrfCookie, httpGet, httpPost } from "@/lib/http"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "pilgrim" | "admin" | "volunteer"
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

function readXsrfFromCookie(): string | null {
  if (typeof document === "undefined") return null
  const name = "XSRF-TOKEN="
  const found = document.cookie.split("; ").find((c) => c.startsWith(name))
  if (!found) return null
  try {
    return decodeURIComponent(found.split("=")[1] || "")
  } catch {
    return found.split("=")[1] || ""
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User }> {
    // Ensure CSRF cookie for Sanctum SPA
    await fetchCsrfCookie()
    const xsrf = readXsrfFromCookie()
    // Normalize payload (trim)
    const payload = {
      email: credentials.email.trim(),
      password: credentials.password,
    }
    // Send explicit XSRF header to avoid timing or header injection issues
    await httpPost("/api/auth/login", payload, {
      withCredentials: true,
      headers: xsrf
        ? {
            "X-Requested-With": "XMLHttpRequest",
            "X-XSRF-TOKEN": xsrf,
            Accept: "application/json",
          }
        : {
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json",
          },
    })
    // Then fetch the user
    const user = await httpGet<User>("/api/auth/me", { withCredentials: true })
    return { user }
  },

  async register(data: RegisterData): Promise<{ user: User }> {
    if (data.password !== data.confirmPassword) {
      throw new Error("Les mots de passe ne correspondent pas")
    }
    await fetchCsrfCookie()
    const xsrf = readXsrfFromCookie()
    const payload = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      password: data.password,
    }
    await httpPost("/api/auth/register", payload, {
      withCredentials: true,
      headers: xsrf
        ? {
            "X-Requested-With": "XMLHttpRequest",
            "X-XSRF-TOKEN": xsrf,
            Accept: "application/json",
          }
        : {
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json",
          },
    })
    const user = await httpGet<User>("/api/auth/me", { withCredentials: true })
    return { user }
  },

  async logout(): Promise<void> {
    try {
      await fetchCsrfCookie()
      const xsrf = readXsrfFromCookie()
      await httpPost(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
          headers: xsrf
            ? {
                "X-Requested-With": "XMLHttpRequest",
                "X-XSRF-TOKEN": xsrf,
                Accept: "application/json",
              }
            : {
                "X-Requested-With": "XMLHttpRequest",
                Accept: "application/json",
              },
        },
      )
    } catch {
      // ignore logout errors
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await httpGet<User>("/api/auth/me", { withCredentials: true })
      return user
    } catch {
      return null
    }
  },
}

// Deprecated token storage, kept as no-op to avoid breaking imports.
export const tokenStorage = {
  set: (_token: string) => {},
  get: () => null,
  remove: () => {},
},
  get: () => null,
  remove: () => {},
}

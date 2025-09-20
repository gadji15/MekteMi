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

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User }> {
    // Ensure CSRF cookie for Sanctum SPA
    await fetchCsrfCookie()
    await httpPost("/api/auth/login", credentials, { withCredentials: true })
    // Then fetch the user
    const user = await httpGet<User>("/api/auth/me", { withCredentials: true })
    return { user }
  },

  async register(data: RegisterData): Promise<{ user: User }> {
    if (data.password !== data.confirmPassword) {
      throw new Error("Les mots de passe ne correspondent pas")
    }
    await fetchCsrfCookie()
    await httpPost("/api/auth/register", data, { withCredentials: true })
    const user = await httpGet<User>("/api/auth/me", { withCredentials: true })
    return { user }
  },

  async logout(): Promise<void> {
    try {
      await fetchCsrfCookie()
      await httpPost("/api/auth/logout", {}, { withCredentials: true })
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
}

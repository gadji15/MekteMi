// Authentication utilities for the Magal de Touba application
// Integrated with Laravel API endpoints via lib/http

import { httpGet, httpPost } from "@/lib/http"

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

type LoginResponse =
  | { user: User; token: string }
  | { data: { user: User; token: string } }
  | { access_token: string; user: User }

function normalizeLoginResponse(payload: LoginResponse): { user: User; token: string } {
  if ("data" in payload && payload.data) return payload.data
  if ("access_token" in payload) return { token: payload.access_token, user: (payload as any).user }
  return payload as { user: User; token: string }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const payload = await httpPost<LoginResponse>("/api/auth/login", credentials)
    const { user, token } = normalizeLoginResponse(payload)
    return { user, token }
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    if (data.password !== data.confirmPassword) {
      throw new Error("Les mots de passe ne correspondent pas")
    }
    const payload = await httpPost<LoginResponse>("/api/auth/register", data)
    const { user, token } = normalizeLoginResponse(payload)
    return { user, token }
  },

  async logout(): Promise<void> {
    try {
      await httpPost("/api/auth/logout", {})
    } catch {
      // ignore logout errors
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await httpGet<User>("/api/auth/me")
      return user
    } catch {
      return null
    }
  },
}

// Local storage utilities (used by the app and http client via localStorage)
export const tokenStorage = {
  set: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth-token", token)
    }
  },
  get: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth-token")
    }
    return null
  },
  remove: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token")
    }
  },
}

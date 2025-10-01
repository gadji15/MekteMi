"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/lib/auth"
import { authService } from "@/lib/auth"
import { config } from "@/lib/config"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
  }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function hasXsrfCookie(): boolean {
  if (typeof document === "undefined") return false
  return document.cookie.split("; ").some((c) => c.startsWith("XSRF-TOKEN="))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.debug("[AUTH] init -> getCurrentUser", {
          apiBase: config.apiBaseUrl,
          hasXsrfCookie: hasXsrfCookie(),
        })
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
        console.debug("[AUTH] current user", currentUser)
      } catch (error) {
        console.debug("[AUTH] getCurrentUser failed", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.debug("[AUTH] login", { email, apiBase: config.apiBaseUrl, hasXsrfCookie: hasXsrfCookie() })
      const res = await authService.login({ email, password })
      setUser(res.user)
      console.debug("[AUTH] login success", res.user)
    } catch (e) {
      console.debug("[AUTH] login failed", e)
      throw e
    }
  }

  const register = async (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
  }) => {
    try {
      console.debug("[AUTH] register", { email: data.email, apiBase: config.apiBaseUrl, hasXsrfCookie: hasXsrfCookie() })
      const res = await authService.register(data)
      setUser(res.user)
      console.debug("[AUTH] register success", res.user)
    } catch (e) {
      console.debug("[AUTH] register failed", e)
      throw e
    }
  }

  const logout = async () => {
    try {
      console.debug("[AUTH] logout")
      await authService.logout()
    } finally {
      setUser(null)
      console.debug("[AUTH] logout done -> user cleared")
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
  return context
}

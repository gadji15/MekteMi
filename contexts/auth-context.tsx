"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/lib/auth"
import { authService, tokenStorage } from "@/lib/auth"

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

function setAuthCookie(token: string) {
  // Set a non-HttpOnly cookie so Next middleware can read it.
  // This is a temporary measure until a real backend issues HttpOnly cookies.
  const maxAgeDays = 7
  const expires = new Date(Date.now() + maxAgeDays * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `auth-token=${encodeURIComponent(token)}; Path=/; Expires=${expires}; SameSite=Lax`
}

function clearAuthCookie() {
  document.cookie = `auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Failed to get current user:", error)
        tokenStorage.remove()
        clearAuthCookie()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { user, token } = await authService.login({ email, password })
      tokenStorage.set(token)
      setAuthCookie(token)
      setUser(user)
    } catch (error) {
      throw error
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
      const { user, token } = await authService.register(data)
      tokenStorage.set(token)
      setAuthCookie(token)
      setUser(user)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      tokenStorage.remove()
      clearAuthCookie()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      // Still remove token and user even if API call fails
      tokenStorage.remove()
      clearAuthCookie()
      setUser(null)
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
}) => {
    try {
      const { user, token } = await authService.register(data)
      tokenStorage.set(token)
      setCookie("mb_auth", "1")
      setCookie("mb_role", user.role)
      setUser(user)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      tokenStorage.remove()
      clearCookie("mb_auth")
      clearCookie("mb_role")
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      // Still remove token and user even if API call fails
      tokenStorage.remove()
      clearCookie("mb_auth")
      clearCookie("mb_role")
      setUser(null)
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

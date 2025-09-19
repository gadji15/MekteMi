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
      setUser(user)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      tokenStorage.remove()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      // Still remove token and user even if API call fails
      tokenStorage.remove()
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

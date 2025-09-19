// Authentication utilities for the Magal de Touba application
// This will integrate with Laravel API endpoints

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

// Mock authentication functions - replace with actual Laravel API calls
export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // TODO: Replace with actual Laravel API call
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials)
    // })

    // Mock response for development
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

    if (credentials.email === "admin@magal.sn" && credentials.password === "password") {
      const user: User = {
        id: "1",
        email: credentials.email,
        firstName: "Admin",
        lastName: "Magal",
        role: "admin",
        createdAt: new Date().toISOString(),
      }
      return { user, token: "mock-jwt-token" }
    }

    throw new Error("Identifiants incorrects")
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    // TODO: Replace with actual Laravel API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (data.password !== data.confirmPassword) {
      throw new Error("Les mots de passe ne correspondent pas")
    }

    const user: User = {
      id: Date.now().toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: "pilgrim",
      createdAt: new Date().toISOString(),
    }

    return { user, token: "mock-jwt-token" }
  },

  async logout(): Promise<void> {
    // TODO: Replace with actual Laravel API call
    await new Promise((resolve) => setTimeout(resolve, 500))
  },

  async getCurrentUser(): Promise<User | null> {
    // TODO: Replace with actual Laravel API call
    const token = tokenStorage.get()
    if (!token) return null

    // Mock user data
    return {
      id: "1",
      email: "admin@magal.sn",
      firstName: "Admin",
      lastName: "Magal",
      role: "admin",
      createdAt: new Date().toISOString(),
    }
  },
}

// Local storage utilities
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

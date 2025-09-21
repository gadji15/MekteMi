// Types for the Magal de Touba application

export interface Pilgrim {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  country: string
  registrationDate: Date
  status: "pending" | "confirmed" | "cancelled"
}

export interface Schedule {
  id: string
  title: string
  description?: string
  startTime: Date | string
  endTime?: Date | string
  location?: string
  type?: "prayer" | "event" | "ceremony"
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "urgent"
  createdAt: Date | string
  isRead?: boolean
}

export interface PointOfInterest {
  id: string
  name: string
  description?: string
  address?: string
  latitude?: number
  longitude?: number
  category: "mosque" | "accommodation" | "food" | "transport" | "medical" | "other"
  isOpen?: boolean
  openingHours?: string
  phone?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "pilgrim" | "admin" | "volunteer"
  createdAt: Date | string
}

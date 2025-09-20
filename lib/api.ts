// API utilities for Laravel backend integration

import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from "@/lib/http"

export interface PilgrimRegistration {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  country: string
  accommodationType: string
  specialNeeds: string
  status: "pending" | "confirmed" | "cancelled"
  registrationDate: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export const apiService = {
  // Pilgrim registration endpoints (Laravel)
  async registerPilgrim(
    data: Omit<PilgrimRegistration, "id" | "status" | "registrationDate">,
  ): Promise<ApiResponse<PilgrimRegistration>> {
    const created = await httpPost<PilgrimRegistration>("/api/pilgrims", data)
    return {
      data: created,
      message: "Inscription enregistrée avec succès",
      success: true,
    }
  },

  async getPilgrimRegistrations(): Promise<ApiResponse<PilgrimRegistration[]>> {
    const items = await httpGet<PilgrimRegistration[]>("/api/pilgrims", { withCredentials: true })
    return {
      data: items,
      message: "Inscriptions récupérées avec succès",
      success: true,
    }
  },

  async updatePilgrimStatus(
    id: string,
    status: PilgrimRegistration["status"],
  ): Promise<ApiResponse<PilgrimRegistration>> {
    const updated = await httpPatch<PilgrimRegistration>(`/api/pilgrims/${id}`, { status }, { withCredentials: true })
    return {
      data: updated,
      message: `Statut mis à jour: ${status}`,
      success: true,
    }
  },

  async deletePilgrim(id: string): Promise<ApiResponse<null>> {
    await httpDelete<unknown>(`/api/pilgrims/${id}`, { withCredentials: true })
    return { data: null, success: true, message: "Pèlerin supprimé" }
  },

  // Schedules
  async getSchedules(): Promise<ApiResponse<any[]>> {
    const schedules = await httpGet<any[]>("/api/schedules")
    return { data: schedules, success: true, message: "Horaires récupérés" }
  },

  // Notifications
  async getNotifications(): Promise<ApiResponse<any[]>> {
    const items = await httpGet<any[]>("/api/notifications")
    return { data: items, success: true, message: "Notifications récupérées" }
  },

  async sendNotification(data: { title: string; message: string; type: string }): Promise<ApiResponse<any>> {
    const created = await httpPost<any>("/api/notifications", data, { withCredentials: true })
    return { data: created, success: true, message: "Notification envoyée" }
  },

  async updateNotification(id: string, data: Partial<{ title: string; message: string; type: string }>) {
    const updated = await httpPut<any>(`/api/notifications/${id}`, data, { withCredentials: true })
    return { data: updated, success: true, message: "Notification mise à jour" }
  },

  async deleteNotification(id: string) {
    await httpDelete(`/api/notifications/${id}`, { withCredentials: true })
    return { data: null, success: true, message: "Notification supprimée" }
  },

  // Points of Interest
  async getPointsOfInterest(): Promise<ApiResponse<any[]>> {
    const items = await httpGet<any[]>("/api/points-of-interest")
    return { data: items, success: true, message: "Points d'intérêt récupérés" }
  },
  async createPointOfInterest(data: {
    name: string
    description?: string
    address?: string
    latitude?: number
    longitude?: number
    category: string
    isOpen?: boolean
    openingHours?: string
    phone?: string
  }) {
    const created = await httpPost<any>("/api/points-of-interest", data, { withCredentials: true })
    return { data: created, success: true, message: "Point d'intérêt créé" }
  },
  async updatePointOfInterest(
    id: string,
    data: Partial<{
      name: string
      description: string
      address: string
      latitude: number
      longitude: number
      category: string
      isOpen: boolean
      openingHours: string
      phone: string
    }>,
  ) {
    const updated = await httpPut<any>(`/api/points-of-interest/${id}`, data, { withCredentials: true })
    return { data: updated, success: true, message: "Point d'intérêt mis à jour" }
  },
  async deletePointOfInterest(id: string) {
    await httpDelete(`/api/points-of-interest/${id}`, { withCredentials: true })
    return { data: null, success: true, message: "Point d'intérêt supprimé" }
  },
}

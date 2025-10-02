// API utilities for Laravel backend integration

import { fetchCsrfCookie, httpDelete, httpGet, httpPatch, httpPost, httpPut } from "@/lib/http"
import type { Notification, Schedule, PointOfInterest, User } from "@/lib/types"

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

export interface AdminMetrics {
  pilgrims: { total: number; confirmed: number; pending: number; cancelled: number }
  events: { total: number; active: number }
  notifications: { total: number }
  users: { total: number; active: number; inactive: number; suspended: number }
  generatedAt: string
}

export const apiService = {
  // Admin Metrics
  async getAdminMetrics(): Promise<ApiResponse<AdminMetrics>> {
    await fetchCsrfCookie()
    const data = await httpGet<AdminMetrics>("/api/admin/metrics", { withCredentials: true })
    return { data, success: true, message: "Métriques récupérées" }
  },

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
    await fetchCsrfCookie()
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
    await fetchCsrfCookie()
    const updated = await httpPatch<PilgrimRegistration>(`/api/pilgrims/${id}`, { status }, { withCredentials: true })
    return {
      data: updated,
      message: `Statut mis à jour: ${status}`,
      success: true,
    }
  },

  async deletePilgrim(id: string): Promise<ApiResponse<null>> {
    await fetchCsrfCookie()
    await httpDelete<unknown>(`/api/pilgrims/${id}`, { withCredentials: true })
    return { data: null, success: true, message: "Pèlerin supprimé" }
  },

  // Users (admin)
  async getUsers(): Promise<ApiResponse<User[]>> {
    await fetchCsrfCookie()
    const items = await httpGet<User[]>("/api/users", { withCredentials: true })
    return { data: items, success: true, message: "Utilisateurs récupérés" }
  },
  async updateUser(id: string, data: Partial<Pick<User, "role">> & { status?: "active" | "inactive" | "suspended"; name?: string }) {
    await fetchCsrfCookie()
    const updated = await httpPatch<User>(`/api/users/${id}`, data, { withCredentials: true })
    return { data: updated, success: true, message: "Utilisateur mis à jour" }
  },
  async deleteUser(id: string) {
    await fetchCsrfCookie()
    await httpDelete(`/api/users/${id}`, { withCredentials: true })
    return { data: null, success: true, message: "Utilisateur supprimé" }
  },

  // Schedules
  async getSchedules(): Promise<ApiResponse<Schedule[]>> {
    const schedules = await httpGet<Schedule[]>("/api/schedules")
    return { data: schedules, success: true, message: "Horaires récupérés" }
  },
  async createSchedule(data: {
    title: string
    description?: string
    date?: string
    startTime?: string | Date
    endTime?: string | Date
    location?: string
    type?: Schedule["type"]
  }) {
    // Map camelCase to API snake_case keys
    const payload: Record<string, unknown> = {
      title: data.title,
    }
    if (data.description !== undefined) payload.description = data.description
    if (data.date !== undefined) payload.date = data.date
    if (data.startTime !== undefined) payload.start_time = data.startTime
    if (data.endTime !== undefined) payload.end_time = data.endTime
    if (data.location !== undefined) payload.location = data.location
    if (data.type !== undefined) payload.type = data.type
    await fetchCsrfCookie()
    const created = await httpPost<Schedule>("/api/schedules", payload, { withCredentials: true })
    return { data: created, success: true, message: "Horaire créé" }
  },
  async updateSchedule(id: string, data: Partial<Pick<Schedule, "title" | "description" | "startTime" | "endTime" | "location" | "type">> & { date?: string }) {
    const payload: Record<string, unknown> = {}
    if (data.title !== undefined) payload.title = data.title
    if (data.description !== undefined) payload.description = data.description
    if (data.date !== undefined) payload.date = data.date
    if (data.startTime !== undefined) payload.start_time = data.startTime
    if (data.endTime !== undefined) payload.end_time = data.endTime
    if (data.location !== undefined) payload.location = data.location
    if (data.type !== undefined) payload.type = data.type
    await fetchCsrfCookie()
    const updated = await httpPut<Schedule>(`/api/schedules/${id}`, payload, { withCredentials: true })
    return { data: updated, success: true, message: "Horaire mis à jour" }
  },
  async deleteSchedule(id: string) {
    await fetchCsrfCookie()
    await httpDelete(`/api/schedules/${id}`, { withCredentials: true })
    return { data: null, success: true, message: "Horaire supprimé" }
  },

  // Notifications
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    const items = await httpGet<Notification[]>("/api/notifications")
    return { data: items, success: true, message: "Notifications récupérées" }
  },

  async sendNotification(data: Pick<Notification, "title" | "message" | "type">): Promise<ApiResponse<Notification>> {
    await fetchCsrfCookie()
    const created = await httpPost<Notification>("/api/notifications", data, { withCredentials: true })
    return { data: created, success: true, message: "Notification envoyée" }
  },

  async updateNotification(id: string, data: Partial<Notification>) {
    await fetchCsrfCookie()
    const updated = await httpPut<Notification>(`/api/notifications/${id}`, data, { withCredentials: true })
    return { data: updated, success: true, message: "Notification mise à jour" }
  },

  async deleteNotification(id: string) {
    await fetchCsrfCookie()
    await httpDelete(`/api/notifications/${id}`, { withCredentials: true })
    return { data: null, success: true, message: "Notification supprimée" }
  },

  // Points of Interest
  async getPointsOfInterest(): Promise<ApiResponse<PointOfInterest[]>> {
    const items = await httpGet<PointOfInterest[]>("/api/points-of-interest")
    return { data: items, success: true, message: "Points d'intérêt récupérés" }
  },
  async createPointOfInterest(data: Omit<PointOfInterest, "id">) {
    await fetchCsrfCookie()
    const created = await httpPost<PointOfInterest>("/api/points-of-interest", data, { withCredentials: true })
    return { data: created, success: true, message: "Point d'intérêt créé" }
  },
  async updatePointOfInterest(id: string, data: Partial<PointOfInterest>) {
    await fetchCsrfCookie()
    const updated = await httpPut<PointOfInterest>(`/api/points-of-interest/${id}`, data, { withCredentials: true })
    return { data: updated, success: true, message: "Point d'intérêt mis à jour" }
  },
  async deletePointOfInterest(id: string) {
    await fetchCsrfCookie()
    await httpDelete(`/api/points-of-interest/${id}`, { withCredentials: true })
    return { data: null, success: true, message: "Point d'intérêt supprimé" }
  }
}
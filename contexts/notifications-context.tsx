"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { apiService } from "@/lib/api"

export type NotificationType = "info" | "warning" | "urgent"

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: NotificationType
  createdAt: string
  isRead?: boolean
}

interface NotificationsContextValue {
  notifications: NotificationItem[]
  isLoading: boolean
  error: string | null
  unreadCount: number
  refresh: () => Promise<void>
  markAllAsRead: () => void
  create: (data: { title: string; message: string; type: NotificationType }) => Promise<void>
  update: (id: string, data: Partial<{ title: string; message: string; type: NotificationType }>) => Promise<void>
  remove: (id: string) => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined)

function normalize(n: any): NotificationItem {
  return {
    id: String(n.id),
    title: n.title,
    message: n.message,
    type: (n.type as NotificationType) || "info",
    createdAt: new Date(n.createdAt ?? n.created_at ?? Date.now()).toISOString(),
    isRead: Boolean(n.isRead ?? n.is_read ?? false),
  }
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await apiService.getNotifications()
      const items = (res.data || []).map(normalize)
      setNotifications(items)
    } catch (e: any) {
      setError(e?.message || "Erreur lors du chargement des notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const markAllAsRead = () => {
    setNotifications((prev: NotificationItem[]) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const create = async (data: { title: string; message: string; type: NotificationType }) => {
    await apiService.sendNotification(data)
    await refresh()
  }

  const update = async (
    id: string,
    data: Partial<{ title: string; message: string; type: NotificationType }>,
  ) => {
    await apiService.updateNotification(id, data)
    await refresh()
  }

  const remove = async (id: string) => {
    await apiService.deleteNotification(id)
    await refresh()
  }

  useEffect(() => {
    // initial load (public notifications)
    refresh().catch(() => {})
  }, [])

  const unreadCount = useMemo(() => notifications.filter((n: NotificationItem) => !n.isRead).length, [notifications])

  const value = useMemo<NotificationsContextValue>(
    () => ({ notifications, isLoading, error, unreadCount, refresh, markAllAsRead, create, update, remove }),
    [notifications, isLoading, error, unreadCount],
  )

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
    return ctx
  }

"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { apiService } from "@/lib/api"
import { toast } from "sonner"

export type NotificationItem = {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "urgent" | string
  createdAt?: string | Date
  created_at?: string
  isRead?: boolean
}

interface NotificationsContextType {
  notifications: NotificationItem[]
  isLoading: boolean
  error: string | null
  unreadCount: number
  markAllAsRead: () => void
  refresh: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

const POLL_INTERVAL_MS = 30000 // 30s
const MAX_BACKOFF_MS = 5 * 60 * 1000 // 5 minutes

function getStorageKey() {
  return "mbektemi.notifications.seen"
}

function loadSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(getStorageKey())
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(arr)
  } catch {
    return new Set()
  }
}

function saveSeenIds(ids: Set<string>) {
  try {
    const arr = Array.from(ids)
    localStorage.setItem(getStorageKey(), JSON.stringify(arr))
  } catch {
    // ignore
  }
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  const seenIdsRef = useRef<Set<string>>(new Set())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const backoffRef = useRef<number>(POLL_INTERVAL_MS)

  const updateUnreadCount = (items: NotificationItem[]) => {
    const count = items.filter((n) => !n.isRead).length
    setUnreadCount(count)
  }

  const mergeWithSeen = (items: NotificationItem[]): NotificationItem[] => {
    const seen = seenIdsRef.current
    return items.map((n) => ({
      ...n,
      isRead: seen.has(n.id) ? true : n.isRead ?? false,
    }))
  }

  const notifyNewItems = (items: NotificationItem[]) => {
    // Show toast for items that are not seen (new arrivals)
    const seen = seenIdsRef.current
    for (const n of items) {
      if (!seen.has(n.id)) {
        // flag as seen for next round so we don't spam
        seen.add(n.id)
        toast(n.title || "Nouvelle notification", {
          description: n.message,
          duration: 5000,
        })
      }
    }
    saveSeenIds(seen)
  }

  const refresh = async () => {
    try {
      const res = await apiService.getNotifications()
      const incoming = Array.isArray(res.data) ? res.data : []
      const items = mergeWithSeen(incoming)
      setNotifications(items)
      updateUnreadCount(items)
      setError(null)
      // on first load, we do not toast past items; only toast when not first load
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de charger les notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const poll = async (firstRun = false) => {
    try {
      const res = await apiService.getNotifications()
      const incoming = Array.isArray(res.data) ? res.data : []
      const items = mergeWithSeen(incoming)
      setNotifications(items)
      updateUnreadCount(items)
      setError(null)

      if (!firstRun) {
        // Emit toasts for truly new items (not previously seen)
        const seenBefore = loadSeenIds()
        const newOnes = incoming.filter((n) => !seenBefore.has(n.id))
        if (newOnes.length > 0) {
          notifyNewItems(newOnes)
        }
      }

      // reset backoff on success
      backoffRef.current = POLL_INTERVAL_MS
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la mise à jour des notifications")
      // exponential backoff but cap to MAX_BACKOFF_MS
      backoffRef.current = Math.min(backoffRef.current * 2, MAX_BACKOFF_MS)
    } finally {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => poll(false), backoffRef.current)
    }
  }

  useEffect(() => {
    seenIdsRef.current = loadSeenIds()
    setIsLoading(true)
    // initial load (no toast)
    poll(true)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const markAllAsRead = () => {
    const ids = new Set(seenIdsRef.current)
    notifications.forEach((n) => ids.add(n.id))
    seenIdsRef.current = ids
    saveSeenIds(ids)
    const updated = notifications.map((n) => ({ ...n, isRead: true }))
    setNotifications(updated)
    updateUnreadCount(updated)
  }

  const value = useMemo<NotificationsContextType>(
    () => ({
      notifications,
      isLoading,
      error,
      unreadCount,
      markAllAsRead,
      refresh,
    }),
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
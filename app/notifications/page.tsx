"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, Info, Clock, Sparkles } from "lucide-react"
import { apiService } from "@/lib/api"

type NotificationItem = {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "urgent" | string
  created_at?: string
  createdAt?: string | Date
  isRead?: boolean
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "urgent":
      return <AlertTriangle className="w-6 h-6 text-destructive" />
    case "warning":
      return <Bell className="w-6 h-6 text-orange-500" />
    case "info":
    default:
      return <Info className="w-6 h-6 text-primary" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "urgent":
      return "bg-gradient-to-r from-destructive/20 to-red-200/20 text-destructive border-destructive/30"
    case "warning":
      return "bg-gradient-to-r from-orange-100/50 to-yellow-100/50 text-orange-700 border-orange-200/50"
    case "info":
    default:
      return "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30"
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case "urgent":
      return "Urgent"
    case "warning":
      return "Important"
    case "info":
    default:
      return "Information"
  }
}

const formatDate = (value?: string | Date) => {
  if (!value) return ""
  const date = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await apiService.getNotifications()
        if (!mounted) return
        setItems(res.data || [])
      } catch (e) {
        if (!mounted) return
        setError(e instanceof Error ? e.message : "Impossible de charger les notifications")
      } finally {
        if (mounted) setIsLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const unreadCount = items.filter((n) => !n.isRead).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary">PWA disponible</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Notifications</h1>
          <p className="text-muted-foreground text-xl leading-relaxed text-pretty max-w-3xl mx-auto">
            Restez informé des dernières actualités et annonces importantes du Magal de Touba.
          </p>
          {unreadCount > 0 && (
            <div className="mt-6">
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 text-base">
                <Sparkles className="w-4 h-4 mr-2" />
                {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""} notification{unreadCount > 1 ? "s" : ""}
              </Badge>
            </div>
          )}
        </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-0 bg-gradient-to-r from-card to-muted/30">
                <CardContent className="p-6">
                  <div className="animate-pulse flex gap-4">
                    <div className="w-12 h-12 bg-muted rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-1/3 bg-muted rounded" />
                      <div className="h-4 w-2/3 bg-muted rounded" />
                      <div className="h-4 w-1/2 bg-muted rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border-0 bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-6">
              <p className="text-destructive font-medium">{error}</p>
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card className="text-center py-16 bg-gradient-to-br from-card to-muted/30 border-0">
            <CardContent>
              <div className="animate-float mb-6">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto" />
              </div>
              <CardTitle className="text-2xl mb-4">Aucune notification</CardTitle>
              <CardDescription className="text-lg">
                Vous n'avez aucune notification pour le moment. Revenez plus tard pour les dernières actualités.
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {items.map((notification, index) => (
              <Card
                key={notification.id}
                className={`group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-0 bg-gradient-to-r from-card to-muted/30 ${
                  !notification.isRead ? "ring-2 ring-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1 w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-xl leading-tight">{notification.title}</CardTitle>
                        <div className="flex flex-col items-end gap-3 flex-shrink-0">
                          <Badge className={getNotificationColor(notification.type)}>
                            {getTypeLabel(notification.type)}
                          </Badge>
                          {!notification.isRead && (
                            <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-6 text-base">{notification.message}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-lg">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium">
                      {formatDate(notification.createdAt ?? notification.created_at)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

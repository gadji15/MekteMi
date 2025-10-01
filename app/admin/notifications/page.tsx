"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Send, Plus, Clock, Edit, Trash2, MoreHorizontal, X, AlertCircle, Bug } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiService } from "@/lib/api"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { z } from "zod"
import { config } from "@/lib/config"

type NotifType = "info" | "warning" | "urgent"

interface UiNotification {
  id: string
  title: string
  message: string
  type: NotifType
  createdAt: string
}

const formSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  message: z.string().min(5, "Le message doit contenir au moins 5 caractères").max(500, "500 caractères maximum"),
  type: z.enum(["info", "warning", "urgent"]),
})

function hasXsrfCookie(): boolean {
  if (typeof document === "undefined") return false
  return document.cookie.split("; ").some((c) => c.startsWith("XSRF-TOKEN="))
}

export default function AdminNotificationsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [items, setItems] = useState<UiNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState<UiNotification | null>(null)
  const [form, setForm] = useState<{ title: string; message: string; type: NotifType }>({
    title: "",
    message: "",
    type: "info",
  })

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      // Diagnostic log clair si on est redirigé faute d'admin
      console.debug("[ADMIN] Access denied or session missing. Redirecting to /auth/login", {
        hasUser: Boolean(user),
        role: user?.role,
      })
      toast.error("Session non valide ou droits insuffisants. Veuillez vous reconnecter.")
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const res = await apiService.getNotifications()
      const normalized =
        (res.data || []).map((n: any) => ({
          id: String(n.id),
          title: n.title,
          message: n.message,
          type: (n.type as NotifType) || "info",
          createdAt: new Date(n.createdAt ?? n.created_at ?? Date.now()).toISOString(),
        })) ?? []
      setItems(normalized)
    } catch (e: any) {
      if (e?.status === 401) {
        console.debug("[ADMIN] 401 on getNotifications(). Likely not authenticated.", {
          apiBase: config.apiBaseUrl,
          hasXsrfCookie: hasXsrfCookie(),
        })
        toast.error("Session expirée. Veuillez vous reconnecter.")
        router.push("/auth/login")
        return
      }
      console.debug("[ADMIN] Error loading notifications", e)
      setError(e instanceof Error ? e.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAll()
    }
  }, [user])

  const stats = useMemo(
    () => ({
      total: items.length,
      info: items.filter((n) => n.type === "info").length,
      warning: items.filter((n) => n.type === "warning").length,
      urgent: items.filter((n) => n.type === "urgent").length,
    }),
    [items],
  )

  const startCreate = () => {
    setEditing(null)
    setForm({ title: "", message: "", type: "info" })
    setShowForm(true)
  }

  const startEdit = (n: UiNotification) => {
    setEditing(n)
    setForm({ title: n.title, message: n.message, type: n.type })
    setShowForm(true)
  }

  const handleSubmit = async () => {
    const parsed = formSchema.safeParse(form)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || "Veuillez vérifier le formulaire"
      setError(firstError)
      return
    }
    try {
      setSubmitting(true)
      setError("")
      if (editing) {
        await apiService.updateNotification(editing.id, {
          title: form.title.trim(),
          message: form.message.trim(),
          type: form.type,
        })
        toast.success("Notification mise à jour")
      } else {
        await apiService.sendNotification({
          title: form.title.trim(),
          message: form.message.trim(),
          type: form.type,
        })
        toast.success("Notification créée")
      }
      setShowForm(false)
      setEditing(null)
      await fetchAll()
    } catch (e: any) {
      if (e?.status === 401) {
        console.debug("[ADMIN] 401 on save/update notification", {
          apiBase: config.apiBaseUrl,
          hasXsrfCookie: hasXsrfCookie(),
          payload: { title: form.title, message: form.message, type: form.type },
        })
        toast.error("Session expirée. Veuillez vous reconnecter.")
        router.push("/auth/login")
        return
      }
      console.debug("[ADMIN] Save failed", e)
      setError(e instanceof Error ? e.message : "Enregistrement impossible")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette notification ?")) return
    try {
      await apiService.deleteNotification(id)
      toast.success("Notification supprimée")
      await fetchAll()
    } catch (e: any) {
      if (e?.status === 401) {
        console.debug("[ADMIN] 401 on delete notification", {
          apiBase: config.apiBaseUrl,
          hasXsrfCookie: hasXsrfCookie(),
          id,
        })
        toast.error("Session expirée. Veuillez vous reconnecter.")
        router.push("/auth/login")
        return
      }
      console.debug("[ADMIN] Delete failed", e)
      toast.error(e instanceof Error ? e.message : "Suppression impossible")
    }
  }

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const currentItems = items.slice((page - 1) * pageSize, page * pageSize)
  const changePageSize = (value: string) => {
    const size = Number(value)
    setPageSize(size)
    setPage(1)
  }

  if (authLoading || loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="p-6 space-y-6">
      {/* Debug panel */}
      <Card className="bg-gradient-to-br from-card to-muted/30 border-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bug className="w-4 h-4 text-primary" />
            <span>Debug: API={config.apiBaseUrl} — XSRF={hasXsrfCookie() ? "present" : "absent"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Gestion des notifications</h1>
          <p className="text-muted-foreground text-lg">Créez et gérez les notifications pour les pèlerins</p>
        </div>
        <Button
          onClick={startCreate}
          className="cursor-pointer bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle notification
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.info}</p>
                <p className="text-sm text-muted-foreground">Info</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.warning}</p>
                <p className="text-sm text-muted-foreground">Important</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to muted/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.urgent}</p>
                <p className="text-sm text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters/Pagination size */}
      <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Affichage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Éléments par page</label>
              <Select value={String(pageSize)} onValueChange={changePageSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {editing ? "Modifier la notification" : "Nouvelle notification"}
              </CardTitle>
              <CardDescription>
                {editing
                  ? "Mettez à jour la notification sélectionnée"
                  : "Créez une nouvelle notification pour les pèlerins"}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowForm(false)
                setEditing(null)
              }}
              className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-destructive/50 bg-destructive/5 animate-shake">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Label htmlFor="title" className="text-base font-medium">
                Titre *
              </Label>
              <Input
                id="title"
                placeholder="Titre de la notification"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                disabled={submitting}
                className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="message" className="text-base font-medium">
                Message *
              </Label>
              <Textarea
                id="message"
                placeholder="Contenu détaillé de la notification"
                rows={4}
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                disabled={submitting}
                className="border-border/50 focus:border-primary resize-none transition-all duration-300 focus:scale-[1.02]"
              />
              <p className="text-xs text-muted-foreground">{form.message.length}/500 caractères</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="type" className="text-base font-medium">
                Type de notification
              </Label>
              <Select
                value={form.type}
                onValueChange={(value: NotifType) => setForm((p) => ({ ...p, type: value }))}
                disabled={submitting}
              >
                <SelectTrigger className="h-12 border-border/50 focus:border-primary transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Information
                    </div>
                  </SelectItem>
                  <SelectItem value="warning">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      Important
                    </div>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      Urgent
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={submitting || !form.title || !form.message}
                className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary cursor-pointer transition-all duration-300 hover:scale-105"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {editing ? "Mettre à jour" : "Créer la notification"}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditing(null)
                }}
                disabled={submitting}
                className="flex-1 h-12 cursor-pointer transition-all duration-300 hover:scale-105"
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {currentItems.map((n, index) => (
          <Card
            key={n.id}
            className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card to-muted/30 border-0 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{n.title}</h3>
                    <Badge
                      className={`${
                        n.type === "urgent"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : n.type === "warning"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                      } transition-all duration-300`}
                    >
                      {n.type === "urgent" ? "Urgent" : n.type === "warning" ? "Important" : "Information"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{n.message}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>Créé le {new Date(n.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="cursor-pointer hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => startEdit(n)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDelete(n.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-muted-foreground">
          Page {page} / {totalPages} — {items.length} éléments
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="cursor-pointer"
          >
            Précédent
          </Button>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="cursor-pointer"
          >
            Suivant
          </Button>
        </div>
      </div>

      {items.length === 0 && (
        <Card className="text-center py-12 bg-gradient-to-br from-card to-muted/30 border-0">
          <CardContent>
            <div className="animate-float mb-6">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto" />
            </div>
            <CardTitle className="text-xl mb-2">Aucune notification</CardTitle>
            <CardDescription>Créez votre première notification pour communiquer avec les pèlerins.</CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
            className="cursor-pointer"
          >
            Suivant
          </Button>
        </div>
      </div>

      {items.length === 0 && (
        <Card className="text-center py-12 bg-gradient-to-br from-card to-muted/30 border-0">
          <CardContent>
            <div className="animate-float mb-6">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto" />
            </div>
            <CardTitle className="text-xl mb-2">Aucune notification</CardTitle>
            <CardDescription>Créez votre première notification pour communiquer avec les pèlerins.</CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Bell, MapPin, Plus, Edit, Trash2, MoreHorizontal, AlertCircle, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiService } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { z } from "zod"

// Types
type NotifType = "info" | "warning" | "urgent"
type EventType = "prayer" | "ceremony" | "event"

interface UiNotification {
  id: string
  title: string
  message: string
  type: NotifType
  createdAt?: string
}

interface UiSchedule {
  id: string
  title: string
  description?: string
  date?: string
  startTime?: string
  endTime?: string
  location?: string
  type?: EventType
}

interface UiPOI {
  id: string
  name: string
  description?: string
  category: string
  latitude?: number
  longitude?: number
  address?: string
  city?: string
  country?: string
  phone?: string
  website?: string
}

// Validation schemas
const notifSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  message: z.string().min(5, "Le message doit contenir au moins 5 caractères"),
  type: z.enum(["info", "warning", "urgent"]),
})

const scheduleSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  type: z.enum(["prayer", "ceremony", "event"]),
})

const poiSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  category: z.string().min(2, "La catégorie est requise"),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
})

export default function AdminContentPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  const [activeTab, setActiveTab] = useState<"schedules" | "notifications" | "pois">("schedules")

  // Shared loading/error
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Data stores
  const [schedules, setSchedules] = useState<UiSchedule[]>([])
  const [notifications, setNotifications] = useState<UiNotification[]>([])
  const [pois, setPois] = useState<UiPOI[]>([])

  // Forms state
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Notification form
  const [notifForm, setNotifForm] = useState<{ title: string; message: string; type: NotifType }>({
    title: "",
    message: "",
    type: "info",
  })

  // Schedule form
  const [scheduleForm, setScheduleForm] = useState<{
    title: string
    description: string
    date: string
    startTime: string
    endTime: string
    location: string
    type: EventType
  }>({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    type: "event",
  })

  // POI form
  const [poiForm, setPoiForm] = useState<{
    name: string
    description: string
    category: string
    latitude: string
    longitude: string
    address: string
    city: string
    country: string
    phone: string
    website: string
  }>({
    name: "",
    description: "",
    category: "",
    latitude: "",
    longitude: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    website: "",
  })

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  const fetchAll = async () => {
    try {
      setLoading(true)
      setError("")
      const [schedulesRes, notifsRes, poisRes] = await Promise.all([
        apiService.getSchedules(),
        apiService.getNotifications(),
        apiService.getPointsOfInterest(),
      ])

      const sch = (schedulesRes.data || []).map((s: any) => ({
        id: String(s.id),
        title: s.title,
        description: s.description ?? "",
        date: s.date ?? "",
        startTime: s.start_time ?? s.startTime ?? "",
        endTime: s.end_time ?? s.endTime ?? "",
        location: s.location ?? "",
        type: (s.type as EventType) ?? "event",
      }))
      setSchedules(sch)

      const nots = (notifsRes.data || []).map((n: any) => ({
        id: String(n.id),
        title: n.title,
        message: n.message,
        type: (n.type as NotifType) || "info",
        createdAt: n.createdAt ?? n.created_at,
      }))
      setNotifications(nots)

      setPois((poisRes.data || []) as UiPOI[])
    } catch (e: any) {
      if (e?.status === 401) {
        router.push("/auth/login")
        return
      }
      setError(e?.message || "Chargement impossible")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAll()
    }
  }, [user])

  // Actions
  const startCreate = () => {
    setEditingId(null)
    setError("")
    setSubmitting(false)
    if (activeTab === "notifications") {
      setNotifForm({ title: "", message: "", type: "info" })
    } else if (activeTab === "schedules") {
      setScheduleForm({ title: "", description: "", date: "", startTime: "", endTime: "", location: "", type: "event" })
    } else {
      setPoiForm({
        name: "",
        description: "",
        category: "",
        latitude: "",
        longitude: "",
        address: "",
        city: "",
        country: "",
        phone: "",
        website: "",
      })
    }
    setShowForm(true)
  }

  const startEdit = (id: string) => {
    setEditingId(id)
    setError("")
    setSubmitting(false)
    if (activeTab === "notifications") {
      const n = notifications.find((x) => x.id === id)!
      setNotifForm({ title: n.title, message: n.message, type: n.type })
    } else if (activeTab === "schedules") {
      const s = schedules.find((x) => x.id === id)!
      setScheduleForm({
        title: s.title,
        description: s.description || "",
        date: s.date || "",
        startTime: s.startTime || "",
        endTime: s.endTime || "",
        location: s.location || "",
        type: (s.type as EventType) || "event",
      })
    } else {
      const p = pois.find((x) => x.id === id)!
      setPoiForm({
        name: p.name,
        description: p.description || "",
        category: p.category || "",
        latitude: String(p.latitude ?? ""),
        longitude: String(p.longitude ?? ""),
        address: p.address || "",
        city: p.city || "",
        country: p.country || "",
        phone: p.phone || "",
        website: p.website || "",
      })
    }
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      if (!confirm("Confirmer la suppression ?")) return
      if (activeTab === "notifications") {
        await apiService.deleteNotification(id)
      } else if (activeTab === "schedules") {
        await apiService.deleteSchedule(id)
      } else {
        await apiService.deletePointOfInterest(id)
      }
      toast.success("Supprimé")
      await fetchAll()
    } catch (e: any) {
      toast.error(e?.message || "Suppression impossible")
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setError("")
      if (activeTab === "notifications") {
        const parsed = notifSchema.safeParse(notifForm)
        if (!parsed.success) throw new Error(parsed.error.errors[0]?.message || "Formulaire invalide")
        if (editingId) {
          await apiService.updateNotification(editingId, notifForm)
          toast.success("Notification mise à jour")
        } else {
          await apiService.sendNotification(notifForm)
          toast.success("Notification créée")
        }
      } else if (activeTab === "schedules") {
        const parsed = scheduleSchema.safeParse(scheduleForm)
        if (!parsed.success) throw new Error(parsed.error.errors[0]?.message || "Formulaire invalide")
        if (editingId) {
          await apiService.updateSchedule(editingId, {
            title: scheduleForm.title.trim(),
            description: scheduleForm.description || undefined,
            date: scheduleForm.date || undefined,
            startTime: scheduleForm.startTime || undefined,
            endTime: scheduleForm.endTime || undefined,
            location: scheduleForm.location || undefined,
            type: scheduleForm.type,
          })
          toast.success("Horaire mis à jour")
        } else {
          await apiService.createSchedule({
            title: scheduleForm.title.trim(),
            description: scheduleForm.description || undefined,
            date: scheduleForm.date || undefined,
            startTime: scheduleForm.startTime || undefined,
            endTime: scheduleForm.endTime || undefined,
            location: scheduleForm.location || undefined,
            type: scheduleForm.type,
          })
          toast.success("Horaire créé")
        }
      } else {
        const parsed = poiSchema.safeParse({
          ...poiForm,
          latitude: poiForm.latitude ? Number(poiForm.latitude) : undefined,
          longitude: poiForm.longitude ? Number(poiForm.longitude) : undefined,
        })
        if (!parsed.success) throw new Error(parsed.error.errors[0]?.message || "Formulaire invalide")
        const payload = parsed.data
        if (editingId) {
          await apiService.updatePointOfInterest(editingId, payload as any)
          toast.success("Point d'intérêt mis à jour")
        } else {
          await apiService.createPointOfInterest(payload as any)
          toast.success("Point d'intérêt créé")
        }
      }
      setShowForm(false)
      setEditingId(null)
      await fetchAll()
    } catch (e: any) {
      if (e?.status === 401) {
        router.push("/auth/login")
        return
      }
      setError(e?.message || "Enregistrement impossible")
    } finally {
      setSubmitting(false)
    }
  }

  const notifStats = useMemo(
    () => ({
      total: notifications.length,
      info: notifications.filter((n) => n.type === "info").length,
      warning: notifications.filter((n) => n.type === "warning").length,
      urgent: notifications.filter((n) => n.type === "urgent").length,
    }),
    [notifications],
  )

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Gestion de contenu</h1>
          <p className="text-muted-foreground text-lg">
            Créez, éditez et supprimez les contenus: Horaires, Notifications, Points d'intérêt.
          </p>
        </div>
        <Button onClick={startCreate} className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedules">Horaires</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="pois">Points d'intérêt</TabsTrigger>
        </TabsList>

        {/* Schedules */}
        <TabsContent value="schedules" className="space-y-4">
          {/* list */}
          <div className="space-y-4">
            {schedules.map((s) => (
              <Card key={s.id} className="hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-muted/30 border-0">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{s.title}</h3>
                        {s.type && <Badge className="bg-blue-50 text-blue-700">{s.type}</Badge>}
                      </div>
                      {s.description && <p className="text-muted-foreground mb-4">{s.description}</p>}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {(s.startTime || s.endTime) && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>
                              {s.startTime} {s.endTime ? `- ${s.endTime}` : ""}
                            </span>
                          </div>
                        )}
                        {s.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-secondary" />
                            <span>{s.location}</span>
                          </div>
                        )}
                        {s.date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>{s.date}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => startEdit(s.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDelete(s.id)}>
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
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{notifStats.total}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{notifStats.info}</p>
                    <p className="text-sm text-muted-foreground">Info</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{notifStats.warning}</p>
                    <p className="text-sm text-muted-foreground">Important</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">{notifStats.urgent}</p>
                    <p className="text-sm text-muted-foreground">Urgent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* list */}
          <div className="space-y-4">
            {notifications.map((n) => (
              <Card key={n.id} className="hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-muted/30 border-0">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{n.title}</h3>
                        <Badge
                          className={`${
                            n.type === "urgent"
                              ? "bg-red-50 text-red-700"
                              : n.type === "warning"
                                ? "bg-orange-50 text-orange-700"
                                : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {n.type === "urgent" ? "Urgent" : n.type === "warning" ? "Important" : "Information"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{n.message}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => startEdit(n.id)}>
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
        </TabsContent>

        {/* Points of interest */}
        <TabsContent value="pois" className="space-y-4">
          <div className="space-y-4">
            {pois.map((p) => (
              <Card key={p.id} className="hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-muted/30 border-0">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{p.name}</h3>
                        <Badge className="bg-green-50 text-green-700">{p.category}</Badge>
                      </div>
                      {p.description && <p className="text-muted-foreground mb-4">{p.description}</p>}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {p.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>
                              {p.address} {p.city ? `, ${p.city}` : ""} {p.country ? `(${p.country})` : ""}
                            </span>
                          </div>
                        )}
                        {typeof p.latitude === "number" && typeof p.longitude === "number" && (
                          <div className="text-muted-foreground">
                            Lat/Lng: {p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}
                          </div>
                        )}
                        {p.phone && <div className="text-muted-foreground">Tel: {p.phone}</div>}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => startEdit(p.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDelete(p.id)}>
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
        </TabsContent>
      </Tabs>

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {editingId ? "Modifier" : "Créer"}{" "}
                {activeTab === "notifications" ? "une notification" : activeTab === "schedules" ? "un horaire" : "un point d'intérêt"}
              </CardTitle>
              <CardDescription>
                {activeTab === "notifications"
                  ? "Gérez la communication aux pèlerins"
                  : activeTab === "schedules"
                    ? "Planifiez les événements du Magal"
                    : "Référencez les lieux utiles"}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setError("")
              }}
              className="cursor-pointer"
            >
              Annuler
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-destructive/50 bg-destructive/5 animate-shake">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive font-medium">{error}</AlertDescription>
              </Alert>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="ntitle" className="text-base font-medium">
                    Titre *
                  </Label>
                  <Input
                    id="ntitle"
                    placeholder="Titre de la notification"
                    value={notifForm.title}
                    onChange={(e) => setNotifForm((p) => ({ ...p, title: e.target.value }))}
                    disabled={submitting}
                    className="h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="nmessage" className="text-base font-medium">
                    Message *
                  </Label>
                  <Textarea
                    id="nmessage"
                    placeholder="Contenu détaillé"
                    rows={4}
                    value={notifForm.message}
                    onChange={(e) => setNotifForm((p) => ({ ...p, message: e.target.value }))}
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Type</Label>
                  <Select value={notifForm.type} onValueChange={(v: NotifType) => setNotifForm((p) => ({ ...p, type: v }))}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="warning">Important</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {activeTab === "schedules" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Titre *</Label>
                  <Input
                    placeholder="Titre de l'horaire"
                    value={scheduleForm.title}
                    onChange={(e) => setScheduleForm((p) => ({ ...p, title: e.target.value }))}
                    disabled={submitting}
                    className="h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Type *</Label>
                  <Select value={scheduleForm.type} onValueChange={(v: EventType) => setScheduleForm((p) => ({ ...p, type: v }))}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prayer">Prière</SelectItem>
                      <SelectItem value="event">Événement</SelectItem>
                      <SelectItem value="ceremony">Cérémonie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Date</Label>
                  <Input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm((p) => ({ ...p, date: e.target.value }))}
                    disabled={submitting}
                    className="h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Lieu</Label>
                  <Input
                    placeholder="Lieu (optionnel)"
                    value={scheduleForm.location}
                    onChange={(e) => setScheduleForm((p) => ({ ...p, location: e.target.value }))}
                    disabled={submitting}
                    className="h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Heure de début (HH:mm)</Label>
                  <Input
                    placeholder="05:30"
                    value={scheduleForm.startTime}
                    onChange={(e) => setScheduleForm((p) => ({ ...p, startTime: e.target.value }))}
                    disabled={submitting}
                    className="h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Heure de fin (HH:mm)</Label>
                  <Input
                    placeholder="07:00"
                    value={scheduleForm.endTime}
                    onChange={(e) => setScheduleForm((p) => ({ ...p, endTime: e.target.value }))}
                    disabled={submitting}
                    className="h-12"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <Label className="text-base font-medium">Description</Label>
                  <Textarea
                    placeholder="Description (optionnel)"
                    rows={4}
                    value={scheduleForm.description}
                    onChange={(e) => setScheduleForm((p) => ({ ...p, description: e.target.value }))}
                    disabled={submitting}
                  />
                </div>
              </div>
            )}

            {activeTab === "pois" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Nom *</Label>
                  <Input
                    placeholder="Nom du lieu"
                    value={poiForm.name}
                    onChange={(e) => setPoiForm((p) => ({ ...p, name: e.target.value }))}
                    disabled={submitting}
                    className="h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Catégorie *</Label>
                  <Input
                    placeholder="Ex: Santé, Hébergement, Restauration..."
                    value={poiForm.category}
                    onChange={(e) => setPoiForm((p) => ({ ...p, category: e.target.value }))}
                    disabled={submitting}
                    className="h-12"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <Label className="text-base font-medium">Description</Label>
                  <Textarea
                    placeholder="Description"
                    rows={3}
                    value={poiForm.description}
                    onChange={(e) => setPoiForm((p) => ({ ...p, description: e.target.value }))}
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Latitude</Label>
                  <Input
                    placeholder="14.8523"
                    value={poiForm.latitude}
                    onChange={(e) => setPoiForm((p) => ({ ...p, latitude: e.target.value }))}
                    disabled={submitting}
                    className="h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Longitude</Label>
                  <Input
                    placeholder="-15.8523"
                    value={poiForm.longitude}
                    onChange={(e) => setPoiForm((p) => ({ ...p, longitude: e.target.value }))}
                    disabled={submitting}
                    className="h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Adresse</Label>
                  <Input
                    placeholder="Adresse"
                    value={poiForm.address}
                    onChange={(e) => setPoiForm((p) => ({ ...p, address: e.target.value }))}
                    disabled={submitting}
                    className="h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Ville</Label>
                  <Input
                    placeholder="Ville"
                    value={poiForm.city}
                    onChange={(e) => setPoiForm((p) => ({ ...p, city: e.target.value }))}
                    disabled={submitting}
                    className="h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Pays</Label>
                  <Input
                    placeholder="Pays"
                    value={poiForm.country}
                    onChange={(e) => setPoiForm((p) => ({ ...p, country: e.target.value }))}
                    disabled={submitting}
                    className="h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Téléphone</Label>
                  <Input
                    placeholder="+221 ..."
                    value={poiForm.phone}
                    onChange={(e) => setPoiForm((p) => ({ ...p, phone: e.target.value }))}
                    disabled={submitting}
                    className="h-12"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <Label className="text-base font-medium">Site web</Label>
                  <Input
                    placeholder="https://..."
                    value={poiForm.website}
                    onChange={(e) => setPoiForm((p) => ({ ...p, website: e.target.value }))}
                    disabled={submitting}
                    className="h-12"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleSubmit}
                disabled={submitting || (activeTab === "notifications" && !notifForm.title) || (activeTab === "schedules" && !scheduleForm.title) || (activeTab === "pois" && !poiForm.name) }
                className="flex-1 h-12 cursor-pointer bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-300 hover:scale-105"
              >
                {submitting ? "Enregistrement..." : editingId ? "Mettre à jour" : "Créer"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                disabled={submitting}
                className="flex-1 h-12 cursor-pointer"
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
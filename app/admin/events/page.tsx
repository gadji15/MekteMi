"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Search, Filter, Plus, Clock, MapPin, Edit, Trash2, MoreHorizontal, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiService } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { z } from "zod"

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
const formSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  date: z.string().optional(), // HTML input type=date fournit YYYY-MM-DD
  startTime: z.string().optional().refine((v) => !v || timeRegex.test(v), "Heure de début invalide (HH:mm)"),
  endTime: z.string().optional().refine((v) => !v || timeRegex.test(v), "Heure de fin invalide (HH:mm)"),
  location: z.string().optional(),
  type: z.enum(["prayer", "ceremony", "event"]),
})

type EventType = "prayer" | "ceremony" | "event"

interface Event {
  id: string
  title: string
  description: string
  date?: string
  startTime: string
  endTime: string
  location: string
  type: EventType
}

export default function AdminEventsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [form, setForm] = useState<{
    title: string
    description: string
    date?: string
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

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  const normalize = (s: any): Event => ({
    id: String(s.id),
    title: s.title,
    description: s.description ?? "",
    date: s.date ?? "",
    startTime: s.start_time ?? s.startTime ?? "",
    endTime: s.end_time ?? s.endTime ?? "",
    location: s.location ?? "",
    type: (s.type as EventType) ?? "event",
  })

  const fetchAll = async () => {
    try {
      setIsLoading(true)
      setError("")
      const res = await apiService.getSchedules()
      const items = (res.data || []).map(normalize)
      setEvents(items)
      setFilteredEvents(items)
    } catch (e: any) {
      if (e?.status === 401) {
        router.push("/auth/login")
        return
      }
      setError(e instanceof Error ? e.message : "Erreur de chargement")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAll()
    }
  }, [user])

  // Filtering
  useEffect(() => {
    let f = events
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      f = f.filter(
        (ev) =>
          ev.title.toLowerCase().includes(term) ||
          ev.location.toLowerCase().includes(term) ||
          ev.description.toLowerCase().includes(term),
      )
    }
    if (typeFilter !== "all") {
      f = f.filter((ev) => ev.type === typeFilter)
    }
    setFilteredEvents(f)
  }, [events, searchTerm, typeFilter])

  const stats = useMemo(
    () => ({
      total: events.length,
      prayers: events.filter((e) => e.type === "prayer").length,
      ceremonies: events.filter((e) => e.type === "ceremony").length,
      others: events.filter((e) => e.type === "event").length,
    }),
    [events],
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case "prayer":
        return "bg-primary/10 text-primary"
      case "ceremony":
        return "bg-red-50 text-red-700"
      case "event":
        return "bg-blue-50 text-blue-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "prayer":
        return "Prière"
      case "ceremony":
        return "Cérémonie"
      case "event":
        return "Événement"
      default:
        return type
    }
  }

  const startCreate = () => {
    setEditing(null)
    setForm({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      type: "event",
    })
    setShowForm(true)
    setError("")
  }

  const startEdit = (ev: Event) => {
    setEditing(ev)
    setForm({
      title: ev.title,
      description: ev.description,
      date: ev.date || "",
      startTime: ev.startTime,
      endTime: ev.endTime,
      location: ev.location,
      type: ev.type,
    })
    setShowForm(true)
    setError("")
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
        await apiService.updateSchedule(editing.id, {
          title: form.title.trim(),
          description: form.description.trim(),
          date: form.date || undefined,
          startTime: form.startTime || undefined,
          endTime: form.endTime || undefined,
          location: form.location || undefined,
          type: form.type,
        })
      } else {
        await apiService.createSchedule({
          title: form.title.trim(),
          description: form.description.trim(),
          date: form.date || undefined,
          startTime: form.startTime || undefined,
          endTime: form.endTime || undefined,
          location: form.location || undefined,
          type: form.type,
        })
      }
      setShowForm(false)
      setEditing(null)
      await fetchAll()
    } catch (e: any) {
      if (e?.status === 401) {
        router.push("/auth/login")
        return
      }
      setError(e instanceof Error ? e.message : "Enregistrement impossible")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet horaire ?")) return
    try {
      await apiService.deleteSchedule(id)
      await fetchAll()
    } catch (e: any) {
      if (e?.status === 401) {
        router.push("/auth/login")
        return
      }
      setError(e instanceof Error ? e.message : "Suppression impossible")
    }
  }

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize))
  const currentItems = filteredEvents.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    // Reset page if filters change
    setPage(1)
  }, [searchTerm, typeFilter])

  const changePageSize = (value: string) => {
    const size = Number(value)
    setPageSize(size)
    setPage(1)
  }

  if (authLoading || isLoading) {
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

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize))
  const currentItems = filteredEvents.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    // Reset page if filters change
    setPage(1)
  }, [searchTerm, typeFilter])

  const changePageSize = (value: string) => {
    const size = Number(value)
    setPageSize(size)
    setPage(1)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Gestion des horaires</h1>
          <p className="text-muted-foreground text-lg">Créez et gérez les prières, cérémonies et événements du Magal</p>
        </div>
        <Button onClick={startCreate} className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Nouvel horaire
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.prayers}</p>
                <p className="text-sm text-muted-foreground">Prières</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.ceremonies}</p>
                <p className="text-sm text-muted-foreground">Cérémonies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.others}</p>
                <p className="text-sm text-muted-foreground">Événements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Titre, lieu, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="prayer">Prière</SelectItem>
                  <SelectItem value="ceremony">Cérémonie</SelectItem>
                  <SelectItem value="event">Événement</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              <CardTitle className="text-2xl">{editing ? "Modifier l'horaire" : "Nouvel horaire"}</CardTitle>
              <CardDescription>
                {editing ? "Mettez à jour les informations de l'horaire" : "Créez un nouvel horaire pour le Magal"}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false)
                setEditing(null)
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-medium">
                  Titre *
                </Label>
                <Input
                  id="title"
                  placeholder="Titre de l'horaire"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  disabled={submitting}
                  className="h-12"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="type" className="text-base font-medium">
                  Type *
                </Label>
                <Select value={form.type} onValueChange={(value: EventType) => setForm((p) => ({ ...p, type: value }))}>
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
                <Label htmlFor="date" className="text-base font-medium">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  disabled={submitting}
                  className="h-12"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="location" className="text-base font-medium">
                  Lieu
                </Label>
                <Input
                  id="location"
                  placeholder="Lieu (optionnel)"
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  disabled={submitting}
                  className="h-12"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="startTime" className="text-base font-medium">
                  Heure de début (HH:mm)
                </Label>
                <Input
                  id="startTime"
                  placeholder="05:30"
                  value={form.startTime}
                  onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
                  disabled={submitting}
                  className="h-12"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="endTime" className="text-base font-medium">
                  Heure de fin (HH:mm)
                </Label>
                <Input
                  id="endTime"
                  placeholder="07:00"
                  value={form.endTime}
                  onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
                  disabled={submitting}
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Description (optionnel)"
                rows={4}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                disabled={submitting}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleSubmit}
                disabled={submitting || !form.title}
                className="flex-1 h-12 cursor-pointer bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-300 hover:scale-105"
              >
                {submitting ? "Enregistrement..." : editing ? "Mettre à jour" : "Créer l'horaire"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditing(null)
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

      {/* Events List */}
      <div className="space-y-4">
        {currentItems.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-muted/30 border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <Badge className={getTypeColor(event.type)}>{getTypeLabel(event.type)}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {(event.startTime || event.endTime) && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>
                          {event.startTime} {event.endTime ? `- ${event.endTime}` : ""}
                        </span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>{event.date}</span>
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
                    <DropdownMenuItem className="cursor-pointer" onClick={() => startEdit(event)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDelete(event.id)}>
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
          Page {page} / {totalPages} — {filteredEvents.length} éléments
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

      {filteredEvents.length === 0 && (
        <Card className="text-center py-12 bg-gradient-to-br from-card to-muted/30 border-0">
          <CardContent>
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl mb-2">Aucun horaire trouvé</CardTitle>
            <CardDescription>
              {searchTerm || typeFilter !== "all"
                ? "Aucun horaire ne correspond aux critères de recherche."
                : "Aucun horaire n'est encore programmé."}
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
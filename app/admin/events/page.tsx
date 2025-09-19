"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Filter, Plus, Clock, MapPin, Users, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Event {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  location: string
  type: "prayer" | "ceremony" | "event"
  status: "active" | "cancelled" | "completed"
  attendees: number
  maxCapacity?: number
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Mock data
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: "1",
        title: "Fajr (Prière de l'aube)",
        description: "Première prière de la journée",
        startTime: "05:30",
        endTime: "06:00",
        location: "Grande Mosquée de Touba",
        type: "prayer",
        status: "active",
        attendees: 2500,
        maxCapacity: 3000,
      },
      {
        id: "2",
        title: "Cérémonie d'ouverture du Magal",
        description: "Cérémonie officielle d'ouverture",
        startTime: "09:00",
        endTime: "11:00",
        location: "Mausolée de Cheikh Ahmadou Bamba",
        type: "ceremony",
        status: "active",
        attendees: 5000,
        maxCapacity: 8000,
      },
      {
        id: "3",
        title: "Conférence religieuse",
        description: "Enseignements sur la vie de Cheikh Ahmadou Bamba",
        startTime: "15:00",
        endTime: "17:00",
        location: "Centre de conférences",
        type: "event",
        status: "active",
        attendees: 800,
        maxCapacity: 1000,
      },
    ]

    setTimeout(() => {
      setEvents(mockEvents)
      setFilteredEvents(mockEvents)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((event) => event.type === typeFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((event) => event.status === statusFilter)
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, typeFilter, statusFilter])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700"
      case "cancelled":
        return "bg-red-50 text-red-700"
      case "completed":
        return "bg-gray-50 text-gray-700"
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Actif"
      case "cancelled":
        return "Annulé"
      case "completed":
        return "Terminé"
      default:
        return status
    }
  }

  const stats = {
    total: events.length,
    active: events.filter((e) => e.status === "active").length,
    prayers: events.filter((e) => e.type === "prayer").length,
    ceremonies: events.filter((e) => e.type === "ceremony").length,
    totalAttendees: events.reduce((sum, e) => sum + e.attendees, 0),
  }

  if (isLoading) {
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Gestion des événements</h1>
          <p className="text-muted-foreground text-lg">Gérez les prières, cérémonies et événements du Magal</p>
        </div>
        <Button className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Nouvel événement
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Actifs</p>
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
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalAttendees.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Participants</p>
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
              <label className="text-sm font-medium">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            className="hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-muted/30 border-0"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <Badge className={getTypeColor(event.type)}>{getTypeLabel(event.type)}</Badge>
                    <Badge className={getStatusColor(event.status)}>{getStatusLabel(event.status)}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>
                        {event.startTime} - {event.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>{event.attendees.toLocaleString()} participants</span>
                    </div>
                    {event.maxCapacity && (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gray-200">
                          <div
                            className="h-full bg-primary rounded"
                            style={{ width: `${(event.attendees / event.maxCapacity) * 100}%` }}
                          />
                        </div>
                        <span>{Math.round((event.attendees / event.maxCapacity) * 100)}% capacité</span>
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
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-destructive">
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

      {filteredEvents.length === 0 && (
        <Card className="text-center py-12 bg-gradient-to-br from-card to-muted/30 border-0">
          <CardContent>
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl mb-2">Aucun événement trouvé</CardTitle>
            <CardDescription>
              {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                ? "Aucun événement ne correspond aux critères de recherche."
                : "Aucun événement n'est encore programmé."}
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

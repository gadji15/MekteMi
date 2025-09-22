"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  UserCheck,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiService } from "@/lib/api"
import type { PilgrimRegistration } from "@/lib/api"
import { toast } from "sonner"

type Role = "pilgrim"
type UserStatus = "active" | "inactive" | "suspended"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: Role
  status: UserStatus
  createdAt: string
  city?: string
  country?: string
}

const mapPilgrimStatusToUser = (s: PilgrimRegistration["status"]): UserStatus => {
  switch (s) {
    case "confirmed":
      return "active"
    case "pending":
      return "inactive"
    case "cancelled":
      return "suspended"
    default:
      return "inactive"
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all")

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await apiService.getPilgrimRegistrations()
      const mapped =
        (res.data || []).map((p) => ({
          id: String(p.id),
          firstName: p.firstName,
          lastName: p.lastName,
          email: p.email,
          phone: p.phone,
          city: p.city,
          country: p.country,
          createdAt: p.registrationDate,
          role: "pilgrim" as const,
          status: mapPilgrimStatusToUser(p.status),
        })) ?? []
      setUsers(mapped)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Impossible de charger les utilisateurs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    let list = users
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      list = list.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      )
    }
    if (statusFilter !== "all") {
      list = list.filter((u) => u.status === statusFilter)
    }
    return list
  }, [users, searchTerm, statusFilter])

  const stats = useMemo(
    () => ({
      total: users.length,
      pilgrims: users.length,
      active: users.filter((u) => u.status === "active").length,
      inactive: users.filter((u) => u.status === "inactive").length,
      suspended: users.filter((u) => u.status === "suspended").length,
    }),
    [users],
  )

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700"
      case "inactive":
        return "bg-yellow-50 text-yellow-700"
      case "suspended":
        return "bg-red-50 text-red-700"
    }
  }

  const getStatusLabel = (status: UserStatus) => {
    switch (status) {
      case "active":
        return "Actif"
      case "inactive":
        return "Inactif"
      case "suspended":
        return "Suspendu"
    }
  }

  const updateStatus = async (u: User, next: UserStatus) => {
    try {
      // Map back to pilgrim status
      const pilgrimStatus: PilgrimRegistration["status"] =
        next === "active" ? "confirmed" : next === "inactive" ? "pending" : "cancelled"
      await apiService.updatePilgrimStatus(u.id, pilgrimStatus)
      toast.success("Statut mis à jour")
      await fetchUsers()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Mise à jour impossible")
    }
  }

  const handleDelete = async (u: User) => {
    if (!confirm(`Supprimer ${u.firstName} ${u.lastName} ?`)) return
    try {
      await apiService.deletePilgrim(u.id)
      toast.success("Utilisateur supprimé")
      await fetchUsers()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Suppression impossible")
    }
  }

  if (loading) {
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
          <h1 className="text-3xl font-bold text-balance">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground text-lg">Liste des comptes (pèlerins)</p>
        </div>
        <Button className="cursor-pointer" disabled title="Création d'utilisateur non disponible pour l'instant">
          <UserCheck className="w-4 h-4 mr-2" />
          Gérer via inscriptions
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
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
              <UserCheck className="w-5 h-5 text-green-600" />
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
              <Shield className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.inactive}</p>
                <p className="text-sm text-muted-foreground">Inactifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.suspended}</p>
                <p className="text-sm text-muted-foreground">Suspendus</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pilgrims}</p>
                <p className="text-sm text-muted-foreground">Pèlerins</p>
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
                  placeholder="Nom, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as UserStatus | "all")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            className="hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-muted/30 border-0"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {user.firstName} {user.lastName}
                    </h3>
                    <Badge className="bg-green-50 text-green-700">Pèlerin</Badge>
                    <Badge className={getStatusColor(user.status)}>{getStatusLabel(user.status)}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {user.city}, {user.country}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Inscrit le {new Date(user.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="cursor-pointer">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => updateStatus(user, "active")}>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Marquer actif
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => updateStatus(user, "inactive")}>
                      <Shield className="w-4 h-4 mr-2" />
                      Marquer inactif
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => updateStatus(user, "suspended")}>
                      <Shield className="w-4 h-4 mr-2" />
                      Suspendre
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDelete(user)}>
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

      {filteredUsers.length === 0 && (
        <Card className="text-center py-12 bg-gradient-to-br from-card to-muted/30 border-0">
          <CardContent>
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl mb-2">Aucun utilisateur trouvé</CardTitle>
            <CardDescription>
              {searchTerm || statusFilter !== "all"
                ? "Aucun utilisateur ne correspond aux critères de recherche."
                : "Aucun utilisateur n'est encore enregistré."}
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

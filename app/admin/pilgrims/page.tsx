"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { apiService, type PilgrimRegistration } from "@/lib/api"
import { Users, Search, Filter, CheckCircle, Clock, XCircle, Phone, Mail, MapPin, Loader2 } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export default function AdminPilgrimsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  const {
    data: pilgrims = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pilgrims"],
    queryFn: async () => {
      const response = await apiService.getPilgrimRegistrations()
      return response.data || []
    },
    enabled: !!user && user.role === "admin",
  })

  const filteredPilgrims = useMemo(() => {
    let filtered = pilgrims
    if (searchTerm) {
      filtered = filtered.filter(
        (pilgrim) =>
          pilgrim.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pilgrim.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pilgrim.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pilgrim.city.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((pilgrim) => pilgrim.status === statusFilter)
    }
    if (countryFilter !== "all") {
      filtered = filtered.filter((pilgrim) => pilgrim.country === countryFilter)
    }
    return filtered
  }, [pilgrims, searchTerm, statusFilter, countryFilter])

  const queryClient = useQueryClient()
  const { mutate: mutateStatus, isPending: isMutating } = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: PilgrimRegistration["status"] }) => {
      const res = await apiService.updatePilgrimStatus(id, newStatus)
      return res.data
    },
    onMutate: async ({ id, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["pilgrims"] })
      const prev = queryClient.getQueryData<PilgrimRegistration[]>(["pilgrims"]) || []
      queryClient.setQueryData<PilgrimRegistration[]>(["pilgrims"], (old = []) =>
        old.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["pilgrims"], ctx.prev)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pilgrims"] })
    },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700"
      case "pending":
        return "bg-yellow-50 text-yellow-700"
      case "cancelled":
        return "bg-red-50 text-red-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmé"
      case "pending":
        return "En attente"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getCountryLabel = (country: string) => {
    const countries: Record<string, string> = {
      senegal: "Sénégal",
      gambia: "Gambie",
      mauritania: "Mauritanie",
      mali: "Mali",
      guinea: "Guinée",
      "burkina-faso": "Burkina Faso",
      "cote-ivoire": "Côte d'Ivoire",
      niger: "Niger",
      "guinea-bissau": "Guinée-Bissau",
      france: "France",
      usa: "États-Unis",
      other: "Autre",
    }
    return countries[country] || country
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  const stats = {
    total: pilgrims.length,
    confirmed: pilgrims.filter((p) => p.status === "confirmed").length,
    pending: pilgrims.filter((p) => p.status === "pending").length,
    cancelled: pilgrims.filter((p) => p.status === "cancelled").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-balance">Gestion des pèlerins</h1>
          <p className="text-muted-foreground text-lg">Gérez les inscriptions des pèlerins au Magal de Touba</p>
        </div>

        {error && (
          <Alert className="mb-6 border-destructive/50 text-destructive">
            <AlertDescription>{(error as Error).message}</AlertDescription>
          </Alert>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
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
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.confirmed}</p>
                  <p className="text-sm text-muted-foreground">Confirmés</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">En attente</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.cancelled}</p>
                  <p className="text-sm text-muted-foreground">Annulés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
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
                    placeholder="Nom, email, ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pays</label>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les pays</SelectItem>
                    <SelectItem value="senegal">Sénégal</SelectItem>
                    <SelectItem value="gambia">Gambie</SelectItem>
                    <SelectItem value="mauritania">Mauritanie</SelectItem>
                    <SelectItem value="mali">Mali</SelectItem>
                    <SelectItem value="guinea">Guinée</SelectItem>
                    <SelectItem value="france">France</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pilgrims List */}
        <div className="space-y-4">
          {filteredPilgrims.map((pilgrim) => (
            <Card key={pilgrim.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {pilgrim.firstName} {pilgrim.lastName}
                      </h3>
                      <Badge className={getStatusColor(pilgrim.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(pilgrim.status)}
                          <span>{getStatusLabel(pilgrim.status)}</span>
                        </div>
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{pilgrim.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{pilgrim.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {pilgrim.city}, {getCountryLabel(pilgrim.country)}
                        </span>
                      </div>
                    </div>
                    {pilgrim.specialNeeds && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                        <strong>Besoins spéciaux :</strong> {pilgrim.specialNeeds}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Inscrit le{" "}
                    {new Date(pilgrim.registrationDate).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="flex gap-2">
                    {pilgrim.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => mutateStatus({ id: pilgrim.id!, newStatus: "confirmed" })}
                          className="bg-green-600 hover:bg-green-700 cursor-pointer"
                          disabled={isMutating}
                        >
                          Confirmer
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => mutateStatus({ id: pilgrim.id!, newStatus: "cancelled" })}
                          className="cursor-pointer"
                          disabled={isMutating}
                        >
                          Refuser
                        </Button>
                      </>
                    )}
                    {pilgrim.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => mutateStatus({ id: pilgrim.id!, newStatus: "cancelled" })}
                        className="cursor-pointer"
                        disabled={isMutating}
                      >
                        Annuler
                      </Button>
                    )}
                    {pilgrim.status === "cancelled" && (
                      <Button
                        size="sm"
                        onClick={() => mutateStatus({ id: pilgrim.id!, newStatus: "confirmed" })}
                        className="cursor-pointer"
                        disabled={isMutating}
                      >
                        Réactiver
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPilgrims.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">Aucun pèlerin trouvé</CardTitle>
              <CardDescription>
                {searchTerm || statusFilter !== "all" || countryFilter !== "all"
                  ? "Aucun pèlerin ne correspond aux critères de recherche."
                  : "Aucune inscription n'a encore été enregistrée."}
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

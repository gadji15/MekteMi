"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  Calendar,
  Bell,
  MapPin,
  TrendingUp,
  Activity,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { apiService, type AdminMetrics } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

// Basic chart placeholders (can be replaced by real time-series later)
const registrationData = [
  { name: "Jan", inscriptions: 0 },
  { name: "Fév", inscriptions: 0 },
  { name: "Mar", inscriptions: 0 },
  { name: "Avr", inscriptions: 0 },
  { name: "Mai", inscriptions: 0 },
  { name: "Juin", inscriptions: 0 },
]

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await apiService.getAdminMetrics()
        setMetrics(res.data)
      } catch (e: any) {
        if (e?.status === 401) {
          router.push("/auth/login")
          return
        }
        setError(e?.message || "Impossible de charger les métriques")
      } finally {
        setLoading(false)
      }
    }
    if (user && user.role === "admin") {
      load()
    }
  }, [user, router])

  const statusData = useMemo(
    () => [
      { name: "Confirmés", value: metrics?.pilgrims.confirmed ?? 0, color: "#10b981" },
      { name: "En attente", value: metrics?.pilgrims.pending ?? 0, color: "#f59e0b" },
      { name: "Annulés", value: metrics?.pilgrims.cancelled ?? 0, color: "#ef4444" },
    ],
    [metrics],
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Tableau de bord administrateur</h1>
          <p className="text-muted-foreground text-lg">Vue d'ensemble de l'application Magal de Touba</p>
        </div>
        <div className="flex gap-2">
          <Button className="cursor-pointer">
            <BarChart3 className="w-4 h-4 mr-2" />
            Rapport complet
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pèlerins</p>
                <p className="text-3xl font-bold">{metrics?.pilgrims.total.toLocaleString() ?? "0"}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Données en temps réel
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confirmés</p>
                <p className="text-3xl font-bold">{metrics?.pilgrims.confirmed.toLocaleString() ?? "0"}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {metrics && metrics.pilgrims.total > 0
                    ? Math.round((metrics.pilgrims.confirmed / metrics.pilgrims.total) * 100)
                    : 0}
                  % du total
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <p className="text-3xl font-bold">{metrics?.pilgrims.pending.toLocaleString() ?? "0"}</p>
                <p className="text-xs text-yellow-600 flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Nécessite action
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Événements actifs</p>
                <p className="text-3xl font-bold">{metrics?.events.active ?? 0}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  Sur {metrics?.events.total ?? 0} total
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Évolution des inscriptions</CardTitle>
            <CardDescription>Série temporelle (TODO: backend timeseries)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="inscriptions"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Répartition des statuts</CardTitle>
            <CardDescription>Distribution des inscriptions par statut</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {statusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activité récente
            </CardTitle>
            <CardDescription>(À relier au backend: dernière notification, dernier pèlerin, etc.)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Dernières métriques mises à jour</p>
                  <p className="text-xs text-muted-foreground">{metrics?.generatedAt}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 cursor-pointer bg-transparent">
              Voir toute l'activité
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Raccourcis vers les tâches courantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 flex-col gap-2 cursor-pointer">
                <Users className="w-6 h-6" />
                <span className="text-sm">Gérer pèlerins</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 cursor-pointer bg-transparent">
                <Bell className="w-6 h-6" />
                <span className="text-sm">Envoyer notification</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 cursor-pointer bg-transparent">
                <Calendar className="w-6 h-6" />
                <span className="text-sm">Nouvel événement</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 cursor-pointer bg-transparent">
                <MapPin className="w-6 h-6" />
                <span className="text-sm">Ajouter lieu</span>
              </Button>
            </div>

            {/* Alerts */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  {(metrics?.pilgrims.pending ?? 0)} inscriptions en attente de validation
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Bell className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  {(metrics?.notifications.total ?? 0)} notifications au total
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded">{error}</div>
      )}
    </div>
  )
} nouveaux messages non lus</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Calendar,
  Bell,
  Activity,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
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
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { apiService, type AdminMetrics } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

type TimePoint = { name: string; total: number; confirmed?: number; pending?: number; cancelled?: number }

export default function AdminStatisticsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Mock time series placeholder (to be replaced by backend timeseries endpoint)
  const pilgrimsSeries: TimePoint[] = useMemo(
    () => [
      { name: "Jan", total: metrics?.pilgrims.total ? Math.max(0, Math.round(metrics.pilgrims.total * 0.2)) : 0 },
      { name: "Fév", total: metrics?.pilgrims.total ? Math.max(0, Math.round(metrics.pilgrims.total * 0.35)) : 0 },
      { name: "Mar", total: metrics?.pilgrims.total ? Math.max(0, Math.round(metrics.pilgrims.total * 0.5)) : 0 },
      { name: "Avr", total: metrics?.pilgrims.total ? Math.max(0, Math.round(metrics.pilgrims.total * 0.6)) : 0 },
      { name: "Mai", total: metrics?.pilgrims.total ? Math.max(0, Math.round(metrics.pilgrims.total * 0.8)) : 0 },
      { name: "Juin", total: metrics?.pilgrims.total ?? 0 },
    ],
    [metrics],
  )

  const statusSeries = useMemo(
    () => [
      {
        name: "Statuts",
        confirmed: metrics?.pilgrims.confirmed ?? 0,
        pending: metrics?.pilgrims.pending ?? 0,
        cancelled: metrics?.pilgrims.cancelled ?? 0,
      },
    ],
    [metrics],
  )

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
        setError(e?.message || "Impossible de charger les statistiques")
      } finally {
        setLoading(false)
      }
    }
    if (user && user.role === "admin") {
      load()
    }
  }, [user, router])

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
          <h1 className="text-3xl font-bold text-balance">Statistiques</h1>
          <p className="text-muted-foreground text-lg">Vue analytique des données réelles du système</p>
        </div>
        <div className="flex gap-2">
          <Button className="cursor-pointer">
            <BarChart3 className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertDescription className="text-destructive">{error}</AlertDescription>
        </Alert>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pèlerins (total)</p>
                <p className="text-3xl font-bold">{metrics?.pilgrims.total.toLocaleString() ?? "0"}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Données réelles
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
                <p className="text-sm font-medium text-muted-foreground">Événements (actifs)</p>
                <p className="text-3xl font-bold">{metrics?.events.active ?? 0}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  Sur {metrics?.events.total ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                <p className="text-3xl font-bold">{metrics?.notifications.total ?? 0}</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Bell className="w-3 h-3 mr-1" />
                  Total
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                <p className="text-3xl font-bold">{metrics?.users.total ?? 0}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  Actifs: {metrics?.users.active ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Évolution des inscriptions</CardTitle>
            <CardDescription>Série mensuelle (placeholder en attendant endpoint timeseries)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={pilgrimsSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
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
            <CardTitle>Répartition des statuts (pèlerins)</CardTitle>
            <CardDescription>Confirmés / En attente / Annulés</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="confirmed" stackId="a" fill="#10b981" />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
                <Bar dataKey="cancelled" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detail Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Détails pèlerins</CardTitle>
            <CardDescription>Comptages actuels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total</span>
              <span className="font-semibold">{metrics?.pilgrims.total ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Confirmés
              </span>
              <span className="font-semibold">{metrics?.pilgrims.confirmed ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                En attente
              </span>
              <span className="font-semibold">{metrics?.pilgrims.pending ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Annulés
              </span>
              <span className="font-semibold">{metrics?.pilgrims.cancelled ?? 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Détails utilisateurs</CardTitle>
            <CardDescription>Répartition par statut</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total</span>
              <span className="font-semibold">{metrics?.users.total ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Actifs</span>
              <span className="font-semibold">{metrics?.users.active ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Inactifs</span>
              <span className="font-semibold">{metrics?.users.inactive ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Suspendus</span>
              <span className="font-semibold">{metrics?.users.suspended ?? 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Volume cumulé</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total</span>
              <span className="font-semibold">{metrics?.notifications.total ?? 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
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

// Mock data for charts
const registrationData = [
  { name: "Jan", inscriptions: 120 },
  { name: "Fév", inscriptions: 190 },
  { name: "Mar", inscriptions: 300 },
  { name: "Avr", inscriptions: 280 },
  { name: "Mai", inscriptions: 450 },
  { name: "Juin", inscriptions: 380 },
]

const statusData = [
  { name: "Confirmés", value: 65, color: "#10b981" },
  { name: "En attente", value: 25, color: "#f59e0b" },
  { name: "Annulés", value: 10, color: "#ef4444" },
]

export default function AdminDashboard() {
  const [stats, _setStats] = useState({
    totalPilgrims: 1247,
    confirmedPilgrims: 810,
    pendingPilgrims: 312,
    cancelledPilgrims: 125,
    totalEvents: 45,
    activeEvents: 12,
    totalNotifications: 89,
    unreadMessages: 23,
  })

  const [recentActivity] = useState([
    { id: 1, type: "registration", message: "Nouvelle inscription de Fatou Diop", time: "Il y a 5 min" },
    { id: 2, type: "event", message: "Événement 'Prière du Fajr' mis à jour", time: "Il y a 15 min" },
    { id: 3, type: "notification", message: "Notification envoyée à 500 utilisateurs", time: "Il y a 1h" },
    { id: 4, type: "user", message: "Nouveau bénévole inscrit", time: "Il y a 2h" },
  ])

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
                <p className="text-3xl font-bold">{stats.totalPilgrims.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% ce mois
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
                <p className="text-3xl font-bold">{stats.confirmedPilgrims.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {Math.round((stats.confirmedPilgrims / stats.totalPilgrims) * 100)}% du total
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
                <p className="text-3xl font-bold">{stats.pendingPilgrims.toLocaleString()}</p>
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
                <p className="text-3xl font-bold">{stats.activeEvents}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  Sur {stats.totalEvents} total
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
            <CardDescription>Nombre d'inscriptions par mois</CardDescription>
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
                    {entry.name}: {entry.value}%
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
            <CardDescription>Dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
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
                  {stats.pendingPilgrims} inscriptions en attente de validation
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Bell className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">{stats.unreadMessages} nouveaux messages non lus</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

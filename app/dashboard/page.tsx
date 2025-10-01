"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { User, Calendar, Bell, MapPin, LogOut, Settings } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrateur"
      case "volunteer":
        return "Bénévole"
      case "pilgrim":
      default:
        return "Pèlerin"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive"
      case "volunteer":
        return "bg-blue-50 text-blue-700"
      case "pilgrim":
      default:
        return "bg-primary/10 text-primary"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-balance">
                Bienvenue, {user.firstName} {user.lastName}
              </h1>
              <p className="text-muted-foreground text-lg">Votre espace personnel du Magal de Touba</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getRoleColor(user.role)}>{getRoleLabel(user.role)}</Badge>
              <Button variant="outline" size="sm" onClick={handleLogout} className="cursor-pointer bg-transparent">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="mb-8 bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Informations du compte</CardTitle>
                <CardDescription>Vos informations personnelles</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rôle</p>
                <p className="font-medium">{getRoleLabel(user.role)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Membre depuis</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center">
                <Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  Modifier le profil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-card to-muted/30 border-0">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Mes inscriptions</CardTitle>
              <CardDescription>Gérez vos inscriptions aux événements</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent cursor-pointer" variant="outline">
                Voir mes inscriptions
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-card to-muted/30 border-0">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Messages et alertes importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent cursor-pointer" variant="outline">
                Voir les notifications
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-card to-muted/30 border-0">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Mes favoris</CardTitle>
              <CardDescription>Lieux et événements sauvegardés</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent cursor-pointer" variant="outline">
                Voir mes favoris
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Section */}
        {user.role === "admin" && (
          <Card className="bg-gradient-to-r from-destructive/5 via-red-50/30 to-destructive/5 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Panneau d'administration</CardTitle>
              <CardDescription>Outils de gestion pour les administrateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="justify-start bg-transparent cursor-pointer">
                  Gérer les utilisateurs
                </Button>
                <Button variant="outline" className="justify-start bg-transparent cursor-pointer">
                  Gérer les événements
                </Button>
                <Button variant="outline" className="justify-start bg-transparent cursor-pointer">
                  Envoyer notifications
                </Button>
                <Button variant="outline" className="justify-start bg-transparent cursor-pointer">
                  Statistiques
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

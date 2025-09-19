"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Send, Plus, Clock, Users, Edit, Trash2, MoreHorizontal, X, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "urgent"
  status: "draft" | "sent" | "scheduled"
  recipients: number
  createdAt: string
  sentAt?: string
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info" as const,
  })

  // Mock data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Changement d'horaire - Cérémonie d'ouverture",
        message: "La cérémonie d'ouverture du Magal a été avancée à 8h30 au lieu de 9h00.",
        type: "warning",
        status: "sent",
        recipients: 1247,
        createdAt: "2025-01-15T10:30:00",
        sentAt: "2025-01-15T10:35:00",
      },
      {
        id: "2",
        title: "Nouvelles mesures de sécurité",
        message: "Pour assurer la sécurité de tous les pèlerins, des contrôles supplémentaires seront effectués.",
        type: "urgent",
        status: "sent",
        recipients: 1247,
        createdAt: "2025-01-15T08:15:00",
        sentAt: "2025-01-15T08:20:00",
      },
      {
        id: "3",
        title: "Rappel - Inscription obligatoire",
        message: "N'oubliez pas de vous inscrire avant la date limite du 20 janvier.",
        type: "info",
        status: "draft",
        recipients: 0,
        createdAt: "2025-01-14T16:45:00",
      },
    ]

    setTimeout(() => {
      setNotifications(mockNotifications)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleCreateNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const notification: Notification = {
        id: Date.now().toString(),
        ...newNotification,
        status: "draft",
        recipients: 0,
        createdAt: new Date().toISOString(),
      }

      setNotifications([notification, ...notifications])
      setNewNotification({ title: "", message: "", type: "info" })
      setShowCreateForm(false)
    } catch (err) {
      setError("Une erreur est survenue lors de la création")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setNewNotification((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const stats = {
    total: notifications.length,
    sent: notifications.filter((n) => n.status === "sent").length,
    drafts: notifications.filter((n) => n.status === "draft").length,
    totalRecipients: notifications.filter((n) => n.status === "sent").reduce((sum, n) => sum + n.recipients, 0),
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Gestion des notifications</h1>
          <p className="text-muted-foreground text-lg">Créez et gérez les notifications pour les pèlerins</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
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
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Send className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.sent}</p>
                <p className="text-sm text-muted-foreground">Envoyées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Edit className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.drafts}</p>
                <p className="text-sm text-muted-foreground">Brouillons</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalRecipients.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Destinataires</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Nouvelle notification</CardTitle>
              <CardDescription>Créez une nouvelle notification pour les pèlerins</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCreateForm(false)}
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
                value={newNotification.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                disabled={isSubmitting}
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
                value={newNotification.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                disabled={isSubmitting}
                className="border-border/50 focus:border-primary resize-none transition-all duration-300 focus:scale-[1.02]"
              />
              <p className="text-xs text-muted-foreground">{newNotification.message.length}/500 caractères</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="type" className="text-base font-medium">
                Type de notification
              </Label>
              <Select
                value={newNotification.type}
                onValueChange={(value: "info" | "warning" | "urgent") => handleInputChange("type", value)}
                disabled={isSubmitting}
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
                onClick={handleCreateNotification}
                disabled={isSubmitting || !newNotification.title || !newNotification.message}
                className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary cursor-pointer transition-all duration-300 hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer la notification
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                disabled={isSubmitting}
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
        {notifications.map((notification, index) => (
          <Card
            key={notification.id}
            className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card to-muted/30 border-0 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{notification.title}</h3>
                    <Badge
                      className={`${
                        notification.type === "urgent"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : notification.type === "warning"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                      } transition-all duration-300`}
                    >
                      {notification.type === "urgent"
                        ? "Urgent"
                        : notification.type === "warning"
                          ? "Important"
                          : "Information"}
                    </Badge>
                    <Badge
                      className={`${
                        notification.status === "sent"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : notification.status === "scheduled"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                      } transition-all duration-300`}
                    >
                      {notification.status === "sent"
                        ? "Envoyé"
                        : notification.status === "scheduled"
                          ? "Programmé"
                          : "Brouillon"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{notification.message}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>Créé le {new Date(notification.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                    {notification.sentAt && (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-green-600" />
                        <span>Envoyé le {new Date(notification.sentAt).toLocaleDateString("fr-FR")}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>{notification.recipients.toLocaleString()} destinataires</span>
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
                    {notification.status === "draft" && (
                      <DropdownMenuItem className="cursor-pointer">
                        <Send className="w-4 h-4 mr-2" />
                        Envoyer
                      </DropdownMenuItem>
                    )}
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

      {notifications.length === 0 && (
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

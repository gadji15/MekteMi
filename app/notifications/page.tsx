import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, Info, Clock, Sparkles } from "lucide-react"
import { NotificationBellIcon } from "@/components/custom-icons"

const notifications = [
  {
    id: "1",
    title: "Changement d'horaire - Cérémonie d'ouverture",
    message:
      "La cérémonie d'ouverture du Magal a été avancée à 8h30 au lieu de 9h00. Merci de vous présenter 30 minutes avant le début pour les préparatifs spirituels.",
    type: "warning" as const,
    createdAt: new Date("2025-01-15T10:30:00"),
    isRead: false,
  },
  {
    id: "2",
    title: "Nouvelles mesures de sécurité",
    message:
      "Pour assurer la sécurité et la sérénité de tous les pèlerins, des contrôles supplémentaires seront effectués aux entrées principales. Prévoyez du temps supplémentaire et apportez une pièce d'identité.",
    type: "urgent" as const,
    createdAt: new Date("2025-01-15T08:15:00"),
    isRead: false,
  },
  {
    id: "3",
    title: "Distribution d'eau gratuite",
    message:
      "Des points de distribution d'eau gratuite sont disponibles près de la Grande Mosquée et du Centre de conférences. Des bénévoles sont présents pour vous orienter.",
    type: "info" as const,
    createdAt: new Date("2025-01-14T16:45:00"),
    isRead: true,
  },
  {
    id: "4",
    title: "Transport en commun renforcé",
    message:
      "Des bus supplémentaires ont été mis en service pour faciliter les déplacements vers Touba. Consultez les nouveaux horaires sur notre application mobile.",
    type: "info" as const,
    createdAt: new Date("2025-01-14T12:20:00"),
    isRead: true,
  },
  {
    id: "5",
    title: "Prévisions météorologiques",
    message:
      "Le temps sera ensoleillé avec des températures élevées (35-40°C). N'oubliez pas de vous hydrater régulièrement, de porter un chapeau et des vêtements légers.",
    type: "info" as const,
    createdAt: new Date("2025-01-13T18:00:00"),
    isRead: true,
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "urgent":
      return <AlertTriangle className="w-6 h-6 text-destructive" />
    case "warning":
      return <Bell className="w-6 h-6 text-orange-500" />
    case "info":
    default:
      return <Info className="w-6 h-6 text-primary" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "urgent":
      return "bg-gradient-to-r from-destructive/20 to-red-200/20 text-destructive border-destructive/30"
    case "warning":
      return "bg-gradient-to-r from-orange-100/50 to-yellow-100/50 text-orange-700 border-orange-200/50"
    case "info":
    default:
      return "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30"
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case "urgent":
      return "Urgent"
    case "warning":
      return "Important"
    case "info":
    default:
      return "Information"
  }
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="animate-float mb-6">
            <NotificationBellIcon className="w-16 h-16 mx-auto text-primary mb-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Notifications</h1>
          <p className="text-muted-foreground text-xl leading-relaxed text-pretty max-w-3xl mx-auto">
            Restez informé des dernières actualités et annonces importantes du Magal de Touba
          </p>
          {unreadCount > 0 && (
            <div className="mt-6">
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 text-base animate-pulse-glow">
                <Sparkles className="w-4 h-4 mr-2" />
                {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""} notification{unreadCount > 1 ? "s" : ""}
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {notifications.map((notification, index) => (
            <Card
              key={notification.id}
              className={`group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-0 bg-gradient-to-r from-card to-muted/30 ${
                !notification.isRead ? "ring-2 ring-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1 w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-xl leading-tight">{notification.title}</CardTitle>
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <Badge className={getNotificationColor(notification.type)}>
                          {getTypeLabel(notification.type)}
                        </Badge>
                        {!notification.isRead && (
                          <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6 text-base">{notification.message}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-lg">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium">{formatDate(notification.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <Card className="text-center py-16 bg-gradient-to-br from-card to-muted/30 border-0">
            <CardContent>
              <div className="animate-float mb-6">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto" />
              </div>
              <CardTitle className="text-2xl mb-4">Aucune notification</CardTitle>
              <CardDescription className="text-lg">
                Vous n'avez aucune notification pour le moment. Revenez plus tard pour les dernières actualités.
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

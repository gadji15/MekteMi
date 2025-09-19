import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Calendar, Sun, Moon, Star } from "lucide-react"
import { PrayerIcon, MosqueIcon } from "@/components/custom-icons"
import { HeroSection } from "@/components/hero-section"

const schedules = [
  {
    id: "1",
    title: "Fajr (Prière de l'aube)",
    description: "Première prière de la journée",
    startTime: "05:30",
    endTime: "06:00",
    location: "Grande Mosquée de Touba",
    type: "prayer" as const,
    icon: Sun,
  },
  {
    id: "2",
    title: "Dhuhr (Prière de midi)",
    description: "Prière du milieu de journée",
    startTime: "13:15",
    endTime: "13:45",
    location: "Grande Mosquée de Touba",
    type: "prayer" as const,
    icon: Sun,
  },
  {
    id: "3",
    title: "Asr (Prière de l'après-midi)",
    description: "Prière de l'après-midi",
    startTime: "16:30",
    endTime: "17:00",
    location: "Grande Mosquée de Touba",
    type: "prayer" as const,
    icon: Sun,
  },
  {
    id: "4",
    title: "Maghrib (Prière du coucher)",
    description: "Prière du coucher du soleil",
    startTime: "19:00",
    endTime: "19:30",
    location: "Grande Mosquée de Touba",
    type: "prayer" as const,
    icon: Moon,
  },
  {
    id: "5",
    title: "Isha (Prière de la nuit)",
    description: "Dernière prière de la journée",
    startTime: "20:30",
    endTime: "21:00",
    location: "Grande Mosquée de Touba",
    type: "prayer" as const,
    icon: Star,
  },
  {
    id: "6",
    title: "Cérémonie d'ouverture du Magal",
    description: "Cérémonie officielle d'ouverture",
    startTime: "09:00",
    endTime: "11:00",
    location: "Mausolée de Cheikh Ahmadou Bamba",
    type: "ceremony" as const,
    icon: MosqueIcon,
  },
  {
    id: "7",
    title: "Conférence religieuse",
    description: "Enseignements sur la vie de Cheikh Ahmadou Bamba",
    startTime: "15:00",
    endTime: "17:00",
    location: "Centre de conférences",
    type: "event" as const,
    icon: Calendar,
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case "prayer":
      return "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30"
    case "ceremony":
      return "bg-gradient-to-r from-destructive/20 to-orange-200/20 text-destructive border-destructive/30"
    case "event":
      return "bg-gradient-to-r from-secondary/20 to-primary/20 text-secondary border-secondary/30"
    default:
      return "bg-muted text-muted-foreground"
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
      return "Autre"
  }
}

export default function HorairesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <HeroSection
        title="Horaires du Magal"
        subtitle="Consultez les horaires sacrés des prières et événements spirituels du Magal de Touba"
        backgroundImage="/int-rieur-de-la-grande-mosqu-e-de-touba-pendant-la.jpg"
        backgroundImageMobile="/mosqu-e-de-touba-vue-mobile-avec-minaret.jpg"
        overlay="dark"
        height="md"
        animated={true}
      >
        <div className="animate-float mb-6">
          <PrayerIcon className="w-16 h-16 mx-auto text-white mb-4" />
        </div>
      </HeroSection>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-8">
          {schedules.map((schedule, index) => {
            const IconComponent = schedule.icon
            return (
              <Card
                key={schedule.id}
                className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-0 bg-gradient-to-r from-card to-muted/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                        {schedule.type === "ceremony" ? (
                          <MosqueIcon className="w-7 h-7 text-white" />
                        ) : (
                          <IconComponent className="w-7 h-7 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <CardTitle className="text-xl md:text-2xl">{schedule.title}</CardTitle>
                          <Badge className={getTypeColor(schedule.type)}>{getTypeLabel(schedule.type)}</Badge>
                        </div>
                        <CardDescription className="text-base text-muted-foreground">
                          {schedule.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-lg">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-primary">
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-secondary/5 px-4 py-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-secondary" />
                      <span className="font-medium text-secondary">{schedule.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-12 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              Note importante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Les horaires peuvent être sujets à des modifications selon les conditions météorologiques et les décisions
              des autorités religieuses. Nous vous recommandons de vérifier régulièrement cette page et de vous abonner
              aux notifications pour les dernières mises à jour.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

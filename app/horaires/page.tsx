"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Calendar, Sun } from "lucide-react"
import { PrayerIcon, MosqueIcon } from "@/components/custom-icons"
import { HeroSection } from "@/components/hero-section"
import { apiService } from "@/lib/api"

type ScheduleItem = {
  id: string
  title: string
  description?: string
  start_time?: string
  end_time?: string
  location?: string
  type?: "prayer" | "event" | "ceremony" | string
}

// Map API schedule type to an icon
function getTypeIcon(type?: string) {
  switch (type) {
    case "ceremony":
      return MosqueIcon
    case "event":
      return Calendar
    case "prayer":
    default:
      return Sun
  }
}

const getTypeColor = (type?: string) => {
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

const getTypeLabel = (type?: string) => {
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
  const [items, setItems] = useState<ScheduleItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await apiService.getSchedules()
        if (!mounted) return
        setItems(res.data || [])
      } catch (e) {
        if (!mounted) return
        setError(e instanceof Error ? e.message : "Impossible de charger les horaires")
      } finally {
        if (mounted) setIsLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

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
        {isLoading ? (
          <div className="grid gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-0 bg-gradient-to-r from-card to-muted/30">
                <CardContent className="p-6">
                  <div className="animate-pulse flex gap-4">
                    <div className="w-14 h-14 bg-muted rounded-2xl" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-1/3 bg-muted rounded" />
                      <div className="h-4 w-2/3 bg-muted rounded" />
                      <div className="h-4 w-1/2 bg-muted rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border-0 bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-6">
              <p className="text-destructive font-medium">{error}</p>
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card className="border-0 bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-6">
              <p className="text-muted-foreground">Aucun horaire disponible pour le moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8">
            {items.map((schedule, index) => {
              const IconComponent = getTypeIcon(schedule.type)
              const start = schedule.start_time ?? ""
              const end = schedule.end_time ?? ""
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
                          {schedule.description && (
                            <CardDescription className="text-base text-muted-foreground">
                              {schedule.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-muted-foreground">
                      {(start || end) && (
                        <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-lg">
                          <Clock className="w-5 h-5 text-primary" />
                          <span className="font-semibold text-primary">
                            {start} {end ? `- ${end}` : ""}
                          </span>
                        </div>
                      )}
                      {schedule.location && (
                        <div className="flex items-center gap-3 bg-secondary/5 px-4 py-2 rounded-lg">
                          <MapPin className="w-5 h-5 text-secondary" />
                          <span className="font-medium text-secondary">{schedule.location}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

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

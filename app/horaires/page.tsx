"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Calendar, Sun } from "lucide-react"
import { PrayerIcon, MosqueIcon } from "@/components/custom-icons"
import { HeroSection } from "@/components/hero-section"
import { apiService } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"

type ScheduleItem = {
  id: string
  title: string
  description?: string
  date?: string
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

const formatDate = (date?: string) => {
  if (!date) return ""
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ""
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d)
}

export default function HorairesPage() {
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("all")

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const res = await apiService.getSchedules()
      return res.data || []
    },
  })

  // Compute filters
  const dates = useMemo(() => {
    const set = new Set<string>()
    for (const it of items) if (it.date) set.add(it.date)
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [items])

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const okType = selectedType === "all" ? true : (it.type || "") === selectedType
      const okDate = selectedDate === "all" ? true : (it.date || "") === selectedDate
      return okType && okDate
    })
  }, [items, selectedType, selectedDate])

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
        {/* Filters */}
        {!isLoading && !error && items.length > 0 && (
          <Card className="mb-8 bg-gradient-to-br from-card to-muted/30 border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Filtrer par type</p>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="prayer">Prière</SelectItem>
                      <SelectItem value="event">Événement</SelectItem>
                      <SelectItem value="ceremony">Cérémonie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Filtrer par date</p>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Toutes les dates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      {dates.map((d) => (
                        <SelectItem key={d} value={d}>
                          {formatDate(d)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
              <p className="text-destructive font-medium">{(error as Error).message}</p>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="border-0 bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-6">
              <p className="text-muted-foreground">Aucun horaire disponible avec ces filtres.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8">
            {filtered.map((schedule, index) => {
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
                      {/* Date badge */}
                      {schedule.date && (
                        <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{formatDate(schedule.date)}</span>
                        </div>
                      )}
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
              <div className="w-12 h-12 bg-gradient-to-br from-primary to secondary rounded-xl flex items-center justify-center">
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

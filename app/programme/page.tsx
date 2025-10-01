"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import { apiService } from "@/lib/api"

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

const getTypeColor = (type?: string) => {
  switch (type) {
    case "ceremony":
      return "bg-primary/10 text-primary"
    case "prayer":
      return "bg-green-50 text-green-700"
    case "event":
      return "bg-blue-50 text-blue-700"
    default:
      return "bg-gray-50 text-gray-700"
  }
}

const getTypeLabel = (type?: string) => {
  switch (type) {
    case "ceremony":
      return "Cérémonie"
    case "prayer":
      return "Prière"
    case "event":
      return "Événement"
    default:
      return "Autre"
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export default function ProgrammePage() {
  const [items, setItems] = useState<ScheduleItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await apiService.getSchedules()
        if (!mounted) return
        setItems(res.data || [])
      } catch (e) {
        if (!mounted) return
        setError(e instanceof Error ? e.message : "Impossible de charger le programme")
      } finally {
        if (mounted) setIsLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  // Group by date (fallback to "Sans date")
  const groups = items.reduce((acc: Record<string, ScheduleItem[]>, it) => {
    const key = it.date || "Sans date"
    acc[key] = acc[key] || []
    acc[key].push(it)
    return acc
  }, {})

  const orderedDates = Object.keys(groups).sort((a, b) => {
    // Put "Sans date" at the end
    if (a === "Sans date") return 1
    if (b === "Sans date") return -1
    return a.localeCompare(b)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-balance">Programme du Magal</h1>
          <p className="text-muted-foreground text-lg text-pretty">
            Planning complet des activités et événements du Magal de Touba
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-0 bg-gradient-to-r from-card to-muted/30">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 w-1/3 bg-muted rounded" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                    <div className="h-4 w-1/2 bg-muted rounded" />
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
              <p className="text-muted-foreground">Aucun événement au programme pour le moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {orderedDates.map((date) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold capitalize">
                    {date === "Sans date" ? "À venir / sans date précise" : formatDate(date)}
                  </h2>
                </div>

                <div className="space-y-4 ml-9">
                  {groups[date].map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-xl">{event.title}</CardTitle>
                              <Badge className={getTypeColor(event.type)}>{getTypeLabel(event.type)}</Badge>
                            </div>
                            {event.description && (
                              <CardDescription className="text-base leading-relaxed">{event.description}</CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          {(event.start_time || event.end_time) && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {event.start_time} {event.end_time ? `- ${event.end_time}` : ""}
                              </span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Informations importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Les horaires peuvent être modifiés en fonction des conditions météorologiques</li>
              <li>• Arrivez 30 minutes avant le début des événements à capacité limitée</li>
              <li>• Les prières collectives sont ouvertes à tous sans inscription</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Phone, Utensils, Bed, Car, Heart, Building } from "lucide-react"
import { apiService } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

type Poi = {
  id: string
  name: string
  description?: string
  address?: string
  latitude?: number
  longitude?: number
  category: "mosque" | "accommodation" | "food" | "transport" | "medical" | "other" | string
  isOpen?: boolean
  openingHours?: string
  phone?: string
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "mosque":
      return <Building className="w-5 h-5" />
    case "accommodation":
      return <Bed className="w-5 h-5" />
    case "food":
      return <Utensils className="w-5 h-5" />
    case "transport":
      return <Car className="w-5 h-5" />
    case "medical":
      return <Heart className="w-5 h-5" />
    default:
      return <MapPin className="w-5 h-5" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "mosque":
      return "bg-primary/10 text-primary"
    case "accommodation":
      return "bg-blue-50 text-blue-700"
    case "food":
      return "bg-green-50 text-green-700"
    case "transport":
      return "bg-purple-50 text-purple-700"
    case "medical":
      return "bg-red-50 text-red-700"
    default:
      return "bg-gray-50 text-gray-700"
  }
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "mosque":
      return "Mosquée"
    case "accommodation":
      return "Hébergement"
    case "food":
      return "Restauration"
    case "transport":
      return "Transport"
    case "medical":
      return "Médical"
    default:
      return "Autre"
  }
}

export default function PointsInteretPage() {
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ["points-of-interest"],
    queryFn: async () => {
      const res = await apiService.getPointsOfInterest()
      return res.data || []
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-balance">Points d'intérêt</h1>
          <p className="text-muted-foreground text-lg text-pretty">
            Découvrez les lieux importants et services disponibles à Touba
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {[...Array(4)].map((_, i) => (
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
              <p className="text-destructive font-medium">{(error as Error).message}</p>
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card className="text-center py-16 bg-gradient-to-br from-card to-muted/30 border-0">
            <CardContent>
              <div className="mb-4 text-muted-foreground">Aucun point d'intérêt disponible pour le moment.</div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {items.map((poi) => (
              <Card key={poi.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{poi.name}</CardTitle>
                        <Badge className={getCategoryColor(poi.category)}>
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(poi.category)}
                            <span>{getCategoryLabel(poi.category)}</span>
                          </div>
                        </Badge>
                      </div>
                      {poi.description && (
                        <CardDescription className="text-base leading-relaxed">{poi.description}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {poi.address && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{poi.address}</span>
                      </div>
                    )}
                    {poi.openingHours && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{poi.openingHours}</span>
                        {poi.isOpen && <Badge className="bg-green-50 text-green-700 text-xs">Ouvert</Badge>}
                      </div>
                    )}
                    {poi.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span className="cursor-pointer hover:text-primary">{poi.phone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Informations pratiques</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Cette liste sera régulièrement mise à jour. Si vous connaissez d'autres lieux importants ou si vous
              remarquez des informations incorrectes, n'hésitez pas à nous le signaler.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

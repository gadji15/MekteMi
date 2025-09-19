import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Phone, Utensils, Bed, Car, Heart, Building } from "lucide-react"
import { Navigation } from "@/components/navigation"

const pointsOfInterest = [
  {
    id: "1",
    name: "Grande Mosquée de Touba",
    description: "La mosquée principale où se déroulent les principales cérémonies du Magal",
    address: "Centre-ville, Touba",
    category: "mosque" as const,
    isOpen: true,
    openingHours: "Ouvert 24h/24",
    phone: "+221 33 XXX XX XX",
  },
  {
    id: "2",
    name: "Mausolée de Cheikh Ahmadou Bamba",
    description: "Lieu de recueillement et de prière, site le plus sacré de Touba",
    address: "Complexe de la Grande Mosquée, Touba",
    category: "mosque" as const,
    isOpen: true,
    openingHours: "05:00 - 22:00",
  },
  {
    id: "3",
    name: "Hôtel Khadim Rassoul",
    description: "Hébergement confortable proche de la Grande Mosquée",
    address: "Avenue Cheikh Ahmadou Bamba, Touba",
    category: "accommodation" as const,
    isOpen: true,
    openingHours: "Réception 24h/24",
    phone: "+221 33 XXX XX XX",
  },
  {
    id: "4",
    name: "Restaurant Touba Café",
    description: "Cuisine locale et internationale, spécialités sénégalaises",
    address: "Marché central, Touba",
    category: "food" as const,
    isOpen: true,
    openingHours: "06:00 - 23:00",
    phone: "+221 77 XXX XX XX",
  },
  {
    id: "5",
    name: "Gare routière de Touba",
    description: "Principal point de transport pour les déplacements vers et depuis Touba",
    address: "Entrée Est de Touba",
    category: "transport" as const,
    isOpen: true,
    openingHours: "04:00 - 24:00",
  },
  {
    id: "6",
    name: "Centre médical Al-Azhar",
    description: "Services médicaux d'urgence et soins de base",
    address: "Quartier Médina, Touba",
    category: "medical" as const,
    isOpen: true,
    openingHours: "24h/24 - Urgences",
    phone: "+221 33 XXX XX XX",
  },
  {
    id: "7",
    name: "Centre de conférences",
    description: "Lieu des conférences religieuses et événements culturels",
    address: "Complexe universitaire, Touba",
    category: "other" as const,
    isOpen: true,
    openingHours: "08:00 - 20:00",
  },
  {
    id: "8",
    name: "Marché central de Touba",
    description: "Marché traditionnel avec produits locaux et artisanat",
    address: "Centre-ville, Touba",
    category: "other" as const,
    isOpen: true,
    openingHours: "06:00 - 20:00",
  },
]

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-balance">Points d'intérêt</h1>
          <p className="text-muted-foreground text-lg text-pretty">
            Découvrez les lieux importants et services disponibles à Touba
          </p>
        </div>

        <div className="grid gap-6">
          {pointsOfInterest.map((poi) => (
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
                    <CardDescription className="text-base leading-relaxed">{poi.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{poi.address}</span>
                  </div>
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

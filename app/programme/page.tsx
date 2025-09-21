import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { Navigation } from "@/components/navigation"

const programEvents = [
  {
    id: "1",
    date: "2025-02-15",
    title: "Arrivée des premiers pèlerins",
    description: "Accueil et orientation des pèlerins arrivant à Touba",
    startTime: "06:00",
    endTime: "18:00",
    location: "Gare routière et points d'accueil",
    type: "logistics",
    capacity: "Illimité",
  },
  {
    id: "2",
    date: "2025-02-16",
    title: "Cérémonie d'ouverture officielle",
    description: "Ouverture officielle du Magal de Touba avec les autorités religieuses",
    startTime: "08:30",
    endTime: "11:00",
    location: "Mausolée de Cheikh Ahmadou Bamba",
    type: "ceremony",
    capacity: "5000 personnes",
  },
  {
    id: "3",
    date: "2025-02-16",
    title: "Conférence : La vie de Cheikh Ahmadou Bamba",
    description: "Enseignements sur la vie et l'œuvre du fondateur du mouridisme",
    startTime: "15:00",
    endTime: "17:00",
    location: "Centre de conférences",
    type: "conference",
    capacity: "1000 personnes",
  },
  {
    id: "4",
    date: "2025-02-17",
    title: "Prière collective du matin",
    description: "Grande prière collective rassemblant tous les pèlerins",
    startTime: "05:30",
    endTime: "07:00",
    location: "Grande Mosquée de Touba",
    type: "prayer",
    capacity: "50000 personnes",
  },
  {
    id: "5",
    date: "2025-02-17",
    title: "Récitation du Coran",
    description: "Récitation collective du Saint Coran par les érudits",
    startTime: "09:00",
    endTime: "12:00",
    location: "Grande Mosquée de Touba",
    type: "religious",
    capacity: "20000 personnes",
  },
  {
    id: "6",
    date: "2025-02-17",
    title: "Distribution de repas communautaires",
    description: "Repas gratuits offerts à tous les pèlerins",
    startTime: "12:30",
    endTime: "14:30",
    location: "Plusieurs points de distribution",
    type: "logistics",
    capacity: "Illimité",
  },
  {
    id: "7",
    date: "2025-02-17",
    title: "Conférence : L'héritage spirituel du mouridisme",
    description: "Discussion sur l'impact du mouridisme dans la société moderne",
    startTime: "16:00",
    endTime: "18:00",
    location: "Centre de conférences",
    type: "conference",
    capacity: "1000 personnes",
  },
  {
    id: "8",
    date: "2025-02-18",
    title: "Cérémonie de clôture",
    description: "Cérémonie officielle de clôture du Magal",
    startTime: "10:00",
    endTime: "12:00",
    location: "Mausolée de Cheikh Ahmadou Bamba",
    type: "ceremony",
    capacity: "10000 personnes",
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case "ceremony":
      return "bg-primary/10 text-primary"
    case "prayer":
      return "bg-green-50 text-green-700"
    case "religious":
      return "bg-purple-50 text-purple-700"
    case "conference":
      return "bg-blue-50 text-blue-700"
    case "logistics":
      return "bg-orange-50 text-orange-700"
    default:
      return "bg-gray-50 text-gray-700"
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case "ceremony":
      return "Cérémonie"
    case "prayer":
      return "Prière"
    case "religious":
      return "Religieux"
    case "conference":
      return "Conférence"
    case "logistics":
      return "Logistique"
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

const groupEventsByDate = (events: typeof programEvents) => {
  return events.reduce(
    (groups, event) => {
      const date = event.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(event)
      return groups
    },
    {} as Record<string, typeof programEvents>,
  )
}

export default function ProgrammePage() {
  const groupedEvents = groupEventsByDate(programEvents)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-balance">Programme du Magal</h1>
          <p className="text-muted-foreground text-lg text-pretty">
            Planning complet des activités et événements du Magal de Touba 2025
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([date, events]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold capitalize">{formatDate(date)}</h2>
              </div>

              <div className="space-y-4 ml-9">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{event.title}</CardTitle>
                            <Badge className={getTypeColor(event.type)}>{getTypeLabel(event.type)}</Badge>
                          </div>
                          <CardDescription className="text-base leading-relaxed">{event.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.capacity}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Informations importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Les horaires peuvent être modifiés en fonction des conditions météorologiques</li>
              <li>• Arrivez 30 minutes avant le début des événements à capacité limitée</li>
              <li>• Les prières collectives sont ouvertes à tous sans inscription</li>
              <li>• Des services de traduction seront disponibles pour les conférences</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

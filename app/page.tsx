import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Bell, Star, Compass } from "lucide-react"
import { MosqueIcon, PrayerIcon, CommunityIcon, QiblaIcon, NotificationBellIcon } from "@/components/custom-icons"
import Link from "next/link"
import { HeroSection } from "@/components/hero-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <HeroSection
        title="MbekteMi"
        subtitle="Application communautaire pour les pèlerins"
        backgroundImage="/grande-mosqu-e-de-touba-au-coucher-du-soleil-avec-.jpg"
        backgroundImageMobile="/grande-mosqu-e-de-touba-mobile-view.jpg"
        overlay="gradient"
        height="lg"
        animated={true}
        parallax={true}
      >
        <div className="animate-float mb-6">
          <MosqueIcon className="w-20 h-20 mx-auto text-white mb-4" />
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Badge variant="secondary" className="glass-effect text-white border-white/30">
            <Star className="w-4 h-4 mr-2" />
            Nouvelle version
          </Badge>
          <Badge variant="secondary" className="glass-effect text-white border-white/30">
            <Compass className="w-4 h-4 mr-2" />
            100% Responsive
          </Badge>
        </div>
        <Button size="lg" className="animate-pulse-glow bg-white text-primary hover:bg-white/90 cursor-pointer">
          Commencer l'expérience
        </Button>
      </HeroSection>

      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Welcome Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">Bienvenue dans votre guide spirituel</h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed text-pretty max-w-3xl mx-auto">
            Découvrez une expérience enrichie pour votre pèlerinage. Accédez facilement aux horaires sacrés,
            inscrivez-vous comme pèlerin, recevez des notifications importantes et explorez les lieux saints.
          </p>
        </section>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/50">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                <PrayerIcon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Horaires des Prières</CardTitle>
              <CardDescription className="text-base">
                Consultez les horaires précis des prières et événements spirituels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/horaires" className="cursor-pointer">
                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary cursor-pointer">
                  Voir les horaires
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/50">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                <CommunityIcon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Inscription Pèlerin</CardTitle>
              <CardDescription className="text-base">
                Rejoignez officiellement la communauté des pèlerins du Magal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/inscription" className="cursor-pointer">
                <Button className="w-full bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary cursor-pointer">
                  S'inscrire maintenant
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/50">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                <NotificationBellIcon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Notifications</CardTitle>
              <CardDescription className="text-base">
                Restez informé des dernières annonces et informations importantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/notifications" className="cursor-pointer">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white bg-transparent cursor-pointer"
                >
                  Voir les notifications
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/50">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Lieux Saints</CardTitle>
              <CardDescription className="text-base">
                Explorez les points d'intérêt spirituels et historiques de Touba
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/points-interet" className="cursor-pointer">
                <Button
                  variant="outline"
                  className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white bg-transparent cursor-pointer"
                >
                  Explorer les lieux
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/50">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Programme Complet</CardTitle>
              <CardDescription className="text-base">
                Planning détaillé de toutes les activités et cérémonies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/programme" className="cursor-pointer">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white bg-transparent cursor-pointer"
                >
                  Voir le programme
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/50">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                <QiblaIcon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Direction Qibla</CardTitle>
              <CardDescription className="text-base">
                Trouvez facilement la direction de la prière où que vous soyez
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white bg-transparent cursor-pointer"
              >
                Localiser la Qibla
              </Button>
            </CardContent>
          </Card>
        </div>

        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Pèlerins inscrits</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/10">
              <div className="text-4xl font-bold text-secondary mb-2">24/7</div>
              <div className="text-muted-foreground">Support disponible</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Gratuit et accessible</div>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-primary/20 mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              Annonce Importante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Cette application a été entièrement repensée pour offrir une expérience moderne et intuitive. Profitez des
              nouvelles fonctionnalités PWA pour une utilisation optimale sur tous vos appareils, même hors ligne.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

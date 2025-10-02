"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Bell, Calendar, MapPin, CheckCircle } from "lucide-react"

export default function HeroOptimized() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      {/* Lightweight decorative background for better LCP */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%)]" />
      <div className="absolute -top-24 -right-24 size-[480px] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Left: Content */}
          <div className="space-y-6">
            <Badge className="bg-primary/10 text-primary">PWA disponible</Badge>

            <h1 id="hero-title" className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              MbekteMi — votre compagnon pour le Magal de Touba
            </h1>

            <p className="text-lg text-muted-foreground text-pretty">
              Horaires, inscriptions, notifications et points d’intérêt — tout ce qu’il faut pour vivre le Magal en
              toute sérénité.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="h-12 px-6">
                <Link href="/inscription" aria-label="S’inscrire au Magal">
                  S’inscrire au Magal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-6">
                <Link href="/horaires" aria-label="Voir les horaires">
                  Voir les horaires
                  <Calendar className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Trust chips */}
            <ul className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                +1 200 pèlerins inscrits
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                40+ points d’intérêt
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Bell className="h-4 w-4 text-primary" />
                Notifications officielles
              </li>
            </ul>
          </div>

          {/* Right: Placeholder visual (non-blocking) */}
          <div className="relative">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-md rounded-xl bg-gradient-to-br from-card to-muted/30 p-2 shadow-md" />
            <p className="mt-3 text-center text-xs text-muted-foreground">Aperçu — l’interface peut évoluer.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
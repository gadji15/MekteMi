import { Badge } from "@/components/ui/badge"
import { MosqueIcon } from "@/components/custom-icons"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-muted via-muted/80 to-muted mt-16 py-12 px-4 border-t">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo et description */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <MosqueIcon className="w-8 h-8 text-primary mr-2" />
              <h3 className="text-xl font-bold">MbekteMi</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Application communautaire dédiée aux pèlerins et à la communauté Mouride. Développée avec respect et
              dévotion.
            </p>
          </div>

          {/* Liens rapides */}
          <div className="text-center">
            <h4 className="font-semibold mb-4">Liens Rapides</h4>
            <div className="space-y-2 text-sm">
              <div>
                <a
                  href="/horaires"
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  Horaires des Prières
                </a>
              </div>
              <div>
                <a
                  href="/inscription"
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  Inscription Pèlerin
                </a>
              </div>
              <div>
                <a
                  href="/notifications"
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  Notifications
                </a>
              </div>
              <div>
                <a
                  href="/points-interet"
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  Points d'Intérêt
                </a>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-center md:justify-end">
                <Mail className="w-4 h-4 mr-2" />
                <span>quantiksense@gmail.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <Phone className="w-4 h-4 mr-2" />
                <span>+221784782850</span>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Sénégal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-border/50 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="text-xs">
                Version 2.0
              </Badge>
              <Badge variant="outline" className="text-xs">
                PWA Ready
              </Badge>
              <Badge variant="outline" className="text-xs">
                100% Responsive
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              © 2024 MbekteMi - QuantikSense. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

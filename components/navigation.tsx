"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Home, Clock, Users, Bell, MapPin, Calendar, LogIn, User, Settings, UserPlus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { MosqueIcon } from "@/components/custom-icons"

const navigationItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/horaires", label: "Horaires", icon: Clock },
  { href: "/inscription", label: "Inscription", icon: Users },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/points-interet", label: "Points d'intérêt", icon: MapPin },
  { href: "/programme", label: "Programme", icon: Calendar },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  return (
    <nav className="bg-gradient-to-r from-background via-muted/30 to-background border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg lg:text-xl cursor-pointer">
            <MosqueIcon className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
            <span className="text-gradient">MbekteMi</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer"
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-2 ml-4">
                <Badge className="bg-gradient-to-r from-primary to-secondary text-white text-xs">
                  {user.firstName}
                </Badge>

                {user.role === "admin" && (
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white cursor-pointer text-xs px-3"
                  >
                    <Link href="/admin" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-1" />
                      <span className="hidden xl:inline">Admin</span>
                    </Link>
                  </Button>
                )}

                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 p-2 rounded-lg cursor-pointer"
                >
                  <User className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-primary/20 hover:bg-primary/10 cursor-pointer text-xs px-3 bg-transparent"
                >
                  <Link href="/auth/register" className="cursor-pointer">
                    <UserPlus className="w-4 h-4 mr-1" />
                    <span className="hidden xl:inline">Inscription</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary cursor-pointer text-xs px-3"
                >
                  <Link href="/auth/login" className="cursor-pointer">
                    <LogIn className="w-4 h-4 mr-1" />
                    <span className="hidden xl:inline">Connexion</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Medium screens navigation - compact version */}
          <div className="hidden md:flex lg:hidden items-center space-x-1">
            {navigationItems.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 p-2 rounded-lg cursor-pointer"
                title={item.label}
              >
                <item.icon className="w-4 h-4" />
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <Badge className="bg-gradient-to-r from-primary to-secondary text-white text-xs">
                  {user.firstName.charAt(0)}
                </Badge>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-orange-500 hover:text-orange-600 p-2 rounded-lg cursor-pointer"
                    title="Administration"
                  >
                    <Settings className="w-4 h-4" />
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-primary p-2 rounded-lg cursor-pointer"
                  title="Mon compte"
                >
                  <User className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-1 ml-2">
                <Link
                  href="/auth/register"
                  className="text-muted-foreground hover:text-primary p-2 rounded-lg cursor-pointer"
                  title="Inscription"
                >
                  <UserPlus className="w-4 h-4" />
                </Link>
                <Link
                  href="/auth/login"
                  className="text-primary hover:text-primary/80 p-2 rounded-lg cursor-pointer"
                  title="Connexion"
                >
                  <LogIn className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden cursor-pointer">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gradient-to-b from-background to-muted/30">
              <div className="flex flex-col space-y-2 mt-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <MosqueIcon className="w-8 h-8 text-primary" />
                  <span className="font-bold text-lg text-gradient">MbekteMi</span>
                </div>

                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 px-4 py-3 rounded-lg cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}

                <div className="border-t pt-4 mt-6">
                  {user ? (
                    <div className="space-y-2">
                      <div className="px-4 py-2">
                        <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
                          {user.firstName} {user.lastName}
                        </Badge>
                      </div>

                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center space-x-3 text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 transition-all duration-200 px-4 py-3 rounded-lg cursor-pointer"
                          onClick={() => setIsOpen(false)}
                        >
                          <Settings className="h-5 w-5" />
                          <span className="font-medium">Administration</span>
                        </Link>
                      )}

                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-3 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 px-4 py-3 rounded-lg cursor-pointer"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span className="font-medium">Mon compte</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/auth/register"
                        className="flex items-center space-x-3 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 px-4 py-3 rounded-lg cursor-pointer"
                        onClick={() => setIsOpen(false)}
                      >
                        <UserPlus className="h-5 w-5" />
                        <span className="font-medium">S'inscrire</span>
                      </Link>
                      <Link
                        href="/auth/login"
                        className="flex items-center space-x-3 text-white bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-200 px-4 py-3 rounded-lg cursor-pointer"
                        onClick={() => setIsOpen(false)}
                      >
                        <LogIn className="h-5 w-5" />
                        <span className="font-medium">Se connecter</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

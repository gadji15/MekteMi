"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { LogIn, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-primary mb-2">MbekteMi</h1>
          <p className="text-muted-foreground">Connectez-vous à votre compte</p>
        </div>

        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-2xl animate-slide-up">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <LogIn className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>Accédez à votre espace personnel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-destructive/50 text-destructive bg-destructive/5 animate-shake">
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre.email@exemple.com"
                  disabled={isLoading}
                  className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-base font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Votre mot de passe"
                    disabled={isLoading}
                    className="h-12 border-border/50 focus:border-primary pr-12 transition-all duration-300 focus:scale-[1.02]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:underline cursor-pointer font-medium transition-colors"
                >
                  S'inscrire
                </Link>
              </p>
              <Link href="/" className="text-sm text-muted-foreground hover:underline cursor-pointer transition-colors">
                Retour à l'accueil
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4 bg-primary/5 border-primary/20 animate-fade-in-delay">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Compte de test :</strong> admin@mbektemi.sn / password
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

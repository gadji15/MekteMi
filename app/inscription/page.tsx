"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiService } from "@/lib/api"
import { Users, CheckCircle, AlertCircle, Loader2, Sparkles, Heart } from "lucide-react"
import { CommunityIcon } from "@/components/custom-icons"

export default function InscriptionPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    accommodationType: "",
    specialNeeds: "",
  })

  const totalSteps = 3

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validation
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone ||
        !formData.city ||
        !formData.country
      ) {
        throw new Error("Veuillez remplir tous les champs obligatoires")
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Veuillez entrer une adresse email valide")
      }

      // Phone validation (basic)
      if (formData.phone.length < 8) {
        throw new Error("Veuillez entrer un numéro de téléphone valide")
      }

      const response = await apiService.registerPilgrim(formData)

      if (response.success) {
        setIsSubmitted(true)
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          city: "",
          country: "",
          accommodationType: "",
          specialNeeds: "",
        })
      } else {
        throw new Error(response.message || "Une erreur est survenue")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedToStep2 = () => {
    return formData.firstName && formData.lastName && formData.email && formData.phone
  }

  const canProceedToStep3 = () => {
    return formData.city && formData.country
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <main className="max-w-3xl mx-auto px-4 py-12">
          <Card className="text-center bg-gradient-to-br from-card to-muted/30 border-0 shadow-2xl">
            <CardHeader className="pb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl md:text-4xl text-gradient mb-4">Inscription réussie !</CardTitle>
              <CardDescription className="text-xl text-muted-foreground">
                Votre inscription au Magal de Touba a été enregistrée avec succès.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 p-6 rounded-2xl border border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <p className="font-semibold text-lg text-primary">Prochaines étapes :</p>
                </div>
                <ul className="text-left text-muted-foreground space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Vous recevrez un email de confirmation dans les prochaines minutes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Votre inscription sera examinée par nos équipes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Nous vous contacterons si des informations supplémentaires sont nécessaires</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Vous recevrez les détails pratiques une fois votre inscription confirmée</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary hover:text-white cursor-pointer"
                >
                  Nouvelle inscription
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary cursor-pointer"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="animate-float mb-6">
            <CommunityIcon className="w-16 h-16 mx-auto text-primary mb-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Inscription au Magal</h1>
          <p className="text-muted-foreground text-xl leading-relaxed text-pretty max-w-3xl mx-auto">
            Rejoignez officiellement la communauté des pèlerins et recevez toutes les informations importantes
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step <= currentStep
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      step < currentStep ? "bg-gradient-to-r from-primary to-secondary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Étape {currentStep} sur {totalSteps}
            </p>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-2xl animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              {currentStep === 1 && "Informations personnelles"}
              {currentStep === 2 && "Localisation"}
              {currentStep === 3 && "Préférences"}
            </CardTitle>
            <CardDescription className="text-base">
              {currentStep === 1 && "Vos informations de base"}
              {currentStep === 2 && "Votre lieu de résidence"}
              {currentStep === 3 && "Vos préférences d'hébergement"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <Alert className="border-destructive/50 bg-destructive/5 animate-shake">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <AlertDescription className="text-destructive font-medium">{error}</AlertDescription>
                </Alert>
              )}

              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="firstName" className="text-base font-medium">
                        Prénom *
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                        placeholder="Votre prénom"
                        disabled={isLoading}
                        className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="lastName" className="text-base font-medium">
                        Nom de famille *
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                        placeholder="Votre nom de famille"
                        disabled={isLoading}
                        className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      placeholder="votre.email@exemple.com"
                      disabled={isLoading}
                      className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-base font-medium">
                      Téléphone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                      placeholder="+221 XX XXX XX XX"
                      disabled={isLoading}
                      className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="city" className="text-base font-medium">
                        Ville *
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        required
                        placeholder="Votre ville"
                        disabled={isLoading}
                        className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="country" className="text-base font-medium">
                        Pays *
                      </Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => handleInputChange("country", value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="h-12 border-border/50 focus:border-primary transition-all duration-300">
                          <SelectValue placeholder="Sélectionnez votre pays" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="senegal">Sénégal</SelectItem>
                          <SelectItem value="gambia">Gambie</SelectItem>
                          <SelectItem value="mauritania">Mauritanie</SelectItem>
                          <SelectItem value="mali">Mali</SelectItem>
                          <SelectItem value="guinea">Guinée</SelectItem>
                          <SelectItem value="burkina-faso">Burkina Faso</SelectItem>
                          <SelectItem value="cote-ivoire">Côte d'Ivoire</SelectItem>
                          <SelectItem value="niger">Niger</SelectItem>
                          <SelectItem value="guinea-bissau">Guinée-Bissau</SelectItem>
                          <SelectItem value="france">France</SelectItem>
                          <SelectItem value="usa">États-Unis</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Preferences */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-3">
                    <Label htmlFor="accommodationType" className="text-base font-medium">
                      Type d'hébergement souhaité
                    </Label>
                    <Select
                      value={formData.accommodationType}
                      onValueChange={(value) => handleInputChange("accommodationType", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-12 border-border/50 focus:border-primary transition-all duration-300">
                        <SelectValue placeholder="Sélectionnez un type d'hébergement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family">Chez une famille d'accueil</SelectItem>
                        <SelectItem value="hotel">Hôtel</SelectItem>
                        <SelectItem value="guesthouse">Maison d'hôtes</SelectItem>
                        <SelectItem value="camping">Camping organisé</SelectItem>
                        <SelectItem value="own">J'ai mon propre hébergement</SelectItem>
                        <SelectItem value="none">Pas d'hébergement nécessaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="specialNeeds" className="text-base font-medium">
                      Besoins spéciaux ou commentaires
                    </Label>
                    <Textarea
                      id="specialNeeds"
                      value={formData.specialNeeds}
                      onChange={(e) => handleInputChange("specialNeeds", e.target.value)}
                      placeholder="Mentionnez tout besoin spécial (mobilité réduite, régime alimentaire, allergies, etc.)"
                      rows={4}
                      disabled={isLoading}
                      className="border-border/50 focus:border-primary resize-none transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="cursor-pointer transition-all duration-300 hover:scale-105 bg-transparent"
                    disabled={isLoading}
                  >
                    Précédent
                  </Button>
                )}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary cursor-pointer transition-all duration-300 hover:scale-105"
                    disabled={
                      (currentStep === 1 && !canProceedToStep2()) ||
                      (currentStep === 2 && !canProceedToStep3()) ||
                      isLoading
                    }
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="ml-auto h-14 px-8 text-lg bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Inscription en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-3" />
                        S'inscrire au Magal
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-8 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 border-border/50">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Informations importantes :
              </h3>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>L'inscription est gratuite et ouverte à tous</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Vos données personnelles sont protégées et ne seront pas partagées</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Vous pouvez modifier votre inscription jusqu'à 48h avant l'événement</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <span>En cas de problème, contactez-nous à quantiksense@gmail.com</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

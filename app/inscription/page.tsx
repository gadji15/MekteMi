"use client"

import type React from "react"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
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

const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  phone: z.string().min(8, "Veuillez entrer un numéro de téléphone valide"),
  city: z.string().min(2, "La ville est requise"),
  country: z.string().min(2, "Le pays est requis"),
  accommodationType: z.string().optional().default(""),
  specialNeeds: z.string().optional().default(""),
})

type FormValues = z.infer<typeof formSchema>

export default function InscriptionPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)

  const {
    register,
    control,
    handleSubmit,
    getValues,
    trigger,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      country: "",
      accommodationType: "",
      specialNeeds: "",
    },
    mode: "onBlur",
  })

  const totalSteps = 3

  const onSubmit = async (values: FormValues) => {
    setServerError("")
    setIsLoading(true)
    try {
      const response = await apiService.registerPilgrim(values)
      if (response.success) {
        setIsSubmitted(true)
        reset()
      } else {
        throw new Error(response.message || "Une erreur est survenue")
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = async () => {
    if (currentStep === 1) {
      const ok = await trigger(["firstName", "lastName", "email", "phone"])
      if (!ok) return
    }
    if (currentStep === 2) {
      const ok = await trigger(["city", "country"])
      if (!ok) return
    }
    setCurrentStep((s) => Math.min(s + 1, totalSteps))
  }

  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1))

  const canProceedToStep2 = () => {
    const v = getValues()
    return v.firstName && v.lastName && v.email && v.phone && !errors.firstName && !errors.lastName && !errors.email && !errors.phone
  }
  const canProceedToStep3 = () => {
    const v = getValues()
    return v.city && v.country && !errors.city && !errors.country
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {serverError && (
                <Alert className="border-destructive/50 bg-destructive/5 animate-shake">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <AlertDescription className="text-destructive font-medium">{serverError}</AlertDescription>
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
                        placeholder="Votre prénom"
                        disabled={isLoading}
                        className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
                        {...register("firstName")}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="lastName" className="text-base font-medium">
                        Nom de famille *
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Votre nom de famille"
                        disabled={isLoading}
                        className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
                        {...register("lastName")}
                      />
                      {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre.email@exemple.com"
                      disabled={isLoading}
                      className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
                      {...register("email")}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-base font-medium">
                      Téléphone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+221 XX XXX XX XX"
                      disabled={isLoading}
                      className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
                      {...register("phone")}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
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
                        placeholder="Votre ville"
                        disabled={isLoading}
                        className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
                        {...register("city")}
                      />
                      {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="country" className="text-base font-medium">
                        Pays *
                      </Label>
                      <Controller
                        control={control}
                        name="country"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
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
                        )}
                      />
                      {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
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
                    <Controller
                      control={control}
                      name="accommodationType"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
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
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="specialNeeds" className="text-base font-medium">
                      Besoins spéciaux ou commentaires
                    </Label>
                    <Textarea
                      id="specialNeeds"
                      placeholder="Mentionnez tout besoin spécial (mobilité réduite, régime alimentaire, allergies, etc.)"
                      rows={4}
                      disabled={isLoading}
                      className="border-border/50 focus:border-primary resize-none transition-all duration-300 focus:scale-[1.02]"
                      {...register("specialNeeds")}
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

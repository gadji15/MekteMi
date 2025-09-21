"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Globe, Bell, Shield, Database, Mail, Smartphone, CheckCircle, AlertCircle } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "MbekteMi",
    siteDescription: "Application communautaire pour le pèlerinage du Magal de Touba",
    contactEmail: "quantiksense@gmail.com",
    supportPhone: "+221784782850",
    enableRegistrations: true,
    enableNotifications: true,
    enableSMS: false,
    maxPilgrims: 10000,
    registrationDeadline: "2025-02-15",
    maintenanceMode: false,
    autoApproveRegistrations: false,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    setSaveSuccess(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // TODO: Save settings to backend
      console.log("Saving settings:", settings)

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setError("Une erreur est survenue lors de la sauvegarde")
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key: keyof typeof settings, value: typeof settings[typeof key]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    if (saveSuccess) setSaveSuccess(false)
    if (error) setError("")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Paramètres système</h1>
          <p className="text-muted-foreground text-lg">Configurez les paramètres généraux de l'application</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="cursor-pointer bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-300 hover:scale-105"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </>
          )}
        </Button>
      </div>

      {/* Success/Error Messages */}
      {saveSuccess && (
        <Alert className="border-green-200 bg-green-50 animate-slide-up">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 font-medium">
            Paramètres sauvegardés avec succès !
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-destructive/50 bg-destructive/5 animate-shake">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* General Settings */}
      <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            Paramètres généraux
          </CardTitle>
          <CardDescription>Configuration de base de l'application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="siteName" className="text-base font-medium">
                Nom du site
              </Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => updateSetting("siteName", e.target.value)}
                className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="contactEmail" className="text-base font-medium">
                Email de contact
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateSetting("contactEmail", e.target.value)}
                className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="siteDescription" className="text-base font-medium">
              Description du site
            </Label>
            <Textarea
              id="siteDescription"
              rows={3}
              value={settings.siteDescription}
              onChange={(e) => updateSetting("siteDescription", e.target.value)}
              className="border-border/50 focus:border-primary resize-none transition-all duration-300 focus:scale-[1.02]"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="supportPhone" className="text-base font-medium">
              Téléphone de support
            </Label>
            <Input
              id="supportPhone"
              value={settings.supportPhone}
              onChange={(e) => updateSetting("supportPhone", e.target.value)}
              className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Registration Settings */}
      <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-secondary" />
            </div>
            Paramètres d'inscription
          </CardTitle>
          <CardDescription>Configuration des inscriptions des pèlerins</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg transition-all duration-300 hover:bg-muted/50">
            <div className="space-y-1">
              <Label className="text-base font-medium">Activer les inscriptions</Label>
              <p className="text-sm text-muted-foreground">Permettre aux pèlerins de s'inscrire</p>
            </div>
            <Switch
              checked={settings.enableRegistrations}
              onCheckedChange={(checked) => updateSetting("enableRegistrations", checked)}
              className="transition-all duration-300"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg transition-all duration-300 hover:bg-muted/50">
            <div className="space-y-1">
              <Label className="text-base font-medium">Approbation automatique</Label>
              <p className="text-sm text-muted-foreground">Approuver automatiquement les nouvelles inscriptions</p>
            </div>
            <Switch
              checked={settings.autoApproveRegistrations}
              onCheckedChange={(checked) => updateSetting("autoApproveRegistrations", checked)}
              className="transition-all duration-300"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="maxPilgrims" className="text-base font-medium">
                Nombre maximum de pèlerins
              </Label>
              <Input
                id="maxPilgrims"
                type="number"
                value={settings.maxPilgrims}
                onChange={(e) => updateSetting("maxPilgrims", Number.parseInt(e.target.value))}
                className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="registrationDeadline" className="text-base font-medium">
                Date limite d'inscription
              </Label>
              <Input
                id="registrationDeadline"
                type="date"
                value={settings.registrationDeadline}
                onChange={(e) => updateSetting("registrationDeadline", e.target.value)}
                className="h-12 border-border/50 focus:border-primary transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            Paramètres de notification
          </CardTitle>
          <CardDescription>Configuration des notifications et communications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg transition-all duration-300 hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <Label className="text-base font-medium">Notifications email</Label>
                <p className="text-sm text-muted-foreground">Envoyer des notifications par email</p>
              </div>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => updateSetting("enableNotifications", checked)}
              className="transition-all duration-300"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg transition-all duration-300 hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-secondary" />
              <div>
                <Label className="text-base font-medium">Notifications SMS</Label>
                <p className="text-sm text-muted-foreground">Envoyer des notifications par SMS</p>
              </div>
            </div>
            <Switch
              checked={settings.enableSMS}
              onCheckedChange={(checked) => updateSetting("enableSMS", checked)}
              className="transition-all duration-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Database className="w-5 h-5 text-orange-600" />
            </div>
            Paramètres système
          </CardTitle>
          <CardDescription>Configuration avancée du système</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg transition-all duration-300 hover:bg-muted/50">
            <div className="space-y-1">
              <Label className="text-base font-medium">Mode maintenance</Label>
              <p className="text-sm text-muted-foreground">Activer le mode maintenance pour les mises à jour</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
              className="transition-all duration-300"
            />
          </div>
          {settings.maintenanceMode && (
            <Alert className="border-yellow-200 bg-yellow-50 animate-slide-up">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                ⚠️ Le mode maintenance est activé. Les utilisateurs ne pourront pas accéder à l'application.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          size="lg"
          disabled={isSaving}
          className="cursor-pointer bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-300 hover:scale-105 px-8"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Sauvegarde en cours...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Sauvegarder tous les paramètres
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

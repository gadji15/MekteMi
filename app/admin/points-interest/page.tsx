"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { apiService } from "@/lib/api"
import { MapPin, Plus, Save, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { PointOfInterest } from "@/lib/types"

type Poi = PointOfInterest

const categories = [
  { value: "mosque", label: "Mosquée" },
  { value: "accommodation", label: "Hébergement" },
  { value: "food", label: "Restauration" },
  { value: "transport", label: "Transport" },
  { value: "medical", label: "Médical" },
  { value: "other", label: "Autre" },
] as const

export default function AdminPointsInterestPage() {
  const [items, setItems] = useState<Poi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState<Poi | null>(null)
  const router = useRouter()

  const fetchAll = async () => {
    try {
      setLoading(true)
      const res = await apiService.getPointsOfInterest()
      setItems(res.data || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const startNew = () =>
    setEditing({
      id: "",
      name: "",
      category: "other",
      isOpen: true,
    })

  const onEdit = (poi: Poi) => setEditing(poi)

  const onDelete = async (id: string) => {
    if (!confirm("Supprimer ce point d'intérêt ?")) return
    try {
      await apiService.deletePointOfInterest(id)
      toast.success("Point d'intérêt supprimé")
      await fetchAll()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Suppression impossible")
    }
  }

  const onSave = async () => {
    if (!editing) return
    if (!editing.name.trim()) {
      toast.error("Le nom est requis")
      return
    }
    const payload = {
      name: editing.name.trim(),
      description: editing.description?.trim() || undefined,
      address: editing.address?.trim() || undefined,
      latitude: editing.latitude,
      longitude: editing.longitude,
      category: editing.category,
      isOpen: !!editing.isOpen,
      openingHours: editing.openingHours?.trim() || undefined,
      phone: editing.phone?.trim() || undefined,
    }
    try {
      if (editing.id) {
        await apiService.updatePointOfInterest(editing.id, payload)
        toast.success("Point d'intérêt mis à jour")
      } else {
        await apiService.createPointOfInterest(payload)
        toast.success("Point d'intérêt créé")
      }
      setEditing(null)
      await fetchAll()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Enregistrement impossible")
    }
  }

  const counterByCategory = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const c of categories) counts[c.value] = 0
    for (const p of items) counts[p.category] = (counts[p.category] ?? 0) + 1
    return counts
  }, [items])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Points d'intérêt
        </h1>
        <div className="flex items-center gap-3">
          <Button onClick={() => router.push("/points-interet")} variant="secondary" className="cursor-pointer">
            Voir la page publique
          </Button>
          <Button onClick={startNew} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" /> Nouveau
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {categories.map((c) => (
          <Card key={c.value} className="bg-muted/30 border-0">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">{c.label}</div>
              <div className="text-xl font-semibold">{counterByCategory[c.value] ?? 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>Liste</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : error ? (
              <div className="text-destructive">{error}</div>
            ) : items.length === 0 ? (
              <div className="text-muted-foreground">Aucun point d'intérêt.</div>
            ) : (
              <div className="space-y-3">
                {items.map((poi) => (
                  <div
                    key={poi.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-sm transition"
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">{poi.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{poi.address || "Adresse inconnue"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{poi.category}</Badge>
                      <Button size="sm" variant="outline" onClick={() => onEdit(poi)} className="cursor-pointer">
                        Éditer
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(poi.id)} className="cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Editor */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>{editing?.id ? "Modifier" : "Créer"} un point d'intérêt</CardTitle>
          </CardHeader>
          <CardContent>
            {!editing ? (
              <div className="text-muted-foreground">Sélectionnez un élément ou créez-en un nouveau.</div>
            ) : (
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nom</Label>
                    <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Catégorie</Label>
                    <select
                      className="h-10 px-3 rounded-md border bg-background"
                      value={editing.category}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value as PointOfInterest["category"] })}
                    >
                      {categories.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={editing.description || ""}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Adresse</Label>
                  <Input
                    value={editing.address || ""}
                    onChange={(e) => setEditing({ ...editing, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Latitude</Label>
                    <Input
                      type="number"
                      value={editing.latitude ?? ""}
                      onChange={(e) => setEditing({ ...editing, latitude: e.target.value === "" ? undefined : Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <Input
                      type="number"
                      value={editing.longitude ?? ""}
                      onChange={(e) => setEditing({ ...editing, longitude: e.target.value === "" ? undefined : Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Horaires</Label>
                    <Input
                      value={editing.openingHours || ""}
                      onChange={(e) => setEditing({ ...editing, openingHours: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <Input
                      value={editing.phone || ""}
                      onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="isOpen"
                    type="checkbox"
                    checked={!!editing.isOpen}
                    onChange={(e) => setEditing({ ...editing, isOpen: e.target.checked })}
                  />
                  <Label htmlFor="isOpen">Ouvert</Label>
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={onSave} className="cursor-pointer">
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(null)} className="cursor-pointer">
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
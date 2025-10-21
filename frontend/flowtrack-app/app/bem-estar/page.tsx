"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Heart, Plus, TrendingUp, Calendar } from "lucide-react"

interface MoodEntry {
  id: number
  mood: string
  emoji: string
  energy: number
  stress: number
  notes: string
  date: string
}

const moodOptions = [
  { value: "excelente", label: "Excelente", emoji: "😄", color: "bg-green-500" },
  { value: "bom", label: "Bom", emoji: "😊", color: "bg-blue-500" },
  { value: "neutro", label: "Neutro", emoji: "😐", color: "bg-yellow-500" },
  { value: "ruim", label: "Ruim", emoji: "😔", color: "bg-orange-500" },
  { value: "pessimo", label: "Péssimo", emoji: "😢", color: "bg-red-500" },
]

const selfCareActivities = [
  { id: 1, title: "Meditação de 10 minutos", icon: "🧘", category: "Mental" },
  { id: 2, title: "Caminhada ao ar livre", icon: "🚶", category: "Físico" },
  { id: 3, title: "Ler um livro", icon: "📚", category: "Mental" },
  { id: 4, title: "Tomar um banho relaxante", icon: "🛁", category: "Físico" },
  { id: 5, title: "Conversar com um amigo", icon: "💬", category: "Social" },
  { id: 6, title: "Praticar gratidão", icon: "🙏", category: "Mental" },
]

export default function WellBeingPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([
    {
      id: 1,
      mood: "bom",
      emoji: "😊",
      energy: 7,
      stress: 4,
      notes: "Dia produtivo no trabalho",
      date: "2025-10-15",
    },
    {
      id: 2,
      mood: "excelente",
      emoji: "😄",
      energy: 9,
      stress: 2,
      notes: "Ótimo treino pela manhã",
      date: "2025-10-14",
    },
    {
      id: 3,
      mood: "neutro",
      emoji: "😐",
      energy: 5,
      stress: 6,
      notes: "Dia corrido com muitas reuniões",
      date: "2025-10-13",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    mood: "bom",
    emoji: "😊",
    energy: 5,
    stress: 5,
    notes: "",
  })

  useEffect(() => {
    const openDialog = localStorage.getItem("openMoodDialog")
    if (openDialog === "true") {
      setIsDialogOpen(true)
      localStorage.removeItem("openMoodDialog")
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEntry: MoodEntry = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString().split("T")[0],
    }
    setEntries([newEntry, ...entries])
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      mood: "bom",
      emoji: "😊",
      energy: 5,
      stress: 5,
      notes: "",
    })
    setIsDialogOpen(false)
  }

  const selectMood = (mood: (typeof moodOptions)[0]) => {
    setFormData({
      ...formData,
      mood: mood.value,
      emoji: mood.emoji,
    })
  }

  const getAverageMood = () => {
    if (entries.length === 0) return 0
    const moodValues: Record<string, number> = {
      pessimo: 1,
      ruim: 2,
      neutro: 3,
      bom: 4,
      excelente: 5,
    }
    const sum = entries.reduce((acc, entry) => acc + (moodValues[entry.mood] || 0), 0)
    return (sum / entries.length).toFixed(1)
  }

  const getAverageEnergy = () => {
    if (entries.length === 0) return 0
    const sum = entries.reduce((acc, entry) => acc + entry.energy, 0)
    return (sum / entries.length).toFixed(1)
  }

  const getAverageStress = () => {
    if (entries.length === 0) return 0
    const sum = entries.reduce((acc, entry) => acc + entry.stress, 0)
    return (sum / entries.length).toFixed(1)
  }

  const getMoodColor = (mood: string) => {
    return moodOptions.find((m) => m.value === mood)?.color || "bg-gray-500"
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:pl-64">
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Bem-estar"
            description="Acompanhe seu humor, energia e pratique autocuidado"
            action={
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar Humor
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>Como você está se sentindo?</DialogTitle>
                      <DialogDescription>Registre seu humor e bem-estar do momento</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="grid gap-3">
                        <Label>Humor</Label>
                        <div className="grid grid-cols-5 gap-2">
                          {moodOptions.map((mood) => (
                            <button
                              key={mood.value}
                              type="button"
                              onClick={() => selectMood(mood)}
                              className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                                formData.mood === mood.value
                                  ? "border-foreground scale-105 bg-muted"
                                  : "border-border hover:scale-105 hover:bg-muted"
                              }`}
                            >
                              <span className="text-3xl">{mood.emoji}</span>
                              <span className="text-xs text-center">{mood.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="energy">Nível de Energia</Label>
                          <span className="text-2xl font-bold text-foreground">{formData.energy}</span>
                        </div>
                        <input
                          id="energy"
                          type="range"
                          min="1"
                          max="10"
                          value={formData.energy}
                          onChange={(e) => setFormData({ ...formData, energy: Number.parseInt(e.target.value) })}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Baixa</span>
                          <span>Alta</span>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="stress">Nível de Estresse</Label>
                          <span className="text-2xl font-bold text-foreground">{formData.stress}</span>
                        </div>
                        <input
                          id="stress"
                          type="range"
                          min="1"
                          max="10"
                          value={formData.stress}
                          onChange={(e) => setFormData({ ...formData, stress: Number.parseInt(e.target.value) })}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Baixo</span>
                          <span>Alto</span>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="notes">Notas (opcional)</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Como foi seu dia? O que aconteceu?"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                      <Button type="submit">Salvar</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            }
          />

          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Humor Médio</CardTitle>
                <Heart className="h-5 w-5 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{getAverageMood()}/5</div>
                <p className="text-xs text-muted-foreground mt-2">Últimos {entries.length} registros</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Energia Média</CardTitle>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{getAverageEnergy()}/10</div>
                <p className="text-xs text-muted-foreground mt-2">Nível de energia geral</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Estresse Médio</CardTitle>
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{getAverageStress()}/10</div>
                <p className="text-xs text-muted-foreground mt-2">Nível de estresse geral</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Mood History */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Humor</CardTitle>
                </CardHeader>
                <CardContent>
                  {entries.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Nenhum registro ainda</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Comece a registrar seu humor para acompanhar seu bem-estar
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {entries.map((entry) => (
                        <div key={entry.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-12 w-12 rounded-full ${getMoodColor(entry.mood)} flex items-center justify-center text-2xl`}
                              >
                                {entry.emoji}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">
                                  {moodOptions.find((m) => m.value === entry.mood)?.label}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(entry.date).toLocaleDateString("pt-BR")}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Energia</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500"
                                    style={{ width: `${(entry.energy / 10) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-foreground">{entry.energy}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Estresse</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-orange-500"
                                    style={{ width: `${(entry.stress / 10) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-foreground">{entry.stress}</span>
                              </div>
                            </div>
                          </div>
                          {entry.notes && <p className="text-sm text-muted-foreground italic">{entry.notes}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Self-care Suggestions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Sugestões de Autocuidado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selfCareActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-2xl">{activity.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{activity.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{activity.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

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
import { Heart, Plus, TrendingUp, Calendar, Edit, Trash2 } from "lucide-react"
import { MoodEntry, createMoodEntry, deleteMoodEntry, getAllMoodEntries, getMoodEntriesByDateRange, getMoodEntryById, updateMoodEntry } from "@/lib/api/mood"

const moodOptions = [
  { value: "excelente", label: "Excelente", emoji: "😄", color: "bg-green-500" },
  { value: "bom", label: "Bom", emoji: "😊", color: "bg-blue-500" },
  { value: "neutro", label: "Neutro", emoji: "😐", color: "bg-yellow-500" },
  { value: "ruim", label: "Ruim", emoji: "😔", color: "bg-orange-500" },
  { value: "pessimo", label: "Péssimo", emoji: "😢", color: "bg-red-500" },
]

const MOOD_ID_MAP: Record<string, number> = {
  excelente: 0,
  bom: 1,
  neutro: 2,
  ruim: 3,
  pessimo: 4,
}

const selfCareActivities = [
  { id: 1, title: "Meditação de 10 minutos", icon: "🧘", category: "Mental" },
  { id: 2, title: "Caminhada ao ar livre", icon: "🚶", category: "Físico" },
  { id: 3, title: "Ler um livro", icon: "📚", category: "Mental" },
  { id: 4, title: "Tomar um banho relaxante", icon: "🛁", category: "Físico" },
  { id: 5, title: "Conversar com um amigo", icon: "💬", category: "Social" },
  { id: 6, title: "Praticar gratidão", icon: "🙏", category: "Mental" },
]

export default function WellBeingPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loadingList, setLoadingList] = useState(false)

  const fetchList = async (pageToLoad: number = page, sizeToLoad: number = size) => {
    const p = Math.max(0, pageToLoad)
    setLoadingList(true)
    try {
      let resp
      if (startDate && endDate) {
        resp = await getMoodEntriesByDateRange(startDate, endDate, { page: p, size: sizeToLoad })
      } else {
        resp = await getAllMoodEntries({ page: p, size: sizeToLoad })
      }
      setEntries(resp.content)
      setPage(resp.number)
      setSize(resp.size)
      setTotalPages(resp.totalPages)
      setTotalElements(resp.totalElements)
    } catch (err) {
      console.error("Failed to fetch paginated mood entries:", err)
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    fetchList(0)
  }, [])

  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [loadingRange, setLoadingRange] = useState(false)
  const fetchEntriesByRange = async () => {
    if (!startDate || !endDate) return
    if (new Date(startDate) > new Date(endDate)) {
      console.warn("Data inicial não pode ser maior que a final")
      return
    }
    await fetchList(0)
  }

  const clearDateFilter = async () => {
    setStartDate("")
    setEndDate("")
    await fetchList(0)
  }

  const [entryId, setEntryId] = useState<string>("")
  const [loadingById, setLoadingById] = useState(false)
  const [errorById, setErrorById] = useState<string | null>(null)
  const fetchEntryById = async () => {
    setErrorById(null)
    if (!entryId) return
    const idNum = Number(entryId)
    if (!Number.isInteger(idNum) || idNum <= 0) {
      setErrorById("Informe um ID válido (inteiro positivo).")
      return
    }

    try {
      setLoadingById(true)
      const entry = await getMoodEntryById(idNum)
      setEntries(entry ? [entry] : [])
    } catch (error) {
      console.error("Failed to fetch mood entry by id:", error)
      setErrorById("Registro não encontrado ou erro ao buscar.")
    } finally {
      setLoadingById(false)
    }
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    humor: "bom",
    emoji: "😊",
    energia: 5,
    estresse: 5,
    notas: "",
  })

  useEffect(() => {
    const openDialog = localStorage.getItem("openMoodDialog")
    if (openDialog === "true") {
      setIsDialogOpen(true)
      localStorage.removeItem("openMoodDialog")
    }
  }, [])

  const [editingId, setEditingId] = useState<number | null>(null)
  const handleOpenEdit = (entry: MoodEntry) => {
    setEditingId(entry.id)
    setFormData({
      humor: entry.humor.toLowerCase(),
      emoji: entry.emoji,
      energia: entry.energia,
      estresse: entry.estresse,
      notas: entry.notas || "",
    })
    setIsDialogOpen(true)
  }

  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)

    try {
      setCreating(true)

      const payload = {
        humor: MOOD_ID_MAP[formData.humor],
        emoji: formData.emoji,
        energia: formData.energia,
        estresse: formData.estresse,
        notas: formData.notas,
      }

      if (editingId) {
        await updateMoodEntry(editingId, payload)
      } else {
        await createMoodEntry(payload)
      }

      await fetchList(0)
      resetForm()
    } catch (error) {
      console.error("Failed to create mood entry:", error)
      setCreateError("Não foi possível salvar. Tente novamente.")
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMoodEntry(id)
      await fetchList(0)
    } catch (error) {
      console.error("Erro ao deletar entrada de humor:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      humor: "bom",
      emoji: "😊",
      energia: 5,
      estresse: 5,
      notas: "",
    })
    setEditingId(null)
    setIsDialogOpen(false)
  }

  const selectMood = (mood: (typeof moodOptions)[0]) => {
    setFormData({
      ...formData,
      humor: mood.value,
      emoji: mood.emoji,
    })
  }

  const getAverageMood = () => {
    if (entries.length === 0) return 0
    const moodValues: Record<string, number> = {
      PESSIMO: 1,
      RUIM: 2,
      NEUTRO: 3,
      BOM: 4,
      EXCELENTE: 5
    }
    const sum = entries.reduce((acc, entry) => acc + (moodValues[entry.humor] || 0), 0)
    return (sum / entries.length).toFixed(1)
  }

  const getAverageEnergy = () => {
    if (entries.length === 0) return 0
    const sum = entries.reduce((acc, entry) => acc + entry.energia, 0)
    return (sum / entries.length).toFixed(1)
  }

  const getAverageStress = () => {
    if (entries.length === 0) return 0
    const sum = entries.reduce((acc, entry) => acc + entry.estresse, 0)
    return (sum / entries.length).toFixed(1)
  }

  const getMoodColor = (mood: string) => {
    const key = mood.toLowerCase()
    return moodOptions.find((m) => m.value === key)?.color || "bg-gray-500"
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
                      <DialogTitle>
                        {editingId ? "Editar registro de humor" : "Como você está se sentindo?"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingId ? "Atualize os dados do seu registro" : "Registre seu humor e bem-estar do momento"}
                      </DialogDescription>
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
                              className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${formData.humor === mood.value
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
                          <span className="text-2xl font-bold text-foreground">{formData.energia}</span>
                        </div>
                        <input
                          id="energy"
                          type="range"
                          min="1"
                          max="10"
                          value={formData.energia}
                          onChange={(e) => setFormData({ ...formData, energia: Number.parseInt(e.target.value) })}
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
                          <span className="text-2xl font-bold text-foreground">{formData.estresse}</span>
                        </div>
                        <input
                          id="stress"
                          type="range"
                          min="1"
                          max="10"
                          value={formData.estresse}
                          onChange={(e) => setFormData({ ...formData, estresse: Number.parseInt(e.target.value) })}
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
                          value={formData.notas}
                          onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                          placeholder="Como foi seu dia? O que aconteceu?"
                          rows={3}
                        />
                      </div>
                    </div>
                    {createError && (
                      <p className="text-sm text-red-500 mb-2">{createError}</p>
                    )}

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={creating}>
                        {creating ? "Salvando..." : editingId ? "Atualizar" : "Salvar"}
                      </Button>
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
                                className={`h-12 w-12 rounded-full ${getMoodColor(entry.humor)} flex items-center justify-center text-2xl`}
                              >
                                {entry.emoji}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">
                                  {moodOptions.find((m) => m.value === entry.humor.toLowerCase())?.label}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(entry.dataCriacao).toLocaleDateString("pt-BR")}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenEdit(entry)}
                                className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(entry.id)}
                                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Energia</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500"
                                    style={{ width: `${(entry.energia / 10) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-foreground">{entry.energia}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Estresse</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-orange-500"
                                    style={{ width: `${(entry.estresse / 10) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-foreground">{entry.estresse}</span>
                              </div>
                            </div>
                          </div>
                          {entry.notas && <p className="text-sm text-muted-foreground italic">{entry.notas}</p>}
                        </div>
                      ))}
                      {/* Paginação */}
                      <div className="flex justify-center items-center gap-2 pt-4 border-t border-border">

                        <Button
                          variant="outline"
                          onClick={() => fetchList(page - 1, size)}
                          disabled={loadingList || page <= 0}
                        >
                          Anterior
                        </Button>

                        {totalPages > 0 && (() => {
                          const windowSize = 5
                          const start = Math.max(0, Math.min(page - Math.floor(windowSize / 2), Math.max(0, totalPages - windowSize)))
                          const end = Math.min(totalPages, start + windowSize)
                          const buttons = []
                          for (let i = start; i < end; i++) {
                            buttons.push(
                              <Button
                                key={i}
                                variant={i === page ? "default" : "outline"}
                                className={i === page ? "border-primary" : ""}
                                onClick={() => fetchList(i, size)}
                                disabled={loadingList}
                              >
                                {i + 1}
                              </Button>
                            )
                          }
                          return buttons
                        })()}

                        <Button
                          variant="outline"
                          onClick={() => fetchList(page + 1, size)}
                          disabled={loadingList || page + 1 >= totalPages}
                        >
                          Próximo
                        </Button>
                      </div>
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

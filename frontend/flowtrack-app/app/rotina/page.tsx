"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Edit, CheckCircle2, Circle, Sunrise, Sun, Sunset } from "lucide-react"
import {
  getAllRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  toggleRoutineComplete,
  type RoutineActivity,
} from "@/lib/api/rotina"

const daysOfWeek = [
  { id: "dom", label: "Dom" },
  { id: "seg", label: "Seg" },
  { id: "ter", label: "Ter" },
  { id: "qua", label: "Qua" },
  { id: "qui", label: "Qui" },
  { id: "sex", label: "Sex" },
  { id: "sab", label: "Sáb" },
]

export default function RoutinePage() {
  const [activities, setActivities] = useState<RoutineActivity[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<RoutineActivity | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<"all" | "morning" | "afternoon" | "evening">("all")
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
    duration: 15,
    period: "morning" as "morning" | "afternoon" | "evening",
    days: [] as string[],
  })

  useEffect(() => {
    async function loadRoutines() {
      try {
        setIsLoading(true)
        const data = await getAllRoutines()
        setActivities(data)
      } catch (err) {
        console.error("Erro ao carregar rotinas", err)
        setError("Erro ao carregar rotinas")
      } finally {
        setIsLoading(false)
      }
    }
    loadRoutines()
  }, [])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.title || formData.title.trim() === "") {
      errors.title = "O título é obrigatório"
    }

    if (!formData.time) {
      errors.time = "O horário é obrigatório"
    }

    if (!formData.period) {
      errors.period = "O período é obrigatório"
    }

    if (!formData.duration || formData.duration <= 0) {
      errors.duration = "A duração deve ser maior que zero"
    }

    if (formData.days.length === 0) {
      errors.days = "Selecione pelo menos um dia da semana"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setError("Por favor, preencha todos os campos obrigatórios")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      if (editingActivity) {
        const updated = await updateRoutine(editingActivity.id, {
          title: formData.title.trim(),
          description: formData.description || "",
          time: formData.time,
          duration: formData.duration,
          period: formData.period,
          days: formData.days,
        })
        setActivities(activities.map((activity) => (activity.id === updated.id ? updated : activity)))
      } else {
        const created = await createRoutine({
          title: formData.title.trim(),
          description: formData.description || "",
          time: formData.time,
          duration: formData.duration,
          period: formData.period,
          days: formData.days,
        })
        setActivities([...activities, created])
      }

      resetForm()
    } catch (err) {
      console.error("Erro ao salvar rotina", err)
      setError("Erro ao salvar rotina. Verifique os dados e tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      time: "",
      duration: 15,
      period: "morning",
      days: [],
    })
    setEditingActivity(null)
    setIsDialogOpen(false)
    setError(null)
    setValidationErrors({})
  }

  const handleEdit = (activity: RoutineActivity) => {
    setEditingActivity(activity)
    setFormData({
      title: activity.title,
      description: activity.description || "",
      time: activity.time,
      duration: activity.duration,
      period: activity.period,
      days: activity.days,
    })
    setIsDialogOpen(true)
    setValidationErrors({})
    setError(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta atividade?")) {
      return
    }

    try {
      setIsLoading(true)
      await deleteRoutine(id)
      setActivities(activities.filter((activity) => activity.id !== id))
    } catch (err) {
      console.error("Erro ao deletar rotina", err)
      setError("Erro ao deletar rotina")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleComplete = async (id: number) => {
    try {
      const updated = await toggleRoutineComplete(id)
      setActivities(
        activities.map((activity) => (activity.id === id ? updated : activity)),
      )
    } catch (err) {
      console.error("Erro ao alternar conclusão", err)
    }
  }

  const toggleDay = (day: string) => {
    setFormData({
      ...formData,
      days: formData.days.includes(day) ? formData.days.filter((d) => d !== day) : [...formData.days, day],
    })
    if (validationErrors.days) {
      setValidationErrors({ ...validationErrors, days: "" })
    }
  }

  const filteredActivities = activities
    .filter((activity) => selectedPeriod === "all" || activity.period === selectedPeriod)
    .sort((a, b) => a.time.localeCompare(b.time))

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case "morning":
        return <Sunrise className="h-5 w-5" />
      case "afternoon":
        return <Sun className="h-5 w-5" />
      case "evening":
        return <Sunset className="h-5 w-5" />
      default:
        return null
    }
  }

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "morning":
        return "Manhã"
      case "afternoon":
        return "Tarde"
      case "evening":
        return "Noite"
      default:
        return ""
    }
  }

  const getPeriodColor = (period: string) => {
    switch (period) {
      case "morning":
        return "bg-orange-500/10 text-orange-700 border-orange-200"
      case "afternoon":
        return "bg-blue-500/10 text-blue-700 border-blue-200"
      case "evening":
        return "bg-purple-500/10 text-purple-700 border-purple-200"
      default:
        return ""
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:pl-64">
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Rotina"
            description="Organize suas atividades diárias e semanais"
            action={
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingActivity(null)
                      setError(null)
                      setValidationErrors({})
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Atividade
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>{editingActivity ? "Editar Atividade" : "Nova Atividade"}</DialogTitle>
                      <DialogDescription>
                        {editingActivity
                          ? "Atualize as informações da atividade"
                          : "Adicione uma nova atividade à sua rotina"}
                      </DialogDescription>
                    </DialogHeader>
                    {error && (
                      <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                        {error}
                      </div>
                    )}
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => {
                            setFormData({ ...formData, title: e.target.value })
                            if (validationErrors.title) {
                              setValidationErrors({ ...validationErrors, title: "" })
                            }
                            if (error) {
                              setError(null)
                            }
                          }}
                          placeholder="Ex: Meditação matinal"
                          required
                          className={validationErrors.title ? "border-red-500" : ""}
                          disabled={isLoading}
                        />
                        {validationErrors.title && (
                          <p className="text-sm text-red-500">{validationErrors.title}</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Detalhes da atividade"
                          rows={2}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="time">Horário *</Label>
                          <Input
                            id="time"
                            type="time"
                            value={formData.time}
                            onChange={(e) => {
                              setFormData({ ...formData, time: e.target.value })
                              if (validationErrors.time) {
                                setValidationErrors({ ...validationErrors, time: "" })
                              }
                              if (error) {
                                setError(null)
                              }
                            }}
                            required
                            className={validationErrors.time ? "border-red-500" : ""}
                            disabled={isLoading}
                          />
                          {validationErrors.time && (
                            <p className="text-sm text-red-500">{validationErrors.time}</p>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="duration">Duração (min) *</Label>
                          <Input
                            id="duration"
                            type="number"
                            min="5"
                            step="5"
                            value={formData.duration}
                            onChange={(e) => {
                              const value = Number.parseInt(e.target.value)
                              setFormData({ ...formData, duration: value })
                              if (validationErrors.duration) {
                                setValidationErrors({ ...validationErrors, duration: "" })
                              }
                              if (error) {
                                setError(null)
                              }
                            }}
                            required
                            className={validationErrors.duration ? "border-red-500" : ""}
                            disabled={isLoading}
                          />
                          {validationErrors.duration && (
                            <p className="text-sm text-red-500">{validationErrors.duration}</p>
                          )}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="period">Período *</Label>
                        <Select
                          value={formData.period}
                          onValueChange={(value) => {
                            setFormData({ ...formData, period: value as "morning" | "afternoon" | "evening" })
                            if (validationErrors.period) {
                              setValidationErrors({ ...validationErrors, period: "" })
                            }
                            if (error) {
                              setError(null)
                            }
                          }}
                          disabled={isLoading}
                        >
                          <SelectTrigger id="period" className={validationErrors.period ? "border-red-500" : ""}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Manhã</SelectItem>
                            <SelectItem value="afternoon">Tarde</SelectItem>
                            <SelectItem value="evening">Noite</SelectItem>
                          </SelectContent>
                        </Select>
                        {validationErrors.period && (
                          <p className="text-sm text-red-500">{validationErrors.period}</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label>Dias da Semana *</Label>
                        <div className="flex flex-wrap gap-2">
                          {daysOfWeek.map((day) => (
                            <Button
                              key={day.id}
                              type="button"
                              variant={formData.days.includes(day.id) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleDay(day.id)}
                              className="w-14"
                              disabled={isLoading}
                            >
                              {day.label}
                            </Button>
                          ))}
                        </div>
                        {validationErrors.days && (
                          <p className="text-sm text-red-500">{validationErrors.days}</p>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={resetForm} disabled={isLoading}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Salvando..." : editingActivity ? "Atualizar" : "Criar"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            }
          />

          {/* Period Filter */}
          <Tabs
            value={selectedPeriod}
            onValueChange={(value) => setSelectedPeriod(value as typeof selectedPeriod)}
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="morning">
                <Sunrise className="h-4 w-4 mr-2" />
                Manhã
              </TabsTrigger>
              <TabsTrigger value="afternoon">
                <Sun className="h-4 w-4 mr-2" />
                Tarde
              </TabsTrigger>
              <TabsTrigger value="evening">
                <Sunset className="h-4 w-4 mr-2" />
                Noite
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Activities List */}
          {isLoading && activities.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Carregando rotinas...</p>
              </CardContent>
            </Card>
          ) : filteredActivities.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Nenhuma atividade encontrada</p>
                <p className="text-sm text-muted-foreground mt-1">Adicione atividades para organizar sua rotina</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <Card key={activity.id} className={activity.completed ? "opacity-60" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleComplete(activity.id)}
                        className="mt-1 shrink-0 hover:scale-110 transition-transform"
                        disabled={isLoading}
                      >
                        {activity.completed ? (
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3
                              className={`text-lg font-semibold mb-1 ${
                                activity.completed ? "line-through text-muted-foreground" : "text-foreground"
                              }`}
                            >
                              {activity.title}
                            </h3>
                            {activity.description && (
                              <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(activity)}
                              className="h-8 w-8"
                              disabled={isLoading}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(activity.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={getPeriodColor(activity.period)}>
                            {getPeriodIcon(activity.period)}
                            <span className="ml-1.5">{getPeriodLabel(activity.period)}</span>
                          </Badge>
                          <Badge variant="outline">
                            {activity.time} • {activity.duration}min
                          </Badge>
                          <div className="flex gap-1">
                            {activity.days.map((day) => (
                              <Badge key={day} variant="secondary" className="text-xs px-1.5">
                                {daysOfWeek.find((d) => d.id === day)?.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

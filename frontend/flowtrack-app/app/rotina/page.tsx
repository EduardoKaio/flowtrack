"use client"

import type React from "react"

import { useState } from "react"
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

interface RoutineActivity {
  id: number
  title: string
  description: string
  time: string
  duration: number
  period: "morning" | "afternoon" | "evening"
  days: string[]
  completed: boolean
}

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
  const [activities, setActivities] = useState<RoutineActivity[]>([
    {
      id: 1,
      title: "Meditação",
      description: "10 minutos de meditação guiada",
      time: "06:30",
      duration: 10,
      period: "morning",
      days: ["seg", "ter", "qua", "qui", "sex"],
      completed: false,
    },
    {
      id: 2,
      title: "Exercícios",
      description: "Treino funcional",
      time: "07:00",
      duration: 30,
      period: "morning",
      days: ["seg", "qua", "sex"],
      completed: false,
    },
    {
      id: 3,
      title: "Revisão de Tarefas",
      description: "Planejar o dia",
      time: "09:00",
      duration: 15,
      period: "morning",
      days: ["seg", "ter", "qua", "qui", "sex"],
      completed: false,
    },
    {
      id: 4,
      title: "Almoço",
      description: "Refeição saudável",
      time: "12:30",
      duration: 45,
      period: "afternoon",
      days: ["seg", "ter", "qua", "qui", "sex"],
      completed: false,
    },
    {
      id: 5,
      title: "Leitura",
      description: "30 páginas do livro atual",
      time: "20:00",
      duration: 30,
      period: "evening",
      days: ["seg", "ter", "qua", "qui", "sex", "sab", "dom"],
      completed: false,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<RoutineActivity | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<"all" | "morning" | "afternoon" | "evening">("all")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
    duration: 15,
    period: "morning" as "morning" | "afternoon" | "evening",
    days: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingActivity) {
      setActivities(
        activities.map((activity) =>
          activity.id === editingActivity.id ? { ...activity, ...formData, completed: activity.completed } : activity,
        ),
      )
    } else {
      const newActivity: RoutineActivity = {
        id: Date.now(),
        ...formData,
        completed: false,
      }
      setActivities([...activities, newActivity])
    }
    resetForm()
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
  }

  const handleEdit = (activity: RoutineActivity) => {
    setEditingActivity(activity)
    setFormData({
      title: activity.title,
      description: activity.description,
      time: activity.time,
      duration: activity.duration,
      period: activity.period,
      days: activity.days,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setActivities(activities.filter((activity) => activity.id !== id))
  }

  const toggleComplete = (id: number) => {
    setActivities(
      activities.map((activity) => (activity.id === id ? { ...activity, completed: !activity.completed } : activity)),
    )
  }

  const toggleDay = (day: string) => {
    setFormData({
      ...formData,
      days: formData.days.includes(day) ? formData.days.filter((d) => d !== day) : [...formData.days, day],
    })
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
                  <Button onClick={() => setEditingActivity(null)}>
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
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Ex: Meditação matinal"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Detalhes da atividade"
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="time">Horário</Label>
                          <Input
                            id="time"
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="duration">Duração (min)</Label>
                          <Input
                            id="duration"
                            type="number"
                            min="5"
                            step="5"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="period">Período</Label>
                        <Select
                          value={formData.period}
                          onValueChange={(value) =>
                            setFormData({ ...formData, period: value as "morning" | "afternoon" | "evening" })
                          }
                        >
                          <SelectTrigger id="period">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Manhã</SelectItem>
                            <SelectItem value="afternoon">Tarde</SelectItem>
                            <SelectItem value="evening">Noite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Dias da Semana</Label>
                        <div className="flex flex-wrap gap-2">
                          {daysOfWeek.map((day) => (
                            <Button
                              key={day.id}
                              type="button"
                              variant={formData.days.includes(day.id) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleDay(day.id)}
                              className="w-14"
                            >
                              {day.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                      <Button type="submit">{editingActivity ? "Atualizar" : "Criar"}</Button>
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
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Nenhuma atividade encontrada</p>
                  <p className="text-sm text-muted-foreground mt-1">Adicione atividades para organizar sua rotina</p>
                </CardContent>
              </Card>
            ) : (
              filteredActivities.map((activity) => (
                <Card key={activity.id} className={activity.completed ? "opacity-60" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleComplete(activity.id)}
                        className="mt-1 shrink-0 hover:scale-110 transition-transform"
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
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(activity.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
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
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

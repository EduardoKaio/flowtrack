"use client"

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
import axios from "axios"

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
})

interface RoutineActivity {
  id: number
  title: string
  description: string
  duration: number
  period: "MORNING" | "AFTERNOON" | "EVENING"
  days: string
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
  const [activities, setActivities] = useState<RoutineActivity[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<RoutineActivity | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<"all" | "MORNING" | "AFTERNOON" | "EVENING">("all")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 15,
    period: "MORNING" as "MORNING" | "AFTERNOON" | "EVENING",
    days: [] as string[],
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRoutines() {
      try {
        const response = await api.get<RoutineActivity[]>("/routines/all")
        setActivities(response.data)
      } catch (err) {
        console.error("Erro ao carregar rotinas", err)
        setError("Erro ao carregar rotinas")
      }
    }
    loadRoutines()
  }, [])

  const resetForm = () => {
    setFormData({ title: "", description: "", duration: 15, period: "MORNING", days: [] })
    setEditingActivity(null)
    setIsDialogOpen(false)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        period: formData.period,
        days: formData.days.join(","), // Envia string separada por vírgula
      }

      if (editingActivity) {
        const response = await api.put<RoutineActivity>(`/routines/${editingActivity.id}`, payload)
        setActivities(activities.map(a => (a.id === response.data.id ? response.data : a)))
      } else {
        const response = await api.post<RoutineActivity>("/routines", payload)
        setActivities([...activities, response.data])
      }

      resetForm()
    } catch (err) {
      console.error("Erro ao salvar rotina", err)
      setError("Erro ao salvar rotina")
    }
  }

  const handleEdit = (activity: RoutineActivity) => {
    setEditingActivity(activity)
    setFormData({
      title: activity.title,
      description: activity.description,
      duration: activity.duration,
      period: activity.period,
      days: activity.days.split(","), // Converte string em array para os botões
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/routines/${id}`)
      setActivities(activities.filter(a => a.id !== id))
    } catch (err) {
      console.error("Erro ao deletar rotina", err)
      setError("Erro ao deletar rotina")
    }
  }

  const toggleComplete = async (id: number) => {
    try {
      const response = await api.patch<RoutineActivity>(`/routines/${id}/toggle`)
      setActivities(activities.map(a => (a.id === response.data.id ? response.data : a)))
    } catch (err) {
      console.error("Erro ao alternar conclusão", err)
      setError("Erro ao alternar conclusão")
    }
  }

  const toggleDay = (day: string) => {
    setFormData({
      ...formData,
      days: formData.days.includes(day) ? formData.days.filter(d => d !== day) : [...formData.days, day],
    })
  }

  const filteredActivities = activities
    .filter(a => selectedPeriod === "all" || a.period === selectedPeriod)
    .sort((a, b) => a.title.localeCompare(b.title))

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
                    <Plus className="h-4 w-4 mr-2" /> Nova Atividade
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>{editingActivity ? "Editar Atividade" : "Nova Atividade"}</DialogTitle>
                      <DialogDescription>
                        {editingActivity ? "Atualize as informações da atividade" : "Adicione uma nova atividade"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Título</Label>
                        <Input
                          value={formData.title}
                          onChange={e => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Descrição</Label>
                        <Textarea
                          value={formData.description}
                          onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Duração (min)</Label>
                        <Input
                          type="number"
                          min={5}
                          step={5}
                          value={formData.duration}
                          onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Período</Label>
                        <Select value={formData.period} onValueChange={v => setFormData({ ...formData, period: v as any })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MORNING">Manhã</SelectItem>
                            <SelectItem value="AFTERNOON">Tarde</SelectItem>
                            <SelectItem value="EVENING">Noite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Dias da Semana</Label>
                        <div className="flex flex-wrap gap-2">
                          {daysOfWeek.map(day => (
                            <Button
                              key={day.id}
                              type="button"
                              variant={formData.days.includes(day.id) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleDay(day.id)}
                            >
                              {day.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
                      <Button type="submit">{editingActivity ? "Atualizar" : "Criar"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            }
          />
          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

          <Tabs value={selectedPeriod} onValueChange={v => setSelectedPeriod(v as any)} className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="MORNING"><Sunrise className="h-4 w-4 mr-2" />Manhã</TabsTrigger>
              <TabsTrigger value="AFTERNOON"><Sun className="h-4 w-4 mr-2" />Tarde</TabsTrigger>
              <TabsTrigger value="EVENING"><Sunset className="h-4 w-4 mr-2" />Noite</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <Card><CardContent className="py-12 text-center">Nenhuma atividade encontrada</CardContent></Card>
            ) : (
              filteredActivities.map(a => (
                <Card key={a.id} className={a.completed ? "opacity-60" : ""}>
                  <CardContent className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="ghost" size="icon" onClick={() => toggleComplete(a.id)}>
                        {a.completed ? <CheckCircle2 /> : <Circle />}
                      </Button>
                      <div>
                        <h3 className={a.completed ? "line-through" : ""}>{a.title}</h3>
                        <p className="text-sm text-muted-foreground">{a.description}</p>
                        <Badge variant="outline">{a.period} • {a.duration}min</Badge>
                        {a.days && <Badge variant="secondary">{a.days}</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(a)}><Edit /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}><Trash2 /></Button>
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

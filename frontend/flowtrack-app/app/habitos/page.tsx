"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Trash2, Edit, Target, CheckCircle2, Circle, Flame } from "lucide-react"

interface Habit {
  id: number
  name: string
  description: string
  frequency: "diario" | "semanal"
  goal: number
  icon: string
  color: string
}

interface HabitProgress {
  habitId: number
  completedDays: string[]
  currentStreak: number
  bestStreak: number
}

const iconOptions = [
  { value: "💪", label: "Exercício" },
  { value: "📚", label: "Leitura" },
  { value: "💧", label: "Água" },
  { value: "🧘", label: "Meditação" },
  { value: "🎯", label: "Meta" },
  { value: "✍️", label: "Escrita" },
  { value: "🎨", label: "Arte" },
  { value: "🎵", label: "Música" },
]

const colorOptions = [
  { value: "bg-blue-500", label: "Azul" },
  { value: "bg-purple-500", label: "Roxo" },
  { value: "bg-green-500", label: "Verde" },
  { value: "bg-orange-500", label: "Laranja" },
  { value: "bg-pink-500", label: "Rosa" },
  { value: "bg-red-500", label: "Vermelho" },
  { value: "bg-teal-500", label: "Azul-petróleo" },
  { value: "bg-yellow-500", label: "Amarelo" },
]

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 1,
      name: "Exercícios Físicos",
      description: "30 minutos de atividade física",
      frequency: "diario",
      goal: 7,
      icon: "💪",
      color: "bg-green-500",
    },
    {
      id: 2,
      name: "Ler 30 páginas",
      description: "Leitura diária para desenvolvimento",
      frequency: "diario",
      goal: 7,
      icon: "📚",
      color: "bg-purple-500",
    },
    {
      id: 3,
      name: "Meditar",
      description: "10 minutos de meditação",
      frequency: "diario",
      goal: 7,
      icon: "🧘",
      color: "bg-blue-500",
    },
  ])

  const [progress, setProgress] = useState<HabitProgress[]>([
    {
      habitId: 1,
      completedDays: ["2025-10-13", "2025-10-14", "2025-10-15"],
      currentStreak: 3,
      bestStreak: 5,
    },
    {
      habitId: 2,
      completedDays: ["2025-10-14", "2025-10-15"],
      currentStreak: 2,
      bestStreak: 7,
    },
    {
      habitId: 3,
      completedDays: ["2025-10-15"],
      currentStreak: 1,
      bestStreak: 4,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    frequency: "diario" as "diario" | "semanal",
    goal: 7,
    icon: "🎯",
    color: "bg-blue-500",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingHabit) {
      setHabits(habits.map((habit) => (habit.id === editingHabit.id ? { ...habit, ...formData } : habit)))
    } else {
      const newHabit: Habit = {
        id: Date.now(),
        ...formData,
      }
      setHabits([...habits, newHabit])
      setProgress([
        ...progress,
        {
          habitId: newHabit.id,
          completedDays: [],
          currentStreak: 0,
          bestStreak: 0,
        },
      ])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      frequency: "diario",
      goal: 7,
      icon: "🎯",
      color: "bg-blue-500",
    })
    setEditingHabit(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setFormData({
      name: habit.name,
      description: habit.description,
      frequency: habit.frequency,
      goal: habit.goal,
      icon: habit.icon,
      color: habit.color,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setHabits(habits.filter((habit) => habit.id !== id))
    setProgress(progress.filter((p) => p.habitId !== id))
  }

  const toggleHabitToday = (habitId: number) => {
    const today = new Date().toISOString().split("T")[0]
    setProgress(
      progress.map((p) => {
        if (p.habitId === habitId) {
          const isCompleted = p.completedDays.includes(today)
          const newCompletedDays = isCompleted
            ? p.completedDays.filter((day) => day !== today)
            : [...p.completedDays, today]

          const newStreak = isCompleted ? Math.max(0, p.currentStreak - 1) : p.currentStreak + 1

          return {
            ...p,
            completedDays: newCompletedDays,
            currentStreak: newStreak,
            bestStreak: Math.max(p.bestStreak, newStreak),
          }
        }
        return p
      }),
    )
  }

  const getHabitProgress = (habitId: number) => {
    return progress.find((p) => p.habitId === habitId)
  }

  const isCompletedToday = (habitId: number) => {
    const today = new Date().toISOString().split("T")[0]
    const habitProgress = getHabitProgress(habitId)
    return habitProgress?.completedDays.includes(today) || false
  }

  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date.toISOString().split("T")[0])
    }
    return days
  }

  const getWeekdayLabel = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", { weekday: "short" }).charAt(0).toUpperCase()
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:pl-64">
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Hábitos"
            description="Acompanhe seus hábitos diários e construa uma rotina consistente"
            action={
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingHabit(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Hábito
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>{editingHabit ? "Editar Hábito" : "Novo Hábito"}</DialogTitle>
                      <DialogDescription>
                        {editingHabit
                          ? "Atualize as informações do hábito"
                          : "Crie um novo hábito para acompanhar diariamente"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nome do Hábito</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ex: Exercícios, Leitura, Meditação"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Descreva seu hábito"
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="frequency">Frequência</Label>
                          <Select
                            value={formData.frequency}
                            onValueChange={(value) =>
                              setFormData({ ...formData, frequency: value as "diario" | "semanal" })
                            }
                          >
                            <SelectTrigger id="frequency">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="diario">Diário</SelectItem>
                              <SelectItem value="semanal">Semanal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="goal">Meta (dias)</Label>
                          <Input
                            id="goal"
                            type="number"
                            min="1"
                            max="30"
                            value={formData.goal}
                            onChange={(e) => setFormData({ ...formData, goal: Number.parseInt(e.target.value) })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Ícone</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {iconOptions.map((icon) => (
                            <button
                              key={icon.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, icon: icon.value })}
                              className={`h-12 rounded-lg border-2 transition-all text-2xl ${
                                formData.icon === icon.value
                                  ? "border-foreground scale-105 bg-muted"
                                  : "border-border hover:scale-105 hover:bg-muted"
                              }`}
                              title={icon.label}
                            >
                              {icon.value}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Cor</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, color: color.value })}
                              className={`h-12 rounded-lg border-2 transition-all ${color.value} ${
                                formData.color === color.value
                                  ? "border-foreground scale-105"
                                  : "border-transparent hover:scale-105"
                              }`}
                              title={color.label}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                      <Button type="submit">{editingHabit ? "Atualizar" : "Criar"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            }
          />

          <div className="space-y-6">
            {habits.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum hábito criado ainda</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Crie seu primeiro hábito para começar a acompanhar seu progresso
                  </p>
                </CardContent>
              </Card>
            ) : (
              habits.map((habit) => {
                const habitProgress = getHabitProgress(habit.id)
                const completedToday = isCompletedToday(habit.id)
                const last7Days = getLast7Days()

                return (
                  <Card key={habit.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`h-14 w-14 rounded-xl ${habit.color} flex items-center justify-center text-3xl`}
                          >
                            {habit.icon}
                          </div>
                          <div>
                            <CardTitle className="text-xl">{habit.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="outline">{habit.frequency === "diario" ? "Diário" : "Semanal"}</Badge>
                              <div className="flex items-center gap-1.5 text-sm">
                                <Flame className="h-4 w-4 text-orange-500" />
                                <span className="font-semibold">{habitProgress?.currentStreak || 0}</span>
                                <span className="text-muted-foreground">dias seguidos</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Melhor: {habitProgress?.bestStreak || 0} dias
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(habit)} className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(habit.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {last7Days.map((day) => {
                            const isCompleted = habitProgress?.completedDays.includes(day)
                            return (
                              <div key={day} className="flex flex-col items-center gap-1">
                                <span className="text-xs text-muted-foreground">{getWeekdayLabel(day)}</span>
                                <div
                                  className={`h-10 w-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                                    isCompleted
                                      ? `${habit.color} border-transparent`
                                      : "border-border bg-muted hover:bg-muted/80"
                                  }`}
                                >
                                  {isCompleted && <CheckCircle2 className="h-5 w-5 text-white" />}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <Button
                          size="lg"
                          variant={completedToday ? "outline" : "default"}
                          onClick={() => toggleHabitToday(habit.id)}
                          className="ml-4"
                        >
                          {completedToday ? (
                            <>
                              <CheckCircle2 className="h-5 w-5 mr-2" />
                              Concluído Hoje
                            </>
                          ) : (
                            <>
                              <Circle className="h-5 w-5 mr-2" />
                              Marcar como Feito
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

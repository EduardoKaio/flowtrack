"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Clock, Smile, Target, Zap, Plus, Timer, Heart, BarChart3 } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardPage() {
  const router = useRouter()
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [taskFormData, setTaskFormData] = useState({
    title: "",
    description: "",
    priority: "media",
    category: "trabalho",
  })

  const todayStats = {
    tasksCompleted: 8,
    tasksTotal: 12,
    focusTime: 145,
    habitsCompleted: 5,
    habitsTotal: 7,
    mood: "Ótimo",
  }

  const todayTasks = [
    { id: 1, title: "Revisar relatório mensal", completed: true, category: "Trabalho" },
    { id: 2, title: "Estudar React avançado", completed: true, category: "Estudo" },
    { id: 3, title: "Fazer exercícios físicos", completed: false, category: "Saúde" },
    { id: 4, title: "Ler 30 páginas do livro", completed: false, category: "Lazer" },
  ]

  const tasksProgress = (todayStats.tasksCompleted / todayStats.tasksTotal) * 100
  const habitsProgress = (todayStats.habitsCompleted / todayStats.habitsTotal) * 100

  const handleQuickTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Nova tarefa criada:", taskFormData)
    setTaskFormData({ title: "", description: "", priority: "media", category: "trabalho" })
    setIsNewTaskDialogOpen(false)
  }

  const handleStartFocus = () => {
    localStorage.setItem("autoStartTimer", "true")
    router.push("/foco")
  }

  const handleNewTask = () => {
    localStorage.setItem("openNewTaskDialog", "true")
    router.push("/tarefas")
  }

  const handleRegisterMood = () => {
    localStorage.setItem("openMoodDialog", "true")
    router.push("/bem-estar")
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:pl-64">
        <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <PageHeader title="Dashboard" description="Resumo do seu dia e progresso geral" />

            <Card className="mb-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    onClick={handleNewTask}
                    className="w-full h-24 flex flex-col gap-2 bg-transparent border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group"
                  >
                    <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Nova Tarefa</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleStartFocus}
                    className="w-full h-24 flex flex-col gap-2 bg-transparent border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400 dark:hover:border-green-500 transition-all cursor-pointer group"
                  >
                    <Timer className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Iniciar Foco</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRegisterMood}
                    className="w-full h-24 flex flex-col gap-2 bg-transparent border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-500 hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950 dark:hover:text-pink-400 dark:hover:border-pink-500 transition-all cursor-pointer group"
                  >
                    <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Registrar Humor</span>
                  </Button>
                  <Link href="/relatorios" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-24 flex flex-col gap-2 bg-transparent border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 dark:hover:text-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer group"
                    >
                      <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Ver Relatório</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleQuickTaskSubmit}>
                  <DialogHeader>
                    <DialogTitle>Nova Tarefa</DialogTitle>
                    <DialogDescription>Crie uma nova tarefa rapidamente</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quick-title">Título</Label>
                      <Input
                        id="quick-title"
                        value={taskFormData.title}
                        onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                        placeholder="Ex: Revisar relatório"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="quick-description">Descrição</Label>
                      <Textarea
                        id="quick-description"
                        value={taskFormData.description}
                        onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                        placeholder="Detalhes da tarefa"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="quick-priority">Prioridade</Label>
                        <Select
                          value={taskFormData.priority}
                          onValueChange={(value) => setTaskFormData({ ...taskFormData, priority: value })}
                        >
                          <SelectTrigger id="quick-priority">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="baixa">Baixa</SelectItem>
                            <SelectItem value="media">Média</SelectItem>
                            <SelectItem value="alta">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="quick-category">Categoria</Label>
                        <Select
                          value={taskFormData.category}
                          onValueChange={(value) => setTaskFormData({ ...taskFormData, category: value })}
                        >
                          <SelectTrigger id="quick-category">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="trabalho">Trabalho</SelectItem>
                            <SelectItem value="estudo">Estudo</SelectItem>
                            <SelectItem value="saude">Saúde</SelectItem>
                            <SelectItem value="lazer">Lazer</SelectItem>
                            <SelectItem value="pessoal">Pessoal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Criar Tarefa</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tarefas Concluídas</CardTitle>
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {todayStats.tasksCompleted}/{todayStats.tasksTotal}
                  </div>
                  <Progress value={tasksProgress} className="mt-3" />
                  <p className="text-xs text-muted-foreground mt-2">{Math.round(tasksProgress)}% do dia completo</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Focado</CardTitle>
                  <Clock className="h-5 w-5 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{todayStats.focusTime}min</div>
                  <p className="text-xs text-muted-foreground mt-2">~6 sessões Pomodoro</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Hábitos Cumpridos</CardTitle>
                  <Target className="h-5 w-5 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {todayStats.habitsCompleted}/{todayStats.habitsTotal}
                  </div>
                  <Progress value={habitsProgress} className="mt-3" />
                  <p className="text-xs text-muted-foreground mt-2">Continue assim! 🔥</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Tarefas de Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todayTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 rounded-lg border border-border p-3 hover:bg-accent/5 hover:border-accent/30 transition-colors"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              task.completed ? "line-through text-muted-foreground" : "text-foreground"
                            }`}
                          >
                            {task.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{task.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smile className="h-5 w-5 text-accent" />
                    Bem-estar Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">😊</div>
                    <p className="text-2xl font-semibold text-foreground mb-2">{todayStats.mood}</p>
                    <p className="text-sm text-muted-foreground">Você está tendo um ótimo dia!</p>
                  </div>
                  <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm text-foreground font-medium mb-1">💡 Sugestão de autocuidado</p>
                    <p className="text-sm text-muted-foreground">Que tal fazer uma pausa de 5 minutos para alongar?</p>
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

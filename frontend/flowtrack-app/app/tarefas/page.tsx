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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Plus, Trash2, Edit, CalendarIcon, Search, Filter } from "lucide-react"

interface Task {
  id: number
  title: string
  description: string
  category: string
  priority: "baixa" | "média" | "alta"
  dueDate: string
  completed: boolean
}

const categories = [
  { id: "trabalho", name: "Trabalho", color: "bg-blue-500" },
  { id: "estudo", name: "Estudo", color: "bg-purple-500" },
  { id: "saude", name: "Saúde", color: "bg-green-500" },
  { id: "lazer", name: "Lazer", color: "bg-orange-500" },
  { id: "pessoal", name: "Pessoal", color: "bg-pink-500" },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Revisar relatório mensal",
      description: "Analisar métricas e preparar apresentação",
      category: "trabalho",
      priority: "alta",
      dueDate: "2025-10-16",
      completed: false,
    },
    {
      id: 2,
      title: "Estudar React avançado",
      description: "Completar módulo sobre hooks customizados",
      category: "estudo",
      priority: "média",
      dueDate: "2025-10-17",
      completed: false,
    },
    {
      id: 3,
      title: "Fazer exercícios físicos",
      description: "30 minutos de corrida",
      category: "saude",
      priority: "alta",
      dueDate: "2025-10-15",
      completed: true,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("todas")
  const [filterStatus, setFilterStatus] = useState<string>("todas")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "trabalho",
    priority: "média" as "baixa" | "média" | "alta",
    dueDate: "",
  })

  useEffect(() => {
    const openDialog = localStorage.getItem("openNewTaskDialog")
    if (openDialog === "true") {
      setIsDialogOpen(true)
      localStorage.removeItem("openNewTaskDialog")
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTask) {
      setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...task, ...formData } : task)))
    } else {
      const newTask: Task = {
        id: Date.now(),
        ...formData,
        completed: false,
      }
      setTasks([...tasks, newTask])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "trabalho",
      priority: "média",
      dueDate: "",
    })
    setEditingTask(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      dueDate: task.dueDate,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleComplete = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const filteredTasks = tasks.filter((task) => {
    const categoryMatch = filterCategory === "todas" || task.category === filterCategory
    const statusMatch =
      filterStatus === "todas" ||
      (filterStatus === "concluidas" && task.completed) ||
      (filterStatus === "pendentes" && !task.completed)
    const searchMatch =
      searchQuery === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    return categoryMatch && statusMatch && searchMatch
  })

  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || "bg-gray-500"
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || categoryId
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-red-500/10 text-red-700 border-red-200"
      case "média":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200"
      case "baixa":
        return "bg-green-500/10 text-green-700 border-green-200"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:pl-64">
        <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <PageHeader
              title="Tarefas"
              description="Gerencie suas tarefas e organize seu dia"
              action={
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingTask(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Tarefa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSubmit}>
                      <DialogHeader>
                        <DialogTitle>{editingTask ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
                        <DialogDescription>
                          {editingTask ? "Atualize as informações da tarefa" : "Adicione uma nova tarefa à sua lista"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Título</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="category">Categoria</Label>
                            <Select
                              value={formData.category}
                              onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                              <SelectTrigger id="category">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="priority">Prioridade</Label>
                            <Select
                              value={formData.priority}
                              onValueChange={(value) =>
                                setFormData({ ...formData, priority: value as "baixa" | "média" | "alta" })
                              }
                            >
                              <SelectTrigger id="priority">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="baixa">Baixa</SelectItem>
                                <SelectItem value="média">Média</SelectItem>
                                <SelectItem value="alta">Alta</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="dueDate">Data de Vencimento</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancelar
                        </Button>
                        <Button type="submit">{editingTask ? "Atualizar" : "Criar"}</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              }
            />

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar tarefas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="sm:w-auto bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                    {(filterCategory !== "todas" || filterStatus !== "todas") && (
                      <Badge
                        variant="secondary"
                        className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                      >
                        {(filterCategory !== "todas" ? 1 : 0) + (filterStatus !== "todas" ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-3">Filtrar Tarefas</h4>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="filter-category" className="text-sm">
                        Categoria
                      </Label>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger id="filter-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="filter-status" className="text-sm">
                        Status
                      </Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger id="filter-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas</SelectItem>
                          <SelectItem value="pendentes">Pendentes</SelectItem>
                          <SelectItem value="concluidas">Concluídas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {(filterCategory !== "todas" || filterStatus !== "todas") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFilterCategory("todas")
                          setFilterStatus("todas")
                        }}
                        className="w-full"
                      >
                        Limpar Filtros
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
                  </CardContent>
                </Card>
              ) : (
                filteredTasks.map((task) => (
                  <Card key={task.id} className={task.completed ? "opacity-60" : ""}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleComplete(task.id)}
                          className="mt-1 shrink-0 hover:scale-110 transition-transform"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3
                              className={`text-lg font-semibold ${
                                task.completed ? "line-through text-muted-foreground" : "text-foreground"
                              }`}
                            >
                              {task.title}
                            </h3>
                            <div className="flex gap-2 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(task)}
                                className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(task.id)}
                                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {task.description && <p className="text-sm text-muted-foreground mb-3">{task.description}</p>}
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className={getCategoryColor(task.category)}>
                              <div className={`h-2 w-2 rounded-full ${getCategoryColor(task.category)} mr-1.5`} />
                              {getCategoryName(task.category)}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </Badge>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <CalendarIcon className="h-3.5 w-3.5" />
                              {new Date(task.dueDate).toLocaleDateString("pt-BR")}
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
        </div>
      </main>
    </div>
  )
}

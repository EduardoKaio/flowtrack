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
import { Task, getAllTasks, createTask, updateTask, deleteTask, toggleTaskCompletion, searchTasks } from "@/lib/api/tasks"

const categories = [
  { id: "trabalho", name: "Trabalho", color: "bg-blue-500" },
  { id: "estudo", name: "Estudo", color: "bg-purple-500" },
  { id: "saude", name: "Saúde", color: "bg-green-500" },
  { id: "lazer", name: "Lazer", color: "bg-orange-500" },
  { id: "pessoal", name: "Pessoal", color: "bg-pink-500" },
]

const PRIORITY_ID_MAP: Record<string, number> = {
  "baixa": 0,
  "media": 1,
  "alta": 2
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const fetchList = async (pageLoad: number = page, sizeLoad: number = size) => {
    const p = Math.max(0, pageLoad)
    setLoading(true)

    try {
      let resp
      if (searchQuery) {
        resp = await searchTasks(searchQuery, { page: p, size: sizeLoad })
      } else {
        resp = await getAllTasks({ page: p, size: sizeLoad })
      }

      setTasks(resp.content)
      setPage(resp.number)
      setSize(resp.size)
      setTotalPages(resp.totalPages)
      setTotalElements(resp.totalElements)
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList(0)
  }, [])

  const fetchFilteredTasks = async () => {
    if (!searchQuery) return
    if (searchQuery.trim() === "") {
      fetchList(0)
      return
    }

    await fetchList(0)
  }

  const clearFilter = async () => {
    setSearchQuery("")

    await fetchList(0)
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("todas")
  const [filterStatus, setFilterStatus] = useState<string>("todas")

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "trabalho",
    prioridade: "media",
    dataConclusao: "",
  })

  useEffect(() => {
    const openDialog = localStorage.getItem("openNewTaskDialog")
    if (openDialog === "true") {
      setIsDialogOpen(true)
      localStorage.removeItem("openNewTaskDialog")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {

      const newTask = await createTask({
        titulo: formData.titulo,
        descricao: formData.descricao,
        categoria: "trabalho",
        prioridade: PRIORITY_ID_MAP[formData.prioridade],
        dataConclusao: formData.dataConclusao,
        concluida: false,
      })

      setTasks([...tasks, newTask])
      resetForm()
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      categoria: "trabalho",
      prioridade: "media",
      dataConclusao: "",
    })
    setEditingTask(null)
    setIsDialogOpen(false)
  }

  const startFormEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      titulo: task.titulo,
      descricao: task.descricao,
      categoria: "trabalho",
      prioridade: task.prioridade.toLocaleLowerCase(),
      dataConclusao: task.dataConclusao,
    })
    setIsDialogOpen(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTask) return

    try {
      const payload = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        categoria: "trabalho",
        prioridade: PRIORITY_ID_MAP[formData.prioridade],
        dataConclusao: formData.dataConclusao,
      }

      const updatedTask = await updateTask(editingTask.id, payload)
      setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t))
      resetForm()
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error)
    }
  }

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId)
      setTasks(tasks.filter(t => t.id !== taskId))
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error)
    }
  }

  const toggleComplete = async (id: number) => {
    try {
      await toggleTaskCompletion(id)
      setTasks(tasks.map(t => t.id === id ? { ...t, concluida: !t.concluida } : t))
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error)
    }
  }

  // Filtro local agora só para categoria e status
  const filteredTasks = tasks.filter((task) => {
    const categoryMatch = filterCategory === "todas" || task.categoria === filterCategory
    const statusMatch =
      filterStatus === "todas" ||
      (filterStatus === "concluidas" && task.concluida) ||
      (filterStatus === "pendentes" && !task.concluida)
    return categoryMatch && statusMatch
  })

  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || "bg-gray-500"
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || categoryId
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "ALTA":
        return "bg-red-500/10 text-red-700 border-red-200"
      case "MEDIA":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200"
      case "BAIXA":
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
                    <form onSubmit={editingTask ? handleUpdate : handleSubmit}>
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
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="category">Categoria</Label>
                            <Select
                              value={formData.categoria}
                              onValueChange={(value) => setFormData({ ...formData, categoria: value })}
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
                              value={formData.prioridade}
                              onValueChange={(value) =>
                                setFormData({ ...formData, prioridade: value })
                              }
                            >
                              <SelectTrigger id="priority">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="baixa">Baixa</SelectItem>
                                <SelectItem value="media">Média</SelectItem>
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
                            value={formData.dataConclusao}
                            onChange={(e) => setFormData({ ...formData, dataConclusao: e.target.value })}
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
                  <Card key={task.id} className={task.concluida ? "opacity-60" : ""}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleComplete(task.id)}
                          className="mt-1 shrink-0 hover:scale-110 transition-transform"
                        >
                          {task.concluida ? (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3
                              className={`text-lg font-semibold ${task.concluida ? "line-through text-muted-foreground" : "text-foreground"
                                }`}
                            >
                              {task.titulo}
                            </h3>
                            <div className="flex gap-2 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startFormEdit(task)}
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
                          {task.descricao && <p className="text-sm text-muted-foreground mb-3">{task.descricao}</p>}
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className={getCategoryColor(task.categoria)}>
                              <div className={`h-2 w-2 rounded-full ${getCategoryColor(task.categoria)} mr-1.5`} />
                              {getCategoryName(task.categoria)}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(task.prioridade)}>
                              {task.prioridade.charAt(0).toUpperCase() + task.prioridade.slice(1)}
                            </Badge>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <CalendarIcon className="h-3.5 w-3.5" />
                              {new Date(task.dataConclusao).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            {/* Paginação */}
            <div className="flex justify-center items-center gap-2 pt-4 border-t border-border">
             
              <Button
                variant="outline"
                onClick={() => fetchList(page - 1, size)}
                disabled={loading || page <= 0}
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
                      disabled={loading}
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
                disabled={loading || page + 1 >= totalPages}
              >
                Próximo
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
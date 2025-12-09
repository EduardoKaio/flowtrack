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
import { CheckCircle2, Circle, Plus, Trash2, Edit, CalendarIcon, Search, Filter, Loader2 } from "lucide-react"
import { Task, getAllTasks, createTask, updateTask, deleteTask, toggleTaskCompletion, searchTasks, Category } from "@/lib/api/tasks"
import { getCategories } from "@/lib/api"
import { getTodayLocalDate } from "@/lib/utils/date"

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
  const [categories, setCategories] = useState<Category[]>([])

  const fetchList = async (pageLoad: number = page, sizeLoad: number = size, queryOverride?: string) => {
  const p = Math.max(0, pageLoad);
  setLoading(true);
  setError(null);

  const activeQuery = queryOverride !== undefined ? queryOverride : searchQuery;

  try {
    let resp;
    if (activeQuery) {
      resp = await searchTasks(activeQuery, { page: p, size: sizeLoad });
    } else {
      resp = await getAllTasks({ page: p, size: sizeLoad });
    }

    if (!resp || !resp.content) {
      console.error("Resposta inválida da API:", resp);
      setTasks([]);
      setPage(0);
      setSize(sizeLoad);
      setTotalPages(0);
      setTotalElements(0);
      setError("Não foi possível carregar as tarefas. Verifique sua conexão e tente novamente.");
      return;
    }

    setTasks(resp.content as Task[]);
    setPage(resp.number);
    setSize(resp.size);
    setTotalPages(resp.totalPages);
    setTotalElements(resp.totalElements);
  } catch (err: any) {
    console.error("Erro ao carregar tarefas:", err);
    setTasks([]);
    setPage(0);
    setSize(sizeLoad);
    setTotalPages(0);
    setTotalElements(0);
    setError(err?.message || "Não foi possível carregar as tarefas. Verifique sua conexão e tente novamente.");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const resp = await getCategories();

        if (!resp || !Array.isArray(resp)) {
          console.error("Resposta inválida de categorias:", resp);
          setCategories([]);
          setError("Não foi possível carregar as categorias.");
          return;
        }

        setCategories(resp);
      } catch (err: any) {
        console.error("Erro ao carregar todas as categorias:", err);
        setCategories([]);
        setError(err?.message || "Não foi possível carregar as categorias.");
      }
    };

    fetchAllCategories();
  }, []);

  useEffect(() => {
    fetchList(0);
  }, []);

  const fetchFilteredTasks = async () => {
    if (!searchQuery) return
    if (searchQuery.trim() === "") {
      fetchList(0)
      return
    }

    await fetchList(0)
  }

  const clearFilter = async () => {
    setSearchQuery("");

    setFilterCategory("todas");
    setFilterStatus("todas");
    
    await fetchList(0, size, ""); 
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("todas")
  const [filterStatus, setFilterStatus] = useState<string>("todas")

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "trabalho",
    prioridade: "media",
    dataConclusao: getTodayLocalDate(),
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
    setError(null)

    if (formData.dataConclusao) {
        const selectedDate = new Date(formData.dataConclusao + "T12:00:00");
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            setError("A data de conclusão não pode ser anterior a hoje.");
            return;
        }
    }

    try {
      let selectedCategory = categories.find(c => c.name === formData.categoria);

      const taskPayload = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        categoriaId: selectedCategory?.id,
        prioridade: PRIORITY_ID_MAP[formData.prioridade],
        dataConclusao: formData.dataConclusao,
        concluida: false,
      }

      const newTask = await createTask(taskPayload)

      setTasks([...tasks, newTask])
      resetForm()
    } catch (error) {
      console.error("[TAREFAS] Erro ao criar tarefa:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      categoria: "trabalho",
      prioridade: "media",
      dataConclusao: getTodayLocalDate(),
    })
    setEditingTask(null)
    setIsDialogOpen(false)
  }

  const startFormEdit = (task: Task) => {
    setEditingTask(task)
    const categoryName = categories.find(c => c.id === task.categoriaId)?.name || "trabalho";
    setFormData({
      titulo: task.titulo,
      descricao: task.descricao,
      categoria: categoryName,
      prioridade: task.prioridade.toLocaleLowerCase(),
      dataConclusao: task.dataConclusao,
    })
    setIsDialogOpen(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTask) return

    try {
      let selectedCategory = categories.find(c => c.name === formData.categoria);
      const payload = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        categoriaId: selectedCategory?.id,
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
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      
      setFilterCategory("todas");
      setFilterStatus("todas");
      
      fetchList(0); 
    }
  };

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

    const selectedCategory = categories.find(c => c.name === filterCategory);

    const categoryMatch = filterCategory === "todas" || task.categoriaId === selectedCategory?.id
    const statusMatch =
      filterStatus === "todas" ||
      (filterStatus === "concluidas" && task.concluida) ||
      (filterStatus === "pendentes" && !task.concluida)
    return categoryMatch && statusMatch
  })

  const getCategoryColor = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.color || "bg-gray-500"
  }

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || "Null"
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

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:pl-64 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    )
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
                                {(categories || []).map((cat) => (
                                  <SelectItem key={cat.id} value={cat.name}>
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
                      {error && (
                        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                          {error}
                        </div>
                      )}
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
                  onKeyDown={handleSearchKeyDown} 
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
                          {(categories || []).map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
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
                            <Badge variant="outline" className={getCategoryColor(task.categoriaId)}>
                              <div className={`h-2 w-2 rounded-full ${getCategoryColor(task.categoriaId)} mr-1.5`} />
                              {getCategoryName(task.categoriaId)}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(task.prioridade)}>
                              {task.prioridade.charAt(0).toUpperCase() + task.prioridade.slice(1)}
                            </Badge>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <CalendarIcon className="h-3.5 w-3.5" />
                              {task.dataConclusao ? (() => {
                                // Converter string YYYY-MM-DD para formato brasileiro DD/MM/YYYY
                                const [year, month, day] = task.dataConclusao.split('-')
                                return `${day}/${month}/${year}`
                              })() : 'Sem data'}
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
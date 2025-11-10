"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import { Plus, Trash2, Edit, Bell, Clock, X, CheckCircle, RotateCcw } from "lucide-react"
import { toast } from "sonner"

interface Reminder {
  id: number
  titulo: string
  descricao: string
  dataHora: string
  ativo: boolean
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)
  const [activeReminderPopup, setActiveReminderPopup] = useState<Reminder | null>(null)

  // FORM DATA SEM usuárioEmail
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    dataHora: "",
    ativo: true,
  })

  const activeTimersRef = useRef<Map<number, NodeJS.Timeout>>(new Map())

  const API_BASE = "http://localhost:8080/api/reminders"

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    loadReminders()
  }, [])

  useEffect(() => {
    activeTimersRef.current.forEach((t) => clearTimeout(t))
    activeTimersRef.current.clear()

    reminders.forEach((reminder) => {
      if (reminder.ativo) startReminderTimer(reminder)
    })
  }, [reminders])

  const getUserID = () => {
    return localStorage.getItem("userID") || "1" // modificar conforme login real
  }

  const axiosConfig = () => ({
    headers: {
      userID: getUserID(),
      "Content-Type": "application/json",
    },
  })

  const loadReminders = async () => {
    try {
      const response = await axios.get(API_BASE, axiosConfig())
      setReminders(response.data || [])  // Alterado para response.data diretamente
    } catch (error) {
      toast.error("Erro ao carregar lembretes")
    }
  }

  const startReminderTimer = (reminder: Reminder) => {
    if (activeTimersRef.current.has(reminder.id)) {
      clearTimeout(activeTimersRef.current.get(reminder.id))
    }

    const delay = new Date(reminder.dataHora).getTime() - Date.now()

    if (delay > 0) {
      const t = setTimeout(() => triggerReminder(reminder), delay)
      activeTimersRef.current.set(reminder.id, t)
    }
  }

  const stopReminderTimer = (id: number) => {
    if (activeTimersRef.current.has(id)) {
      clearTimeout(activeTimersRef.current.get(id))
      activeTimersRef.current.delete(id)
    }
  }

  const triggerReminder = (reminder: Reminder) => {
    const audio = new Audio("/notification.mp3")
    audio.play().catch(() => {})

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(reminder.titulo, {
        body: `Lembrete: ${reminder.titulo}`,
        icon: "/brass-school-bell.png",
      })
    }

    setActiveReminderPopup(reminder)
    toggleEnabled(reminder.id, false)
  }

  const handleReminderClose = () => setActiveReminderPopup(null)

  const handleReminderDone = () => {
    toast.success("Lembrete concluído!")
    setActiveReminderPopup(null)
  }

  const handleRemindIn5Minutes = () => {
    if (activeReminderPopup) {
      const newDataHora = new Date(Date.now() + 5 * 60 * 1000).toISOString()
      updateReminder(activeReminderPopup.id, {
        ...activeReminderPopup,
        dataHora: newDataHora,
      })
      toast.success("Reagendado para daqui a 5 minutos")
    }
    setActiveReminderPopup(null)
  }

  const normalizeDateTime = (value: string) => {
    return value.length === 16 ? `${value}:00` : value
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      titulo: formData.titulo,
      descricao: formData.descricao,
      dataHora: normalizeDateTime(formData.dataHora),
      ativo: formData.ativo,
    }

    try {
      if (editingReminder) {
        await axios.put(`${API_BASE}/${editingReminder.id}`, payload, axiosConfig())
        toast.success("Lembrete atualizado!")
      } else {
        await axios.post(API_BASE, payload, axiosConfig())
        toast.success("Lembrete criado!")
      }

      resetForm()
      loadReminders()
    } catch {
      toast.error("Erro ao salvar")
    }
  }

  const updateReminder = async (id: number, updated: Reminder) => {
    const payload = {
      titulo: updated.titulo,
      descricao: updated.descricao,
      dataHora: updated.dataHora,
      ativo: updated.ativo,
    }

    try {
      await axios.put(`${API_BASE}/${id}`, payload, axiosConfig())
      setReminders((prev) => prev.map((r) => (r.id === id ? updated : r)))
    } catch {
      toast.error("Erro ao atualizar")
    }
  }

  const resetForm = () => {
    setFormData({ titulo: "", descricao: "", dataHora: "", ativo: true })
    setEditingReminder(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder)
    setFormData({
      titulo: reminder.titulo,
      descricao: reminder.descricao,
      dataHora: reminder.dataHora,
      ativo: reminder.ativo,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/${id}`, axiosConfig())
      setReminders((prev) => prev.filter((r) => r.id !== id))
      stopReminderTimer(id)
      toast.success("Lembrete excluído!")
    } catch {
      toast.error("Erro ao excluir")
    }
  }

  const toggleEnabled = async (id: number, newState?: boolean) => {
    const reminder = reminders.find((r) => r.id === id)
    if (!reminder) return

    const ativo = newState !== undefined ? newState : !reminder.ativo

    const payload = {
      titulo: reminder.titulo,
      descricao: reminder.descricao,
      dataHora: reminder.dataHora,
      ativo,
    }

    try {
      await axios.put(`${API_BASE}/${id}`, payload, axiosConfig())
      setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ativo } : r)))
      if (!ativo) stopReminderTimer(id)
    } catch {
      toast.error("Erro ao atualizar")
    }
  }

  const getIntervalText = (r: Reminder) =>
      `Próximo: ${new Date(r.dataHora).toLocaleString("pt-BR")}`

  return (
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 lg:pl-64">
          <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <PageHeader
                  title="Lembretes"
                  description="Configure lembretes inteligentes para manter sua rotina"
                  action={
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => setEditingReminder(null)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Novo Lembrete
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleSubmit}>
                          <DialogHeader>
                            <DialogTitle>
                              {editingReminder ? "Editar Lembrete" : "Novo Lembrete"}
                            </DialogTitle>
                            <DialogDescription>
                              {editingReminder
                                  ? "Atualize o lembrete"
                                  : "Crie um novo lembrete"}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="titulo">Título</Label>
                              <Input
                                  id="titulo"
                                  value={formData.titulo}
                                  onChange={(e) =>
                                      setFormData({ ...formData, titulo: e.target.value })
                                  }
                                  required
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="descricao">Descrição</Label>
                              <Input
                                  id="descricao"
                                  value={formData.descricao}
                                  onChange={(e) =>
                                      setFormData({ ...formData, descricao: e.target.value })
                                  }
                                  placeholder="Descrição detalhada do lembrete"
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="dataHora">Data e Hora</Label>
                              <Input
                                  id="dataHora"
                                  type="datetime-local"
                                  value={formData.dataHora}
                                  onChange={(e) =>
                                      setFormData({ ...formData, dataHora: e.target.value })
                                  }
                                  required
                              />
                            </div>

                            <div className="flex items-center justify-between border p-4 rounded-lg">
                              <div>
                                <Label>Ativo</Label>
                                <p className="text-xs text-muted-foreground">
                                  Ativar ou desativar lembrete
                                </p>
                              </div>

                              <Switch
                                  checked={formData.ativo}
                                  onCheckedChange={(checked) =>
                                      setFormData({ ...formData, ativo: checked })
                                  }
                              />
                            </div>
                          </div>

                          <DialogFooter>
                            <Button variant="outline" onClick={resetForm}>
                              Cancelar
                            </Button>
                            <Button type="submit">
                              {editingReminder ? "Atualizar" : "Criar"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  }
              />

              {/* GRID */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reminders.map((r) => (
                    <Card key={r.id} className={!r.ativo ? "opacity-60" : ""}>
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div
                              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                  r.ativo ? "bg-primary/10" : "bg-muted"
                              }`}
                          >
                            <Bell
                                className={`h-5 w-5 ${
                                    r.ativo ? "text-primary" : "text-muted-foreground"
                                }`}
                            />
                          </div>

                          <div className="flex-1">
                            <CardTitle>{r.titulo}</CardTitle>

                            <Badge variant="outline" className="text-xs mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {getIntervalText(r)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Switch
                                checked={r.ativo}
                                onCheckedChange={() => toggleEnabled(r.id)}
                            />
                            <span className="text-sm">
                          {r.ativo ? "Ativado" : "Desativado"}
                        </span>
                          </div>

                          <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(r)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(r.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>

              {reminders.length === 0 && (
                  <Card className="mt-6">
                    <CardContent className="py-12 text-center">
                      <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Nenhum lembrete configurado</p>
                    </CardContent>
                  </Card>
              )}
            </div>
          </div>
        </main>

        {/* POPUP DE LEMBRETE */}
        {activeReminderPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-card border-2 border-primary/50 rounded-3xl shadow-xl p-8 max-w-md w-full mx-4">
                <div className="flex justify-between mb-6">
                  <div className="flex gap-4 items-center">
                    <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center">
                      <Bell className="h-8 w-8 text-primary" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold">
                        {activeReminderPopup.titulo}
                      </h3>
                    </div>
                  </div>

                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleReminderClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-5 rounded-xl bg-muted/40 border mb-6">
                  Lembrete: {activeReminderPopup.titulo}
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                      onClick={handleReminderDone}
                      className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Concluído
                  </Button>

                  <Button
                      onClick={handleRemindIn5Minutes}
                      variant="outline"
                      className="w-full"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Adiar 5 min
                  </Button>

                  <Button
                      onClick={handleReminderClose}
                      variant="ghost"
                      className="w-full"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { Plus, Trash2, Edit, Bell, Volume2, VolumeX, Upload, Clock, X, CheckCircle, RotateCcw } from "lucide-react"
import { toast } from "sonner"

interface Reminder {
  id: number
  title: string
  message: string
  interval: number
  intervalUnit: "minutes" | "hours"
  soundType: "default" | "none" | "custom"
  customSoundUrl?: string
  linkToFocus: boolean
  enabled: boolean
  lastTriggered?: string
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      title: "Beber água",
      message: "Hora de se hidratar!",
      interval: 30,
      intervalUnit: "minutes",
      soundType: "default",
      linkToFocus: false,
      enabled: true,
    },
    {
      id: 2,
      title: "Alongamento",
      message: "Faça uma pausa para alongar",
      interval: 1,
      intervalUnit: "hours",
      soundType: "default",
      linkToFocus: true,
      enabled: true,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)
  const [activeReminderPopup, setActiveReminderPopup] = useState<Reminder | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    interval: 30,
    intervalUnit: "minutes" as "minutes" | "hours",
    soundType: "default" as "default" | "none" | "custom",
    customSoundUrl: "",
    linkToFocus: false,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const activeTimersRef = useRef<Map<number, NodeJS.Timeout>>(new Map())

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    const savedReminders = localStorage.getItem("reminders")
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders))
    }

    reminders.forEach((reminder) => {
      if (reminder.enabled) {
        startReminderTimer(reminder)
      }
    })

    return () => {
      activeTimersRef.current.forEach((timer) => clearInterval(timer))
      activeTimersRef.current.clear()
    }
  }, [])

  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem("reminders", JSON.stringify(reminders))
    }

    activeTimersRef.current.forEach((timer) => clearInterval(timer))
    activeTimersRef.current.clear()

    reminders.forEach((reminder) => {
      if (reminder.enabled) {
        startReminderTimer(reminder)
      }
    })
  }, [reminders])

  const startReminderTimer = (reminder: Reminder) => {
    if (activeTimersRef.current.has(reminder.id)) {
      clearInterval(activeTimersRef.current.get(reminder.id))
    }

    const intervalMs = reminder.interval * (reminder.intervalUnit === "hours" ? 3600000 : 60000)

    const timer = setInterval(() => {
      triggerReminder(reminder)
    }, intervalMs)

    activeTimersRef.current.set(reminder.id, timer)
  }

  const stopReminderTimer = (reminderId: number) => {
    if (activeTimersRef.current.has(reminderId)) {
      clearInterval(activeTimersRef.current.get(reminderId))
      activeTimersRef.current.delete(reminderId)
    }
  }

  const triggerReminder = (reminder: Reminder) => {
    const audio = new Audio("/notification.mp3")
    audio.play().catch(() => {})

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification(reminder.title, {
        body: reminder.message,
        icon: "/brass-school-bell.png",
      })
    }

    if (reminder.soundType === "default") {
      const audio = new Audio("/notification.mp3")
      audio.play().catch(() => {})
    } else if (reminder.soundType === "custom" && reminder.customSoundUrl) {
      const audio = new Audio(reminder.customSoundUrl)
      audio.play().catch(() => {})
    }

    setActiveReminderPopup(reminder)

    setReminders((prev) =>
        prev.map((r) => (r.id === reminder.id ? { ...r, lastTriggered: new Date().toISOString() } : r)),
    )
  }

  const handleReminderClose = () => {
    setActiveReminderPopup(null)
  }

  const handleReminderDone = () => {
    setActiveReminderPopup(null)
    toast.success("Lembrete concluído!")
  }

  const handleRemindIn5Minutes = () => {
    if (activeReminderPopup) {
      setTimeout(
          () => {
            triggerReminder(activeReminderPopup)
          },
          5 * 60 * 1000,
      )

      toast.success("Lembrete reagendado para daqui a 5 minutos")
    }
    setActiveReminderPopup(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingReminder) {
      setReminders(
          reminders.map((reminder) =>
              reminder.id === editingReminder.id ? { ...reminder, ...formData, enabled: reminder.enabled } : reminder,
          ),
      )
    } else {
      const newReminder: Reminder = {
        id: Date.now(),
        ...formData,
        enabled: true,
      }
      setReminders([...reminders, newReminder])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      interval: 30,
      intervalUnit: "minutes",
      soundType: "default",
      customSoundUrl: "",
      linkToFocus: false,
    })
    setEditingReminder(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder)
    setFormData({
      title: reminder.title,
      message: reminder.message,
      interval: reminder.interval,
      intervalUnit: reminder.intervalUnit,
      soundType: reminder.soundType,
      customSoundUrl: reminder.customSoundUrl || "",
      linkToFocus: reminder.linkToFocus,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    stopReminderTimer(id)
    setReminders(reminders.filter((reminder) => reminder.id !== id))
  }

  const toggleEnabled = (id: number) => {
    setReminders(
        reminders.map((reminder) => {
          if (reminder.id === id) {
            return { ...reminder, enabled: !reminder.enabled }
          }
          return reminder
        }),
    )
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setFormData({ ...formData, customSoundUrl: url, soundType: "custom" })
    }
  }

  const getIntervalText = (reminder: Reminder) => {
    return `A cada ${reminder.interval} ${reminder.intervalUnit === "hours" ? "hora(s)" : "minuto(s)"}`
  }

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
                            <DialogTitle>{editingReminder ? "Editar Lembrete" : "Novo Lembrete"}</DialogTitle>
                            <DialogDescription>
                              {editingReminder
                                  ? "Atualize as configurações do lembrete"
                                  : "Configure um novo lembrete personalizado"}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="title">Título</Label>
                              <Input
                                  id="title"
                                  value={formData.title}
                                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                  placeholder="Ex: Beber água"
                                  required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="message">Mensagem</Label>
                              <Textarea
                                  id="message"
                                  value={formData.message}
                                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                  placeholder="Ex: Hora de se hidratar!"
                                  rows={2}
                                  required
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="interval">Intervalo</Label>
                                <Input
                                    id="interval"
                                    type="number"
                                    min="1"
                                    value={formData.interval}
                                    onChange={(e) => setFormData({ ...formData, interval: Number.parseInt(e.target.value) })}
                                    required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="intervalUnit">Unidade</Label>
                                <Select
                                    value={formData.intervalUnit}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, intervalUnit: value as "minutes" | "hours" })
                                    }
                                >
                                  <SelectTrigger id="intervalUnit">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="minutes">Minutos</SelectItem>
                                    <SelectItem value="hours">Horas</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="soundType">Som de Notificação</Label>
                              <Select
                                  value={formData.soundType}
                                  onValueChange={(value) =>
                                      setFormData({ ...formData, soundType: value as "default" | "none" | "custom" })
                                  }
                              >
                                <SelectTrigger id="soundType">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="default">Som Padrão</SelectItem>
                                  <SelectItem value="none">Sem Som</SelectItem>
                                  <SelectItem value="custom">Som Personalizado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {formData.soundType === "custom" && (
                                <div className="grid gap-2">
                                  <Label htmlFor="customSound">Upload de Áudio (.mp3, .wav)</Label>
                                  <div className="flex gap-2">
                                    <Input
                                        id="customSound"
                                        type="file"
                                        accept=".mp3,.wav"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full bg-transparent"
                                    >
                                      <Upload className="h-4 w-4 mr-2" />
                                      {formData.customSoundUrl ? "Áudio Carregado" : "Escolher Arquivo"}
                                    </Button>
                                  </div>
                                </div>
                            )}
                            <div className="flex items-center justify-between rounded-lg border border-border p-4">
                              <div className="space-y-0.5">
                                <Label htmlFor="linkToFocus" className="text-sm font-medium">
                                  Vincular ao Modo Foco
                                </Label>
                                <p className="text-xs text-muted-foreground">Lembrar apenas durante sessões de foco</p>
                              </div>
                              <Switch
                                  id="linkToFocus"
                                  checked={formData.linkToFocus}
                                  onCheckedChange={(checked) => setFormData({ ...formData, linkToFocus: checked })}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={resetForm}>
                              Cancelar
                            </Button>
                            <Button type="submit">{editingReminder ? "Atualizar" : "Criar"}</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  }
              />

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reminders.map((reminder) => (
                    <Card key={reminder.id} className={!reminder.enabled ? "opacity-60" : ""}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                    reminder.enabled ? "bg-primary/10" : "bg-muted"
                                }`}
                            >
                              <Bell className={`h-5 w-5 ${reminder.enabled ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg mb-1">{reminder.title}</CardTitle>
                              <p className="text-sm text-muted-foreground mb-2">{reminder.message}</p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {getIntervalText(reminder)}
                                </Badge>
                                {reminder.soundType === "none" ? (
                                    <Badge variant="outline" className="text-xs">
                                      <VolumeX className="h-3 w-3 mr-1" />
                                      Sem som
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-xs">
                                      <Volume2 className="h-3 w-3 mr-1" />
                                      {reminder.soundType === "custom" ? "Personalizado" : "Padrão"}
                                    </Badge>
                                )}
                                {reminder.linkToFocus && (
                                    <Badge variant="outline" className="text-xs bg-accent/10">
                                      Modo Foco
                                    </Badge>
                                )}
                              </div>
                              {reminder.lastTriggered && (
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Último: {new Date(reminder.lastTriggered).toLocaleTimeString("pt-BR")}
                                  </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Switch checked={reminder.enabled} onCheckedChange={() => toggleEnabled(reminder.id)} />
                            <span className="text-sm text-muted-foreground">
                          {reminder.enabled ? "Ativado" : "Desativado"}
                        </span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(reminder)}
                                className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(reminder.id)}
                                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
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
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Nenhum lembrete configurado</p>
                      <p className="text-sm text-muted-foreground mt-1">Crie seu primeiro lembrete para começar</p>
                    </CardContent>
                  </Card>
              )}
            </div>
          </div>
        </main>

        {activeReminderPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-card border-2 border-primary/50 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse ring-4 ring-primary/10">
                      <Bell className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">{activeReminderPopup.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleReminderClose}
                      className="h-9 w-9 rounded-full hover:bg-muted shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mb-8 p-5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
                  <p className="text-foreground text-lg leading-relaxed">{activeReminderPopup.message}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                      onClick={handleReminderDone}
                      size="lg"
                      className="w-full text-base font-semibold h-12 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg shadow-green-500/20"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Concluído
                  </Button>
                  <Button
                      onClick={handleRemindIn5Minutes}
                      variant="outline"
                      size="lg"
                      className="w-full text-base font-semibold h-12 bg-transparent border-2 hover:bg-accent/10 hover:border-accent"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Adiar 5 min
                  </Button>
                  <Button
                      onClick={handleReminderClose}
                      variant="ghost"
                      size="lg"
                      className="w-full text-base font-semibold h-12 hover:bg-muted"
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

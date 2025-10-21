"use client"

import { useState, useEffect, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, Settings, Clock, Coffee, Target, Maximize, Minimize } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type TimerMode = "focus" | "shortBreak" | "longBreak"

interface PomodoroSettings {
  focusTime: number
  shortBreakTime: number
  longBreakTime: number
  sessionsUntilLongBreak: number
}

interface Session {
  id: number
  type: TimerMode
  duration: number
  completedAt: string
}

export default function FocusPage() {
  const [settings, setSettings] = useState<PomodoroSettings>({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    sessionsUntilLongBreak: 4,
  })

  const [mode, setMode] = useState<TimerMode>("focus")
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [sessions, setSessions] = useState<Session[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [tempSettings, setTempSettings] = useState(settings)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const autoStart = localStorage.getItem("autoStartTimer")
    if (autoStart === "true") {
      setIsRunning(true)
      localStorage.removeItem("autoStartTimer")
    }
  }, [])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)

    if (mode === "focus") {
      const newSession: Session = {
        id: Date.now(),
        type: mode,
        duration: settings.focusTime,
        completedAt: new Date().toISOString(),
      }
      setSessions([newSession, ...sessions])
      setCompletedSessions((prev) => prev + 1)

      if ((completedSessions + 1) % settings.sessionsUntilLongBreak === 0) {
        setMode("longBreak")
        setTimeLeft(settings.longBreakTime * 60)
      } else {
        setMode("shortBreak")
        setTimeLeft(settings.shortBreakTime * 60)
      }
    } else {
      setMode("focus")
      setTimeLeft(settings.focusTime * 60)
    }

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification("Pomodoro Timer", {
        body: mode === "focus" ? "Hora de fazer uma pausa!" : "Hora de focar novamente!",
      })
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    const duration =
      mode === "focus" ? settings.focusTime : mode === "shortBreak" ? settings.shortBreakTime : settings.longBreakTime
    setTimeLeft(duration * 60)
  }

  const changeMode = (newMode: TimerMode) => {
    setIsRunning(false)
    setMode(newMode)
    const duration =
      newMode === "focus"
        ? settings.focusTime
        : newMode === "shortBreak"
          ? settings.shortBreakTime
          : settings.longBreakTime
    setTimeLeft(duration * 60)
  }

  const saveSettings = () => {
    setSettings(tempSettings)
    setIsSettingsOpen(false)
    resetTimer()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getTotalDuration = () => {
    return mode === "focus"
      ? settings.focusTime * 60
      : mode === "shortBreak"
        ? settings.shortBreakTime * 60
        : settings.longBreakTime * 60
  }

  const getProgress = () => {
    return ((getTotalDuration() - timeLeft) / getTotalDuration()) * 100
  }

  const getTodaySessions = () => {
    const today = new Date().toISOString().split("T")[0]
    return sessions.filter((s) => s.completedAt.startsWith(today))
  }

  const getTodayFocusTime = () => {
    return getTodaySessions().reduce((total, session) => total + session.duration, 0)
  }

  const requestNotificationPermission = () => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      })
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-2xl text-center">
          {/* Mode Indicator */}
          <div className="mb-8">
            <p className="text-2xl text-muted-foreground mb-2">
              {mode === "focus" ? "Tempo de Foco" : mode === "shortBreak" ? "Pausa Curta" : "Pausa Longa"}
            </p>
          </div>

          {/* Timer Display */}
          <div className="mb-12">
            <div className="text-[12rem] font-bold text-foreground font-mono leading-none mb-8">
              {formatTime(timeLeft)}
            </div>
            <Progress value={getProgress()} className="h-3 mb-4" />
          </div>

          {/* Controls */}
          <div className="flex gap-6 justify-center mb-8">
            <Button size="lg" onClick={toggleTimer} className="w-40 h-16 text-xl">
              {isRunning ? (
                <>
                  <Pause className="h-6 w-6 mr-3" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-6 w-6 mr-3" />
                  Iniciar
                </>
              )}
            </Button>
            <Button size="lg" variant="outline" onClick={resetTimer} className="w-40 h-16 text-xl bg-transparent">
              <RotateCcw className="h-6 w-6 mr-3" />
              Resetar
            </Button>
          </div>

          {/* Exit Fullscreen */}
          <Button variant="ghost" onClick={toggleFullscreen} className="text-muted-foreground">
            <Minimize className="h-5 w-5 mr-2" />
            Sair da Tela Cheia
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:pl-64">
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Foco"
            description="Use a técnica Pomodoro para manter o foco e a produtividade"
            action={
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Configurações do Pomodoro</DialogTitle>
                    <DialogDescription>Personalize os tempos de foco e pausa</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="focusTime">Tempo de Foco (minutos)</Label>
                      <Input
                        id="focusTime"
                        type="number"
                        min="1"
                        max="60"
                        value={tempSettings.focusTime}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, focusTime: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="shortBreak">Pausa Curta (minutos)</Label>
                      <Input
                        id="shortBreak"
                        type="number"
                        min="1"
                        max="30"
                        value={tempSettings.shortBreakTime}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, shortBreakTime: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="longBreak">Pausa Longa (minutos)</Label>
                      <Input
                        id="longBreak"
                        type="number"
                        min="1"
                        max="60"
                        value={tempSettings.longBreakTime}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, longBreakTime: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="sessionsUntilLongBreak">Sessões até Pausa Longa</Label>
                      <Input
                        id="sessionsUntilLongBreak"
                        type="number"
                        min="2"
                        max="10"
                        value={tempSettings.sessionsUntilLongBreak}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, sessionsUntilLongBreak: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsSettingsOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={saveSettings}>Salvar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            }
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Timer Card */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  {/* Mode Selector */}
                  <div className="flex gap-2 mb-8 justify-center">
                    <Button
                      variant={mode === "focus" ? "default" : "outline"}
                      onClick={() => changeMode("focus")}
                      disabled={isRunning}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Foco
                    </Button>
                    <Button
                      variant={mode === "shortBreak" ? "default" : "outline"}
                      onClick={() => changeMode("shortBreak")}
                      disabled={isRunning}
                    >
                      <Coffee className="h-4 w-4 mr-2" />
                      Pausa Curta
                    </Button>
                    <Button
                      variant={mode === "longBreak" ? "default" : "outline"}
                      onClick={() => changeMode("longBreak")}
                      disabled={isRunning}
                    >
                      <Coffee className="h-4 w-4 mr-2" />
                      Pausa Longa
                    </Button>
                  </div>

                  {/* Timer Display */}
                  <div className="text-center mb-8">
                    <div className="text-8xl font-bold text-foreground mb-4 font-mono">{formatTime(timeLeft)}</div>
                    <Progress value={getProgress()} className="h-2 mb-6" />
                    <p className="text-lg text-muted-foreground">
                      {mode === "focus" ? "Tempo de Foco" : mode === "shortBreak" ? "Pausa Curta" : "Pausa Longa"}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex gap-4 justify-center mb-4">
                    <Button size="lg" onClick={toggleTimer} className="w-32">
                      {isRunning ? (
                        <>
                          <Pause className="h-5 w-5 mr-2" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Iniciar
                        </>
                      )}
                    </Button>
                    <Button size="lg" variant="outline" onClick={resetTimer} className="w-32 bg-transparent">
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Resetar
                    </Button>
                  </div>

                  <div className="text-center">
                    <Button variant="ghost" onClick={toggleFullscreen} className="text-muted-foreground">
                      <Maximize className="h-4 w-4 mr-2" />
                      Modo Tela Cheia
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Card */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estatísticas de Hoje</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Sessões Completas</span>
                      <span className="text-2xl font-bold text-foreground">{getTodaySessions().length}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Tempo Focado</span>
                      <span className="text-2xl font-bold text-foreground">{getTodayFocusTime()}min</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Próxima Pausa Longa</span>
                      <span className="text-2xl font-bold text-foreground">
                        {settings.sessionsUntilLongBreak - (completedSessions % settings.sessionsUntilLongBreak)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Histórico Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  {getTodaySessions().length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhuma sessão hoje</p>
                  ) : (
                    <div className="space-y-2">
                      {getTodaySessions()
                        .slice(0, 5)
                        .map((session) => (
                          <div
                            key={session.id}
                            className="flex items-center justify-between py-2 border-b border-border last:border-0"
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">{session.duration} min</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(session.completedAt).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

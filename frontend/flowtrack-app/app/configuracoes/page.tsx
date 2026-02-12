"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Moon, Sun, Bell, Globe, Palette, Boxes } from "lucide-react"
import { toast } from "sonner"
import { getUserSettings, updateUserSettings, type UserSettings } from "@/lib/api/settings"
import { useTheme } from "next-themes"

// Módulos padrão (mesmos do backend)
const DEFAULT_MODULES = {
  tarefas: true,
  categorias: true,
  foco: true,
  habitos: true,
  "bem-estar": true,
  notas: false,
  rotina: false,
  lembretes: false,
  relatorios: false,
}

export default function SettingsPage() {
  const { theme: systemTheme, setTheme: setSystemTheme } = useTheme()
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light")
  const [notifications, setNotifications] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [language, setLanguage] = useState("pt-BR")
  const [enabledModules, setEnabledModules] = useState(DEFAULT_MODULES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getUserSettings()
        setTheme(settings.theme as "light" | "dark" | "system" || "light")
        setNotifications(settings.notifications ?? true)
        setSoundEnabled(settings.soundEnabled ?? true)
        setLanguage(settings.language || "pt-BR")
        
        // Merge dos módulos do backend com os padrões para garantir todas as propriedades
        setEnabledModules({
          ...DEFAULT_MODULES,
          ...(settings.enabledModules || {}),
        } as typeof DEFAULT_MODULES)

        // Aplicar tema
        if (settings.theme) {
          setSystemTheme(settings.theme)
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
        toast.error("Erro ao carregar configurações")
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [setSystemTheme])

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    try {
      setTheme(newTheme)
      setSystemTheme(newTheme)
      await updateUserSettings({ theme: newTheme })
      toast.success("Tema atualizado com sucesso")
    } catch (error) {
      console.error("Erro ao atualizar tema:", error)
      toast.error("Erro ao atualizar tema")
    }
  }

  const handleNotificationsChange = async (enabled: boolean) => {
    try {
      setNotifications(enabled)
      await updateUserSettings({ notifications: enabled })
      toast.success(enabled ? "Notificações ativadas" : "Notificações desativadas")
    } catch (error) {
      console.error("Erro ao atualizar notificações:", error)
      toast.error("Erro ao atualizar notificações")
      setNotifications(!enabled) // Reverter em caso de erro
    }
  }

  const handleSoundChange = async (enabled: boolean) => {
    try {
      setSoundEnabled(enabled)
      await updateUserSettings({ soundEnabled: enabled })
      toast.success(enabled ? "Sons ativados" : "Sons desativados")
    } catch (error) {
      console.error("Erro ao atualizar sons:", error)
      toast.error("Erro ao atualizar sons")
      setSoundEnabled(!enabled) // Reverter em caso de erro
    }
  }

  const handleLanguageChange = async (newLanguage: string) => {
    try {
      setLanguage(newLanguage)
      await updateUserSettings({ language: newLanguage })
      toast.success("Idioma atualizado")
    } catch (error) {
      console.error("Erro ao atualizar idioma:", error)
      toast.error("Erro ao atualizar idioma")
    }
  }

  const handleModuleToggle = async (module: string, enabled: boolean) => {
    try {
      const newModules = { ...enabledModules, [module]: enabled }
      setEnabledModules(newModules)
      await updateUserSettings({ enabledModules: newModules })
      toast.success(enabled ? `${getModuleName(module)} ativado` : `${getModuleName(module)} desativado`)

      // Disparar evento para atualizar sidebar
      window.dispatchEvent(new Event("settingsUpdated"))
    } catch (error) {
      console.error("Erro ao atualizar módulos:", error)
      toast.error("Erro ao atualizar módulos")
      // Reverter em caso de erro
      setEnabledModules({ ...enabledModules, [module]: !enabled })
    }
  }

  const getModuleName = (key: string) => {
    const names: Record<string, string> = {
      tarefas: "Tarefas",
      categorias: "Categorias",
      notas: "Notas",
      habitos: "Hábitos",
      rotina: "Rotina",
      foco: "Foco",
      lembretes: "Lembretes",
      "bem-estar": "Bem-estar",
      relatorios: "Relatórios",
    }
    return names[key] || key
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:pl-64">
          <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center">Carregando configurações...</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:pl-64">
        <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <PageHeader title="Configurações" description="Personalize sua experiência no FlowTrack" />

          <div className="space-y-6">
            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Aparência
                </CardTitle>
                <CardDescription>Personalize a aparência do aplicativo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme" className="text-base">
                      Tema
                    </Label>
                    <p className="text-sm text-muted-foreground mb-3">Escolha entre tema claro, escuro ou automático</p>
                    <Select value={theme} onValueChange={handleThemeChange}>
                      <SelectTrigger id="theme" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Claro
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Escuro
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            Sistema
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="theme-preview" className="text-base">
                        Pré-visualização
                      </Label>
                      <p className="text-sm text-muted-foreground">Veja como o tema atual aparece</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-12 w-12 rounded-lg bg-background border-2 border-border" />
                      <div className="h-12 w-12 rounded-lg bg-primary" />
                      <div className="h-12 w-12 rounded-lg bg-secondary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
                <CardDescription>Gerencie como você recebe notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="text-base">
                      Ativar Notificações
                    </Label>
                    <p className="text-sm text-muted-foreground">Receba lembretes e alertas do sistema</p>
                  </div>
                  <Switch id="notifications" checked={notifications} onCheckedChange={handleNotificationsChange} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound" className="text-base">
                      Sons de Notificação
                    </Label>
                    <p className="text-sm text-muted-foreground">Reproduzir som ao receber notificações</p>
                  </div>
                  <Switch id="sound" checked={soundEnabled} onCheckedChange={handleSoundChange} />
                </div>
              </CardContent>
            </Card>

            {/* Language Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Idioma e Região
                </CardTitle>
                <CardDescription>Configure o idioma do aplicativo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language" className="text-base">
                      Idioma
                    </Label>
                    <p className="text-sm text-muted-foreground mb-3">Selecione o idioma de sua preferência</p>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger id="language" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modules Management Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Boxes className="h-5 w-5" />
                  Módulos do Sistema
                </CardTitle>
                <CardDescription>Ative ou desative os módulos que você deseja usar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(enabledModules).map(([module, enabled], index) => (
                  <div key={module}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor={`module-${module}`} className="text-base">
                          {getModuleName(module)}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {module === "tarefas" && "Gerencie suas tarefas e afazeres"}
                          {module === "categorias" && "Organize suas tarefas por categorias"}
                          {module === "notas" && "Anote ideias e pensamentos rápidos"}
                          {module === "habitos" && "Acompanhe seus hábitos diários"}
                          {module === "rotina" && "Planeje sua rotina semanal"}
                          {module === "foco" && "Use o timer Pomodoro para focar"}
                          {module === "lembretes" && "Configure lembretes inteligentes"}
                          {module === "bem-estar" && "Registre seu humor e bem-estar"}
                          {module === "relatorios" && "Visualize estatísticas e progresso"}
                        </p>
                      </div>
                      <Switch
                        id={`module-${module}`}
                        checked={enabled}
                        onCheckedChange={(checked) => handleModuleToggle(module, checked)}
                      />
                    </div>
                    {index < Object.keys(enabledModules).length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Settings Placeholder */}
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground">Mais configurações em breve</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Estamos trabalhando em novas opções de personalização
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
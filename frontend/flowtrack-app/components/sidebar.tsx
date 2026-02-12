"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Target,
  Calendar,
  Timer,
  Bell,
  Heart,
  BarChart3,
  Settings,
  Menu,
  X,
  Shield,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { getUserSettings, type UserSettings } from "@/lib/api/settings"
import { getProfile, type Profile } from "@/lib/api/profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mapeamento de módulos para navegação
const moduleNavigation: Record<string, { name: string; href: string; icon: any }> = {
  tarefas: { name: "Tarefas", href: "/tarefas", icon: CheckSquare },
  categorias: { name: "Categorias", href: "/categorias", icon: FolderKanban },
  habitos: { name: "Hábitos", href: "/habitos", icon: Target },
  notas: { name: "Notas", href: "/notas", icon: Lightbulb },
  rotina: { name: "Rotina", href: "/rotina", icon: Calendar },
  foco: { name: "Foco", href: "/foco", icon: Timer },
  lembretes: { name: "Lembretes", href: "/lembretes", icon: Bell },
  "bem-estar": { name: "Bem-estar", href: "/bem-estar", icon: Heart },
  relatorios: { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
}

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [enabledModules, setEnabledModules] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin")
    setIsAdmin(adminStatus === "true")

    // Buscar configurações do usuário
    const loadSettings = async () => {
      try {
        const settings = await getUserSettings()
        setEnabledModules(settings.enabledModules || {})
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
        // Se der erro, usa os módulos padrão
        setEnabledModules({
          tarefas: true,
          categorias: true,
          foco: true,
          habitos: true,
          "bem-estar": true,
          notas: false,
          rotina: false,
          lembretes: false,
          relatorios: false,
        })
      } finally {
        setLoading(false)
      }
    }

    // Buscar perfil do usuário
    const loadProfile = async () => {
      try {
        const userProfile = await getProfile()
        setProfile(userProfile)
      } catch (error) {
        console.error("Erro ao carregar perfil:", error)
      }
    }

    loadSettings()
    loadProfile()

    // Ouvir eventos de atualização de configurações
    const handleStorageChange = () => {
      loadSettings()
      loadProfile()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("settingsUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("settingsUpdated", handleStorageChange)
    }
  }, [])

  // Filtrar navegação baseado nos módulos habilitados
  const filteredNavigation = Object.entries(moduleNavigation)
    .filter(([key]) => enabledModules[key] === true)
    .map(([key, nav]) => nav)

  const getAvatarUrl = () => {
    if (!profile?.avatarUrl) return "/placeholder-user.jpg"
    // Se a URL já for completa, retornar como está
    if (profile.avatarUrl.startsWith("http")) {
      return profile.avatarUrl
    }
    // Caso contrário, construir URL completa
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
    return `${API_BASE_URL}${profile.avatarUrl}`
  }

  const getInitials = () => {
    if (!profile) return "U"
    return profile.nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-background/95 backdrop-blur-sm border border-border shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-sidebar-border px-6">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-sidebar-foreground">FlowTrack</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {/* Dashboard sempre visível */}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === "/"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <LayoutDashboard className="h-5 w-5 shrink-0" />
              Dashboard
            </Link>

            {/* Módulos habilitados */}
            {!loading && filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </Link>
              )
            })}

            {/* Configurações sempre visível */}
            <Link
              href="/configuracoes"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === "/configuracoes"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <Settings className="h-5 w-5 shrink-0" />
              Configurações
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === "/admin"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
              >
                <Shield className="h-5 w-5 shrink-0" />
                Administração
              </Link>
            )}
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={getAvatarUrl()} alt={profile?.nome || "Usuário"} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {profile?.nome || "Usuário"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile?.email || ""}
                </p>
              </div>
            </div>
            <UserMenu />
          </div>
        </div>
      </aside>
    </>
  )
}

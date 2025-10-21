import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { UnderConstruction } from "@/components/under-construction"

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:pl-64 flex flex-col">

        {/* 1. PageHeader no topo */}
        <div className="container max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
          <PageHeader title="Configurações" description="Gerencie suas configurações do sistema" />
        </div>

        {/* 2. Div que ocupa o espaço restante (flex-1) e centraliza o card */}
        <div className="flex-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <UnderConstruction
            title="Configurações em Construção"
            description="Em breve você poderá editar configurações do sistema, preferências e muito mais."
          />
        </div>

      </main>
    </div>
  )
}


// "use client"

// import { useState, useEffect } from "react"
// import { Sidebar } from "@/components/sidebar"
// import { PageHeader } from "@/components/page-header"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { Moon, Sun, Bell, Globe, Palette } from "lucide-react"
// import { toast } from "sonner"

// export default function SettingsPage() {
//   const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
//   const [notifications, setNotifications] = useState(true)
//   const [soundEnabled, setSoundEnabled] = useState(true)
//   const [language, setLanguage] = useState("pt-BR")

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null
//     if (savedTheme) {
//       setTheme(savedTheme)
//       applyTheme(savedTheme)
//     }

//     const savedNotifications = localStorage.getItem("notifications")
//     if (savedNotifications !== null) {
//       setNotifications(savedNotifications === "true")
//     }

//     const savedSound = localStorage.getItem("soundEnabled")
//     if (savedSound !== null) {
//       setSoundEnabled(savedSound === "true")
//     }

//     const savedLanguage = localStorage.getItem("language")
//     if (savedLanguage) {
//       setLanguage(savedLanguage)
//     }
//   }, [])

//   const applyTheme = (newTheme: "light" | "dark" | "system") => {
//     const root = document.documentElement

//     if (newTheme === "system") {
//       const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
//       root.classList.toggle("dark", systemTheme === "dark")
//     } else {
//       root.classList.toggle("dark", newTheme === "dark")
//     }
//   }

//   const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
//     setTheme(newTheme)
//     localStorage.setItem("theme", newTheme)
//     applyTheme(newTheme)
//     toast.success("Tema atualizado com sucesso")
//   }

//   const handleNotificationsChange = (enabled: boolean) => {
//     setNotifications(enabled)
//     localStorage.setItem("notifications", enabled.toString())
//     toast.success(enabled ? "Notificações ativadas" : "Notificações desativadas")
//   }

//   const handleSoundChange = (enabled: boolean) => {
//     setSoundEnabled(enabled)
//     localStorage.setItem("soundEnabled", enabled.toString())
//     toast.success(enabled ? "Sons ativados" : "Sons desativados")
//   }

//   const handleLanguageChange = (newLanguage: string) => {
//     setLanguage(newLanguage)
//     localStorage.setItem("language", newLanguage)
//     toast.success("Idioma atualizado")
//   }

//   return (
//     <div className="flex min-h-screen">
//       <Sidebar />

//       <main className="flex-1 lg:pl-64">
//         <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//           <PageHeader title="Configurações" description="Personalize sua experiência no FlowTrack" />

//           <div className="space-y-6">
//             {/* Appearance Settings */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Palette className="h-5 w-5" />
//                   Aparência
//                 </CardTitle>
//                 <CardDescription>Personalize a aparência do aplicativo</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-4">
//                   <div>
//                     <Label htmlFor="theme" className="text-base">
//                       Tema
//                     </Label>
//                     <p className="text-sm text-muted-foreground mb-3">Escolha entre tema claro, escuro ou automático</p>
//                     <Select value={theme} onValueChange={handleThemeChange}>
//                       <SelectTrigger id="theme" className="w-full">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="light">
//                           <div className="flex items-center gap-2">
//                             <Sun className="h-4 w-4" />
//                             Claro
//                           </div>
//                         </SelectItem>
//                         <SelectItem value="dark">
//                           <div className="flex items-center gap-2">
//                             <Moon className="h-4 w-4" />
//                             Escuro
//                           </div>
//                         </SelectItem>
//                         <SelectItem value="system">
//                           <div className="flex items-center gap-2">
//                             <Palette className="h-4 w-4" />
//                             Sistema
//                           </div>
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <Separator />

//                   <div className="flex items-center justify-between">
//                     <div className="space-y-0.5">
//                       <Label htmlFor="theme-preview" className="text-base">
//                         Pré-visualização
//                       </Label>
//                       <p className="text-sm text-muted-foreground">Veja como o tema atual aparece</p>
//                     </div>
//                     <div className="flex gap-2">
//                       <div className="h-12 w-12 rounded-lg bg-background border-2 border-border" />
//                       <div className="h-12 w-12 rounded-lg bg-primary" />
//                       <div className="h-12 w-12 rounded-lg bg-secondary" />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Notifications Settings */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Bell className="h-5 w-5" />
//                   Notificações
//                 </CardTitle>
//                 <CardDescription>Gerencie como você recebe notificações</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-0.5">
//                     <Label htmlFor="notifications" className="text-base">
//                       Ativar Notificações
//                     </Label>
//                     <p className="text-sm text-muted-foreground">Receba lembretes e alertas do sistema</p>
//                   </div>
//                   <Switch id="notifications" checked={notifications} onCheckedChange={handleNotificationsChange} />
//                 </div>

//                 <Separator />

//                 <div className="flex items-center justify-between">
//                   <div className="space-y-0.5">
//                     <Label htmlFor="sound" className="text-base">
//                       Sons de Notificação
//                     </Label>
//                     <p className="text-sm text-muted-foreground">Reproduzir som ao receber notificações</p>
//                   </div>
//                   <Switch id="sound" checked={soundEnabled} onCheckedChange={handleSoundChange} />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Language Settings */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Globe className="h-5 w-5" />
//                   Idioma e Região
//                 </CardTitle>
//                 <CardDescription>Configure o idioma do aplicativo</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div>
//                     <Label htmlFor="language" className="text-base">
//                       Idioma
//                     </Label>
//                     <p className="text-sm text-muted-foreground mb-3">Selecione o idioma de sua preferência</p>
//                     <Select value={language} onValueChange={handleLanguageChange}>
//                       <SelectTrigger id="language" className="w-full">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
//                         <SelectItem value="en-US">English (US)</SelectItem>
//                         <SelectItem value="es-ES">Español</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Additional Settings Placeholder */}
//             <Card className="border-dashed">
//               <CardContent className="py-8 text-center">
//                 <p className="text-sm text-muted-foreground">Mais configurações em breve</p>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Estamos trabalhando em novas opções de personalização
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

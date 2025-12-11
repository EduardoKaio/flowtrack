"use client"

import { usePathname } from "next/navigation"
import { getToken } from "@/lib/api/config"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const pathname = usePathname()

  // Verifica imediatamente no primeiro render (síncrono) - ANTES de renderizar qualquer coisa
  if (typeof window !== "undefined") {
    const token = getToken()
    const isAuthenticated = localStorage.getItem("isAuthenticated")

    if (!token || !isAuthenticated) {
      // Usa window.location.href para forçar navegação completa e evitar qualquer renderização
      // Isso é mais eficaz que router.replace porque força um reload completo
      window.location.href = `/auth/login?redirect=${encodeURIComponent(pathname)}`
      // Retorna null imediatamente - nada será renderizado
      return null
    }
  }

  // Se chegou aqui e está no servidor (SSR), retorna null temporariamente
  // O cliente fará a verificação no próximo render
  if (typeof window === "undefined") {
    return null
  }

  // Se chegou aqui, está autenticado - renderiza o conteúdo
  return <>{children}</>
}




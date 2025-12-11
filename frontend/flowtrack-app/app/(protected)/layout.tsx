"use client"

import { usePathname } from "next/navigation"
import { getToken } from "@/lib/api/config"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Verifica de forma S?NCRONA no primeiro render do cliente - ANTES de qualquer renderiza??o
  if (typeof window !== "undefined") {
    const token = getToken()
    const isAuthenticated = localStorage.getItem("isAuthenticated")

    if (!token || !isAuthenticated) {
      // Usa window.location.href para for?ar navega??o completa sem renderizar nada
      window.location.href = `/auth/login?redirect=${encodeURIComponent(pathname)}`
      // Retorna null imediatamente - nada ser? renderizado
      return null
    }
  }

  // Se estiver no servidor (SSR), retorna null temporariamente
  // O cliente far? a verifica??o no pr?ximo render
  if (typeof window === "undefined") {
    return null
  }

  // Se chegou aqui, est? autenticado - renderiza o conte?do
  return <>{children}</>
}

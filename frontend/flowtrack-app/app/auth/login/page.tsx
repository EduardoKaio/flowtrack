"use client";

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LayoutDashboard, Mail, Lock, Chrome, AlertCircle, CheckCircle2 } from "lucide-react"
import { loginUser } from "@/lib/api/users"
import { setToken } from "@/lib/api/config"

// Forcar renderizacao dinamica para evitar prerender
export const dynamic = 'force-dynamic'

// Componente interno que usa useSearchParams
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")

  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const alertShown = useRef(false)

  // Mostra mensagem amigavel de conta criada
  useEffect(() => {
    if (!alertShown.current && registered === "true") {
      setSuccessMsg("Conta criada com sucesso! Faca login para continuar.")
      alertShown.current = true
    }
  }, [registered])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")
    setIsLoading(true)

    try {
      const authResponse = await loginUser({ email: formData.email, senha: formData.password })

      // Armazena o token JWT
      setToken(authResponse.token)

      // Armazena informacoes basicas no localStorage
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", authResponse.user.email)
      localStorage.setItem("userName", authResponse.user.nome)
      localStorage.setItem("isAdmin", authResponse.user.role === "ADMIN" ? "true" : "false")

      setSuccessMsg("Login realizado com sucesso! Redirecionando...")

      setTimeout(() => {
        router.push(authResponse.user.role === "ADMIN" ? "/admin" : "/")
      }, 1200)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || "Email e/ou senha incorretos. Verifique seus dados e tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", "usuario@gmail.com")
      localStorage.setItem("userName", "Usuario")
      localStorage.setItem("isAdmin", "false")
      router.push("/")
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <LayoutDashboard className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">FlowTrack</h1>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-center">
              Entre na sua conta para continuar
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Mensagens de feedback */}
            {errorMsg && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 p-2 rounded-md">
                <CheckCircle2 className="h-4 w-4" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Nao tem uma conta?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:underline font-medium"
              >
                Registre-se
              </Link>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Ao continuar, voce concorda com nossos Termos de Servico e Politica de
          Privacidade
        </p>
      </div>
    </div>
  )
}

// Componente de fallback para Suspense
function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <LayoutDashboard className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">FlowTrack</h1>
        </div>
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">Carregando...</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente principal exportado com Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  )
}

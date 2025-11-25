"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle2, LayoutDashboard, Mail, Lock, User, Chrome } from "lucide-react"
import { registerUser } from "@/lib/api/users"
import { setToken } from "@/lib/api/config"
import { cn } from "@/lib/utils"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    if (formData.senha !== formData.confirmPassword) {
      setErrorMsg("As senhas não coincidem.")
      return
    }

    if (formData.senha.length < 6) {
      setErrorMsg("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    setIsLoading(true)
    try {
      const response = await registerUser({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
      })

      // Mostra mensagem de sucesso
      setSuccessMsg("Conta criada com sucesso! Redirecionando para login...")
      
      // Limpa o formulário
      setFormData({
        nome: "",
        email: "",
        senha: "",
        confirmPassword: "",
      })

      // Redireciona para login após 2 segundos
      setTimeout(() => {
        router.push("/auth/login?registered=true")
      }, 2000)
    } catch (error: any) {
      console.error("Erro ao registrar:", error)
      // Tratamento amigável para erros
      if (error.message?.includes("duplicate key value") || error.message?.includes("users_email_key") || error.message?.includes("já está cadastrado")) {
        setErrorMsg("Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.")
      } else if (error.message?.includes("inválido")) {
        setErrorMsg("O email informado é inválido.")
      } else if (error.message) {
        setErrorMsg(error.message)
      } else {
        setErrorMsg("Erro ao criar usuário. Verifique os dados e tente novamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = () => {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", "usuario@gmail.com")
      localStorage.setItem("userName", "Usuário")
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
            <CardTitle className="text-2xl text-center">Criar conta</CardTitle>
            <CardDescription className="text-center">
              Comece sua jornada de produtividade
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
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
                <Label htmlFor="nome">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome"
                    className="pl-10"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
              </div>

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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleGoogleRegister}
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Entrar
              </Link>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Ao criar uma conta, você concorda com nossos Termos de Serviço e Política de Privacidade
        </p>
      </div>
    </div>
  )
}

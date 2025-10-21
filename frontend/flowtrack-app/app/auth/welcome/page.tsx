"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LayoutDashboard, CheckCircle2, Target, Clock, Heart, BarChart3 } from "lucide-react"

export default function WelcomePage() {
  const features = [
    {
      icon: CheckCircle2,
      title: "Gerencie Tarefas",
      description: "Organize suas tarefas com categorias e prioridades",
    },
    {
      icon: Target,
      title: "Acompanhe Hábitos",
      description: "Construa hábitos saudáveis com rastreamento de sequências",
    },
    {
      icon: Clock,
      title: "Técnica Pomodoro",
      description: "Mantenha o foco com sessões de trabalho cronometradas",
    },
    {
      icon: Heart,
      title: "Monitore Bem-estar",
      description: "Registre seu humor e níveis de energia diariamente",
    },
    {
      icon: BarChart3,
      title: "Visualize Progresso",
      description: "Acompanhe seu crescimento com relatórios detalhados",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <LayoutDashboard className="h-9 w-9 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold text-foreground">FlowTrack</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Sua plataforma completa para gerenciar tarefas, construir hábitos e manter o foco. Transforme sua rotina em
            resultados.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/register">Começar Gratuitamente</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              <Link href="/auth/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <Card className="border-2 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Pronto para começar?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Junte-se a milhares de usuários que já estão transformando sua produtividade com FlowTrack
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/register">Criar Conta Gratuita</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

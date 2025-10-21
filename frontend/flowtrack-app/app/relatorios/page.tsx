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
          <PageHeader title="Relatórios" description="Veja relatórios detalhados" />
        </div>

        {/* 2. Div que ocupa o espaço restante (flex-1) e centraliza o card */}
        <div className="flex-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <UnderConstruction
            title="Relatórios em Construção"
            description="Em breve você poderá ver relatórios detalhados sobre seu progresso e produtividade."
          />
        </div>

      </main>
    </div>
  )
}


// "use client"

// import { useState } from "react"
// import { Sidebar } from "@/components/sidebar"
// import { PageHeader } from "@/components/page-header"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { Progress } from "@/components/ui/progress"
// import { TrendingUp, Target, Clock, CheckCircle2, Flame, Heart, Award } from "lucide-react"

// type TimePeriod = "week" | "month" | "year"

// export default function ReportsPage() {
//   const [period, setPeriod] = useState<TimePeriod>("week")

//   // Mock data - in a real app, this would come from your database
//   const stats = {
//     week: {
//       tasksCompleted: 42,
//       tasksTotal: 50,
//       focusTime: 1250,
//       habitsCompleted: 18,
//       habitsTotal: 21,
//       averageMood: 4.2,
//       bestStreak: 7,
//       productivityScore: 84,
//     },
//     month: {
//       tasksCompleted: 156,
//       tasksTotal: 180,
//       focusTime: 4800,
//       habitsCompleted: 78,
//       habitsTotal: 90,
//       averageMood: 4.0,
//       bestStreak: 12,
//       productivityScore: 87,
//     },
//     year: {
//       tasksCompleted: 1842,
//       tasksTotal: 2100,
//       focusTime: 58000,
//       habitsCompleted: 920,
//       habitsTotal: 1095,
//       averageMood: 3.9,
//       bestStreak: 21,
//       productivityScore: 88,
//     },
//   }

//   const categoryStats = [
//     { name: "Trabalho", completed: 28, total: 35, color: "bg-blue-500" },
//     { name: "Estudo", completed: 8, total: 10, color: "bg-purple-500" },
//     { name: "Saúde", completed: 4, total: 3, color: "bg-green-500" },
//     { name: "Pessoal", completed: 2, total: 2, color: "bg-pink-500" },
//   ]

//   const weeklyProgress = [
//     { day: "Dom", tasks: 4, focus: 120, habits: 2 },
//     { day: "Seg", tasks: 8, focus: 200, habits: 3 },
//     { day: "Ter", tasks: 7, focus: 180, habits: 3 },
//     { day: "Qua", tasks: 6, focus: 150, habits: 2 },
//     { day: "Qui", tasks: 9, focus: 250, habits: 3 },
//     { day: "Sex", tasks: 5, focus: 200, habits: 3 },
//     { day: "Sáb", tasks: 3, focus: 150, habits: 2 },
//   ]

//   const achievements = [
//     { id: 1, title: "Primeira Semana", description: "Complete 7 dias consecutivos", icon: "🏆", unlocked: true },
//     { id: 2, title: "Mestre do Foco", description: "100 horas de foco total", icon: "🎯", unlocked: true },
//     { id: 3, title: "Hábitos Sólidos", description: "30 dias de sequência", icon: "💪", unlocked: false },
//     { id: 4, title: "Produtividade Máxima", description: "Complete 100 tarefas", icon: "⚡", unlocked: true },
//   ]

//   const currentStats = stats[period]
//   const tasksProgress = (currentStats.tasksCompleted / currentStats.tasksTotal) * 100
//   const habitsProgress = (currentStats.habitsCompleted / currentStats.habitsTotal) * 100

//   const getPeriodLabel = () => {
//     switch (period) {
//       case "week":
//         return "Esta Semana"
//       case "month":
//         return "Este Mês"
//       case "year":
//         return "Este Ano"
//     }
//   }

//   const maxTasks = Math.max(...weeklyProgress.map((d) => d.tasks))
//   const maxFocus = Math.max(...weeklyProgress.map((d) => d.focus))

//   return (
//     <div className="flex min-h-screen">
//       <Sidebar />

//       <main className="flex-1 lg:pl-64">
//         <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
//           <div className="max-w-7xl mx-auto">
//             <PageHeader
//               title="Relatórios"
//               description="Visualize seu progresso e estatísticas detalhadas"
//               action={
//                 <div className="w-48">
//                   <Select value={period} onValueChange={(value) => setPeriod(value as TimePeriod)}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="week">Esta Semana</SelectItem>
//                       <SelectItem value="month">Este Mês</SelectItem>
//                       <SelectItem value="year">Este Ano</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               }
//             />

//             {/* Overview Stats */}
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</CardTitle>
//                   <CheckCircle2 className="h-5 w-5 text-primary" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-foreground">{Math.round(tasksProgress)}%</div>
//                   <Progress value={tasksProgress} className="mt-3" />
//                   <p className="text-xs text-muted-foreground mt-2">
//                     {currentStats.tasksCompleted} de {currentStats.tasksTotal} tarefas
//                   </p>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Focado</CardTitle>
//                   <Clock className="h-5 w-5 text-secondary" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-foreground">{Math.round(currentStats.focusTime / 60)}h</div>
//                   <p className="text-xs text-muted-foreground mt-2">{currentStats.focusTime} minutos totais</p>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium text-muted-foreground">Melhor Sequência</CardTitle>
//                   <Flame className="h-5 w-5 text-orange-500" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-foreground">{currentStats.bestStreak}</div>
//                   <p className="text-xs text-muted-foreground mt-2">dias consecutivos</p>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium text-muted-foreground">Score de Produtividade</CardTitle>
//                   <TrendingUp className="h-5 w-5 text-accent" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-foreground">{currentStats.productivityScore}</div>
//                   <p className="text-xs text-muted-foreground mt-2">de 100 pontos</p>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="grid gap-6 lg:grid-cols-3 mb-6">
//               <div className="lg:col-span-2">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Progresso Semanal</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-6">
//                       {/* Tasks Chart */}
//                       <div>
//                         <div className="flex items-center justify-between mb-3">
//                           <Label className="text-sm font-medium">Tarefas Concluídas</Label>
//                           <CheckCircle2 className="h-4 w-4 text-primary" />
//                         </div>
//                         <div className="flex items-end justify-between gap-2 h-40 bg-muted/30 rounded-lg p-4">
//                           {weeklyProgress.map((day) => (
//                             <div key={day.day} className="flex-1 flex flex-col items-center gap-2 h-full">
//                               <div className="w-full relative flex-1 flex items-end justify-center">
//                                 <div
//                                   className="w-full max-w-[32px] bg-primary rounded-t transition-all hover:opacity-80 cursor-pointer"
//                                   style={{
//                                     height: `${(day.tasks / maxTasks) * 100}%`,
//                                     minHeight: day.tasks > 0 ? "8px" : "0px",
//                                   }}
//                                   title={`${day.tasks} tarefas`}
//                                 />
//                               </div>
//                               <span className="text-xs font-semibold text-foreground">{day.tasks}</span>
//                               <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Focus Time Chart */}
//                       <div>
//                         <div className="flex items-center justify-between mb-3">
//                           <Label className="text-sm font-medium">Tempo de Foco (min)</Label>
//                           <Clock className="h-4 w-4 text-secondary" />
//                         </div>
//                         <div className="flex items-end justify-between gap-2 h-40 bg-muted/30 rounded-lg p-4">
//                           {weeklyProgress.map((day) => (
//                             <div key={day.day} className="flex-1 flex flex-col items-center gap-2 h-full">
//                               <div className="w-full relative flex-1 flex items-end justify-center">
//                                 <div
//                                   className="w-full max-w-[32px] bg-secondary rounded-t transition-all hover:opacity-80 cursor-pointer"
//                                   style={{
//                                     height: `${(day.focus / maxFocus) * 100}%`,
//                                     minHeight: day.focus > 0 ? "8px" : "0px",
//                                   }}
//                                   title={`${day.focus} minutos`}
//                                 />
//                               </div>
//                               <span className="text-xs font-semibold text-foreground">{day.focus}</span>
//                               <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Category Breakdown */}
//               <div>
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Por Categoria</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       {categoryStats.map((category) => {
//                         const progress = (category.completed / category.total) * 100
//                         return (
//                           <div key={category.name}>
//                             <div className="flex items-center justify-between mb-2">
//                               <div className="flex items-center gap-2">
//                                 <div className={`h-3 w-3 rounded-full ${category.color}`} />
//                                 <span className="text-sm font-medium text-foreground">{category.name}</span>
//                               </div>
//                               <span className="text-sm text-muted-foreground">
//                                 {category.completed}/{category.total}
//                               </span>
//                             </div>
//                             <Progress value={progress} className="h-2" />
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>

//             {/* Additional Stats */}
//             <div className="grid gap-6 lg:grid-cols-2 mb-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Target className="h-5 w-5" />
//                     Hábitos
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="text-sm text-muted-foreground">Taxa de Conclusão</span>
//                         <span className="text-2xl font-bold text-foreground">{Math.round(habitsProgress)}%</span>
//                       </div>
//                       <Progress value={habitsProgress} className="h-3" />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
//                       <div>
//                         <p className="text-sm text-muted-foreground mb-1">Completados</p>
//                         <p className="text-2xl font-bold text-foreground">{currentStats.habitsCompleted}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground mb-1">Meta</p>
//                         <p className="text-2xl font-bold text-foreground">{currentStats.habitsTotal}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Heart className="h-5 w-5" />
//                     Bem-estar
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="text-sm text-muted-foreground">Humor Médio</span>
//                         <span className="text-2xl font-bold text-foreground">
//                           {currentStats.averageMood.toFixed(1)}/5
//                         </span>
//                       </div>
//                       <Progress value={(currentStats.averageMood / 5) * 100} className="h-3" />
//                     </div>
//                     <div className="pt-4 border-t border-border">
//                       <p className="text-sm text-muted-foreground mb-3">Distribuição de Humor</p>
//                       <div className="flex justify-between">
//                         <div className="text-center">
//                           <div className="text-2xl mb-1">😢</div>
//                           <div className="text-xs text-muted-foreground">2</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="text-2xl mb-1">😔</div>
//                           <div className="text-xs text-muted-foreground">5</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="text-2xl mb-1">😐</div>
//                           <div className="text-xs text-muted-foreground">8</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="text-2xl mb-1">😊</div>
//                           <div className="text-xs text-muted-foreground">12</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="text-2xl mb-1">😄</div>
//                           <div className="text-xs text-muted-foreground">15</div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Achievements */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Award className="h-5 w-5" />
//                   Conquistas
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                   {achievements.map((achievement) => (
//                     <div
//                       key={achievement.id}
//                       className={`p-4 rounded-lg border-2 transition-all ${
//                         achievement.unlocked
//                           ? "border-primary bg-primary/5"
//                           : "border-border bg-muted/50 opacity-60 grayscale"
//                       }`}
//                     >
//                       <div className="text-4xl mb-2 text-center">{achievement.icon}</div>
//                       <h4 className="font-semibold text-sm text-center text-foreground mb-1">{achievement.title}</h4>
//                       <p className="text-xs text-center text-muted-foreground">{achievement.description}</p>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

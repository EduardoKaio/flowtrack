import { apiRequest } from "./config"

// Interface para o DTO de Tarefa (para corresponder ao backend)
// É melhor definir aqui para garantir que corresponde ao DTO
export interface TaskDTO {
  id: number
  titulo: string
  descricao: string | null // Descrição pode ser nula
  dataConclusao: string
  concluida: boolean
  prioridade: "baixa" | "media" | "alta"
  categoria: string
}

/**
 * Interface para os dados do Dashboard, vindo do DashboardDTO
 */
export interface DashboardStats {
  tasksCompletedToday: number
  tasksTotalToday: number
  currentMood: string
  currentMoodEmoji: string
  todayTasks: TaskDTO[] // Alterado de Task[] para TaskDTO[]
  
  focusTimeToday: number
  focusSessionsToday: number
  habitsCompletedToday: number
  habitsTotalToday: number
}

/**
 * Busca as estatísticas do dashboard
 *
 * Endpoint: GET /api/dashboard/stats
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  // A função apiRequest (do config.ts)
  // já adiciona o 'userID' automaticamente no header.
  return apiRequest<DashboardStats>("/dashboard/stats")
}
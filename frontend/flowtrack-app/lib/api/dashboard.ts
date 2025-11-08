import { apiRequest } from "./config"
import type { Task } from "./tasks" // Importa a interface Task que você já tem

/**
 * Interface para os dados do Dashboard, vindo do DashboardDTO
 */
export interface DashboardStats {
  tasksCompletedToday: number
  tasksTotalToday: number
  currentMood: string
  currentMoodEmoji: string
  todayTasks: Task[] // O backend retorna uma lista de TaskDTO
}

/**
 * Busca as estatísticas do dashboard
 *
 * Endpoint: GET /api/dashboard/stats
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>("/dashboard/stats")
}
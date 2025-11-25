import { apiRequest } from "./config"

export interface ProgressoHabito {
  habitId: number
  diasConcluidos: string[]
  sequenciaAtual: number
  melhorSequencia: number
}

export interface Habito {
  id: number
  nome: string
  descricao: string
  meta: number
  tipoFrequencia: "DIARIO" | "SEMANAL"
  cor: string
  icone: string
  progresso?: ProgressoHabito | null
}

export interface HabitCreateRequest extends Omit<Habito, "id" | "progresso"> {}

export async function getHabits(): Promise<Habito[]> {
  return apiRequest<Habito[]>("/habits", {
    method: "GET",
  })
}

export async function getHabitById(habitId: number): Promise<Habito> {
  return apiRequest<Habito>(`/habits/${habitId}`, {
    method: "GET",
  })
}

export async function createHabit(dto: HabitCreateRequest): Promise<Habito> {
  return apiRequest<Habito>("/habits", {
    method: "POST",
    body: JSON.stringify(dto),
  })
}

export async function editHabit(habitId: number, dto: Partial<HabitCreateRequest>): Promise<Habito> {
  return apiRequest<Habito>(`/habits/${habitId}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  })
}

export async function deleteHabit(habitId: number): Promise<void> {
  return apiRequest<void>(`/habits/${habitId}`, {
    method: "DELETE",
  })
}

export async function addCompleteDay(habitId: number): Promise<ProgressoHabito> {
  
  const response = await apiRequest<ProgressoHabito>(`/habits/${habitId}/completar-dia`, {
    method: "POST",
  })
  return response
}

export async function getHabitProgress(habitId: number): Promise<ProgressoHabito> {
  return apiRequest<ProgressoHabito>(`/habits/${habitId}/progresso`, {
    method: "GET",
  })
}

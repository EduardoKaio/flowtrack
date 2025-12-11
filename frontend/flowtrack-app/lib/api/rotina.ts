import { apiRequest } from "./config"

export interface RoutineActivity {
  id: number
  title: string
  description: string
  time: string
  duration: number
  period: "morning" | "afternoon" | "evening"
  days: string[]
  completed: boolean
}

export interface RoutineCreateDTO {
  title: string
  description?: string
  time: string
  duration: number
  periodo: "MORNING" | "AFTERNOON" | "EVENING" // Backend espera mai�sculas
  days: string // Backend espera string separada por v�rgula
}

// Fun��o auxiliar para converter period de min�sculas para mai�sculas
function toBackendPeriod(period: "morning" | "afternoon" | "evening"): "MORNING" | "AFTERNOON" | "EVENING" {
  return period.toUpperCase() as "MORNING" | "AFTERNOON" | "EVENING"
}

// Fun��o auxiliar para converter period de mai�sculas para min�sculas
function toFrontendPeriod(period: "MORNING" | "AFTERNOON" | "EVENING"): "morning" | "afternoon" | "evening" {
  return period.toLowerCase() as "morning" | "afternoon" | "evening"
}

// Fun��o auxiliar para converter array de days para string
function daysArrayToString(days: string[]): string {
  return days.join(",")
}

// Fun��o auxiliar para converter string de days para array
function daysStringToArray(days: string | null | undefined): string[] {
  if (!days) return []
  return days.split(",").filter(d => d.trim() !== "")
}

export async function getAllRoutines(): Promise<RoutineActivity[]> {
  const routines = await apiRequest<Array<{
    id: number
    title: string
    description: string | null
    time: string | null
    duration: number
    periodo: "MORNING" | "AFTERNOON" | "EVENING"
    days: string | null
    completed: boolean
  }>>("/routines/all", {
    method: "GET",
  })

  return routines.map(r => ({
    id: r.id,
    title: r.title,
    description: r.description || "",
    time: r.time || "00:00",
    duration: r.duration,
    period: toFrontendPeriod(r.periodo),
    days: daysStringToArray(r.days),
    completed: r.completed || false,
  }))
}

export async function getRoutineById(id: number): Promise<RoutineActivity> {
  const routine = await apiRequest<{
    id: number
    title: string
    description: string | null
    time: string | null
    duration: number
    periodo: "MORNING" | "AFTERNOON" | "EVENING"
    days: string | null
    completed: boolean
  }>(`/routines/${id}`, {
    method: "GET",
  })

  return {
    id: routine.id,
    title: routine.title,
    description: routine.description || "",
    time: routine.time || "00:00",
    duration: routine.duration,
    period: toFrontendPeriod(routine.periodo),
    days: daysStringToArray(routine.days),
    completed: routine.completed || false,
  }
}

export async function createRoutine(dto: {
  title: string
  description?: string
  time: string
  duration: number
  period: "morning" | "afternoon" | "evening"
  days: string[]
}): Promise<RoutineActivity> {
  const payload: RoutineCreateDTO = {
    title: dto.title,
    description: dto.description,
    time: dto.time,
    duration: dto.duration,
    periodo: toBackendPeriod(dto.period),
    days: daysArrayToString(dto.days),
  }

  const routine = await apiRequest<{
    id: number
    title: string
    description: string | null
    time: string | null
    duration: number
    periodo: "MORNING" | "AFTERNOON" | "EVENING"
    days: string | null
    completed: boolean
  }>("/routines", {
    method: "POST",
    body: JSON.stringify(payload),
  })

  return {
    id: routine.id,
    title: routine.title,
    description: routine.description || "",
    time: routine.time || "00:00",
    duration: routine.duration,
    period: toFrontendPeriod(routine.periodo),
    days: daysStringToArray(routine.days),
    completed: routine.completed || false,
  }
}

export async function updateRoutine(
  id: number,
  dto: {
    title: string
    description?: string
    time: string
    duration: number
    period: "morning" | "afternoon" | "evening"
    days: string[]
  }
): Promise<RoutineActivity> {
  const payload: RoutineCreateDTO = {
    title: dto.title,
    description: dto.description,
    time: dto.time,
    duration: dto.duration,
    periodo: toBackendPeriod(dto.period),
    days: daysArrayToString(dto.days),
  }

  const routine = await apiRequest<{
    id: number
    title: string
    description: string | null
    time: string | null
    duration: number
    periodo: "MORNING" | "AFTERNOON" | "EVENING"
    days: string | null
    completed: boolean
  }>(`/routines/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })

  return {
    id: routine.id,
    title: routine.title,
    description: routine.description || "",
    time: routine.time || "00:00",
    duration: routine.duration,
    period: toFrontendPeriod(routine.periodo),
    days: daysStringToArray(routine.days),
    completed: routine.completed || false,
  }
}

export async function deleteRoutine(id: number): Promise<void> {
  return apiRequest<void>(`/routines/${id}`, {
    method: "DELETE",
  })
}

export async function toggleRoutineComplete(id: number): Promise<RoutineActivity> {
  const routine = await apiRequest<{
    id: number
    title: string
    description: string | null
    time: string | null
    duration: number
    periodo: "MORNING" | "AFTERNOON" | "EVENING"
    days: string | null
    completed: boolean
  }>(`/routines/${id}/toggle`, {
    method: "PATCH",
  })

  return {
    id: routine.id,
    title: routine.title,
    description: routine.description || "",
    time: routine.time || "00:00",
    duration: routine.duration,
    period: toFrontendPeriod(routine.periodo),
    days: daysStringToArray(routine.days),
    completed: routine.completed || false,
  }
}

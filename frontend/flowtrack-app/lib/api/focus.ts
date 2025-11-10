import { apiRequest } from "./config"

/**
 * Interface da RESPOSTA que o backend envia
 * (Corresponde ao seu model FocusSession.java)
 */
export interface FocusSessionResponse {
  id: number
  inicio: string
  fim: string
  duracaoMin: number
  // adicione outros campos se seu model tiver (ex: pausada, tempoPausa)
}

/**
 * DTO para CRIAR uma nova sessão
 * (Corresponde ao seu FocusSessionCreateDTO.java)
 */
export interface FocusSessionCreateDTO {
  inicio: string
  fim: string
  duracaoMin: number
}

/**
 * Interface para as Configurações
 * (Corresponde ao seu FocusSettings.java e FocusSettingsDTO.java)
 */
export interface PomodoroSettings {
  id?: number
  focusTime: number
  shortBreakTime: number
  longBreakTime: number
  sessionsUntilLongBreak: number
  userId?: number
}

// --- Funções da API Corrigidas ---

/**
 * Get all focus sessions
 * Endpoint: GET /api/focus/sessions
 */
export async function getAllSessions(): Promise<FocusSessionResponse[]> {
  // Agora espera a resposta correta do backend
  return apiRequest<FocusSessionResponse[]>("/focus/sessions")
}

/**
 * Get sessions for a specific date
 * Endpoint: GET /api/focus/sessions?date=2025-10-20
 */
export async function getSessionsByDate(date: string): Promise<FocusSessionResponse[]> {
  return apiRequest<FocusSessionResponse[]>(`/focus/sessions?date=${date}`)
}

/**
 * Create a new focus session
 * Endpoint: POST /api/focus/sessions
 */
export async function createSession(session: FocusSessionCreateDTO): Promise<FocusSessionResponse> {
  // Agora aceita o DTO correto
  return apiRequest<FocusSessionResponse>("/focus/sessions", {
    method: "POST",
    body: JSON.stringify(session),
  })
}

/**
 * Get user's Pomodoro settings
 * Endpoint: GET /api/focus/settings
 */
export async function getPomodoroSettings(): Promise<PomodoroSettings> {
  return apiRequest<PomodoroSettings>("/focus/settings")
}

/**
 * Update Pomodoro settings
 * Endpoint: PUT /api/focus/settings
 */
export async function updatePomodoroSettings(settings: Omit<PomodoroSettings, "id" | "userId">): Promise<PomodoroSettings> {
  // O DTO do backend não precisa de ID ou userId
  return apiRequest<PomodoroSettings>("/focus/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  })
}

/**
 * Get focus statistics
 * Endpoint: GET /api/focus/stats
 */
export async function getFocusStats(): Promise<{
  totalSessions: number
  totalMinutes: number
  todaySessions: number
}> {
  return apiRequest("/focus/stats")
}
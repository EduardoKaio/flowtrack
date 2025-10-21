import { apiRequest } from "./config"

/**
 * Pomodoro session interface
 */
export interface FocusSession {
  id: number
  type: "focus" | "shortBreak" | "longBreak"
  duration: number
  completedAt: string
  userId?: number
}

/**
 * Pomodoro settings interface
 */
export interface PomodoroSettings {
  id?: number
  focusTime: number
  shortBreakTime: number
  longBreakTime: number
  sessionsUntilLongBreak: number
  userId?: number
}

/**
 * Get all focus sessions
 *
 * Endpoint: GET /api/focus/sessions
 *
 * Usage:
 * ```typescript
 * const sessions = await getAllSessions()
 * setSessions(sessions)
 * ```
 */
export async function getAllSessions(): Promise<FocusSession[]> {
  return apiRequest<FocusSession[]>("/focus/sessions")
}

/**
 * Get sessions for a specific date
 *
 * Endpoint: GET /api/focus/sessions?date=2025-10-20
 *
 * Usage:
 * ```typescript
 * const todaySessions = await getSessionsByDate("2025-10-20")
 * ```
 */
export async function getSessionsByDate(date: string): Promise<FocusSession[]> {
  return apiRequest<FocusSession[]>(`/focus/sessions?date=${date}`)
}

/**
 * Create a new focus session
 *
 * Endpoint: POST /api/focus/sessions
 *
 * Usage:
 * ```typescript
 * const session = await createSession({
 *   type: "focus",
 *   duration: 25,
 *   completedAt: new Date().toISOString()
 * })
 * ```
 */
export async function createSession(session: Omit<FocusSession, "id">): Promise<FocusSession> {
  return apiRequest<FocusSession>("/focus/sessions", {
    method: "POST",
    body: JSON.stringify(session),
  })
}

/**
 * Get user's Pomodoro settings
 *
 * Endpoint: GET /api/focus/settings
 *
 * Usage:
 * ```typescript
 * const settings = await getPomodoroSettings()
 * setSettings(settings)
 * ```
 */
export async function getPomodoroSettings(): Promise<PomodoroSettings> {
  return apiRequest<PomodoroSettings>("/focus/settings")
}

/**
 * Update Pomodoro settings
 *
 * Endpoint: PUT /api/focus/settings
 *
 * Usage:
 * ```typescript
 * const updatedSettings = await updatePomodoroSettings({
 *   focusTime: 25,
 *   shortBreakTime: 5,
 *   longBreakTime: 15,
 *   sessionsUntilLongBreak: 4
 * })
 * ```
 */
export async function updatePomodoroSettings(settings: Omit<PomodoroSettings, "id">): Promise<PomodoroSettings> {
  return apiRequest<PomodoroSettings>("/focus/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  })
}

/**
 * Get focus statistics
 *
 * Endpoint: GET /api/focus/stats
 *
 * Usage:
 * ```typescript
 * const stats = await getFocusStats()
 * // Returns: { totalSessions: 10, totalMinutes: 250, todaySessions: 2 }
 * ```
 */
export async function getFocusStats(): Promise<{
  totalSessions: number
  totalMinutes: number
  todaySessions: number
}> {
  return apiRequest("/focus/stats")
}

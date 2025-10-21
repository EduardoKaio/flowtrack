import { apiRequest } from "./config"

/**
 * Habit interface matching the backend model
 */
export interface Habit {
  id: number
  name: string
  description: string
  frequency: "diario" | "semanal"
  goal: number
  icon: string
  color: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Habit progress interface
 */
export interface HabitProgress {
  habitId: number
  completedDays: string[]
  currentStreak: number
  bestStreak: number
}

/**
 * Get all habits
 *
 * Endpoint: GET /api/habits
 *
 * Usage:
 * ```typescript
 * const habits = await getAllHabits()
 * setHabits(habits)
 * ```
 */
export async function getAllHabits(): Promise<Habit[]> {
  return apiRequest<Habit[]>("/habits")
}

/**
 * Get a single habit by ID
 *
 * Endpoint: GET /api/habits/{id}
 *
 * Usage:
 * ```typescript
 * const habit = await getHabitById(1)
 * ```
 */
export async function getHabitById(id: number): Promise<Habit> {
  return apiRequest<Habit>(`/habits/${id}`)
}

/**
 * Create a new habit
 *
 * Endpoint: POST /api/habits
 *
 * Usage:
 * ```typescript
 * const newHabit = await createHabit({
 *   name: "Exercícios",
 *   description: "30 minutos diários",
 *   frequency: "diario",
 *   goal: 7,
 *   icon: "💪",
 *   color: "bg-green-500"
 * })
 * ```
 */
export async function createHabit(habit: Omit<Habit, "id" | "createdAt" | "updatedAt">): Promise<Habit> {
  return apiRequest<Habit>("/habits", {
    method: "POST",
    body: JSON.stringify(habit),
  })
}

/**
 * Update an existing habit
 *
 * Endpoint: PUT /api/habits/{id}
 *
 * Usage:
 * ```typescript
 * const updatedHabit = await updateHabit(1, {
 *   name: "Exercícios Atualizados"
 * })
 * ```
 */
export async function updateHabit(id: number, habit: Partial<Habit>): Promise<Habit> {
  return apiRequest<Habit>(`/habits/${id}`, {
    method: "PUT",
    body: JSON.stringify(habit),
  })
}

/**
 * Delete a habit
 *
 * Endpoint: DELETE /api/habits/{id}
 *
 * Usage:
 * ```typescript
 * await deleteHabit(1)
 * ```
 */
export async function deleteHabit(id: number): Promise<void> {
  return apiRequest<void>(`/habits/${id}`, {
    method: "DELETE",
  })
}

/**
 * Get habit progress
 *
 * Endpoint: GET /api/habits/{id}/progress
 *
 * Usage:
 * ```typescript
 * const progress = await getHabitProgress(1)
 * ```
 */
export async function getHabitProgress(id: number): Promise<HabitProgress> {
  return apiRequest<HabitProgress>(`/habits/${id}/progress`)
}

/**
 * Toggle habit completion for today
 *
 * Endpoint: POST /api/habits/{id}/toggle
 *
 * Usage:
 * ```typescript
 * const progress = await toggleHabitToday(1)
 * ```
 */
export async function toggleHabitToday(id: number): Promise<HabitProgress> {
  return apiRequest<HabitProgress>(`/habits/${id}/toggle`, {
    method: "POST",
  })
}

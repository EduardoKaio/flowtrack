import { getPage, getPageByDateRange } from "../page"
import { apiRequest } from "./config"

/**
 * Mood entry interface
 */
export interface MoodEntry {
  id: number
  humor: string
  emoji: string
  energia: number
  estresse: number
  notas: string
  userId?: number
  dataCriacao: string
}

export type CreateMoodEntryDTO = {
  humor: number
  emoji: string
  energia: number
  estresse: number
  notas: string
}

/**
 * Get all mood entries
 *
 * Endpoint: GET /api/mood
 *
 * Usage:
 * ```typescript
 * const entries = await getAllMoodEntries()
 * setEntries(entries)
 * ```
 */
export async function getAllMoodEntries(params?: {
  page?: number
  size?: number
  sort?: string
}) {
  return getPage<MoodEntry>("/mood", params)
}

/**
 * Get mood entries for a specific date range
 *
 * Endpoint: GET /api/mood?startDate=2025-10-01&endDate=2025-10-31
 *
 * Usage:
 * ```typescript
 * const entries = await getMoodEntriesByDateRange("2025-10-01", "2025-10-31")
 * ```
 */
export async function getMoodEntriesByDateRange(
  startDate: string,
  endDate: string,
  params?: { page?: number; size?: number; sort?: string }
) {
  return getPageByDateRange<MoodEntry>("/mood", startDate, endDate, params)
}

/**
 * Get a single mood entry by ID
 *
 * Endpoint: GET /api/mood/{id}
 *
 * Usage:
 * ```typescript
 * const entry = await getMoodEntryById(1)
 * ```
 */
export async function getMoodEntryById(id: number): Promise<MoodEntry> {
  return apiRequest<MoodEntry>(`/mood/${id}`)
}

/**
 * Create a new mood entry
 *
 * Endpoint: POST /api/mood
 *
 * Usage:
 * ```typescript
 * const newEntry = await createMoodEntry({
 *   mood: "bom",
 *   emoji: "😊",
 *   energy: 7,
 *   stress: 4,
 *   notes: "Dia produtivo",
 *   date: "2025-10-20"
 * })
 * ```
 */
export async function createMoodEntry(entry: CreateMoodEntryDTO): Promise<MoodEntry> {
  return apiRequest<MoodEntry>("/mood", {
    method: "POST",
    body: JSON.stringify(entry),
  })
}

/**
 * Update an existing mood entry
 *
 * Endpoint: PUT /api/mood/{id}
 *
 * Usage:
 * ```typescript
 * const updatedEntry = await updateMoodEntry(1, {
 *   notes: "Notas atualizadas"
 * })
 * ```
 */
export async function updateMoodEntry(id: number, entry: Partial<CreateMoodEntryDTO>): Promise<MoodEntry> {
  return apiRequest<MoodEntry>(`/mood/${id}`, {
    method: "PUT",
    body: JSON.stringify(entry),
  })
}

/**
 * Delete a mood entry
 *
 * Endpoint: DELETE /api/mood/{id}
 *
 * Usage:
 * ```typescript
 * await deleteMoodEntry(1)
 * ```
 */
export async function deleteMoodEntry(id: number): Promise<void> {
  return apiRequest<void>(`/mood/${id}`, {
    method: "DELETE",
  })
}

/**
 * Get mood statistics
 *
 * Endpoint: GET /api/mood/stats
 *
 * Usage:
 * ```typescript
 * const stats = await getMoodStats()
 * // Returns: { averageMood: 4.2, averageEnergy: 7.5, averageStress: 4.8 }
 * ```
 */
export async function getMoodStats(): Promise<{
  averageMood: number
  averageEnergy: number
  averageStress: number
}> {
  return apiRequest("/mood/stats")
}

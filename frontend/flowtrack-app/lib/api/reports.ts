import { apiRequest } from "./config"

/**
 * Dashboard statistics interface
 */
export interface DashboardStats {
  tasksCompleted: number
  tasksTotal: number
  focusMinutesToday: number
  habitsCompletedToday: number
  habitsTotal: number
  currentMood: string
  currentMoodEmoji: string
}

/**
 * Weekly progress data
 */
export interface WeeklyProgress {
  date: string
  tasksCompleted: number
  focusMinutes: number
}

/**
 * Category statistics
 */
export interface CategoryStats {
  categoryId: string
  categoryName: string
  taskCount: number
  completedCount: number
  percentage: number
}

/**
 * Achievement interface
 */
export interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  unlockedAt?: string
  progress: number
  target: number
}

/**
 * Get dashboard statistics
 *
 * Endpoint: GET /api/reports/dashboard
 *
 * Usage:
 * ```typescript
 * const stats = await getDashboardStats()
 * // Use stats to populate dashboard cards
 * ```
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>("/reports/dashboard")
}

/**
 * Get weekly progress data
 *
 * Endpoint: GET /api/reports/weekly
 *
 * Usage:
 * ```typescript
 * const weeklyData = await getWeeklyProgress()
 * // Use weeklyData to populate charts
 * ```
 */
export async function getWeeklyProgress(): Promise<WeeklyProgress[]> {
  return apiRequest<WeeklyProgress[]>("/reports/weekly")
}

/**
 * Get category statistics
 *
 * Endpoint: GET /api/reports/categories
 *
 * Usage:
 * ```typescript
 * const categoryStats = await getCategoryStats()
 * // Display category breakdown
 * ```
 */
export async function getCategoryStats(): Promise<CategoryStats[]> {
  return apiRequest<CategoryStats[]>("/reports/categories")
}

/**
 * Get user achievements
 *
 * Endpoint: GET /api/reports/achievements
 *
 * Usage:
 * ```typescript
 * const achievements = await getAchievements()
 * // Display unlocked and locked achievements
 * ```
 */
export async function getAchievements(): Promise<Achievement[]> {
  return apiRequest<Achievement[]>("/reports/achievements")
}

/**
 * Get productivity report for a date range
 *
 * Endpoint: GET /api/reports/productivity?startDate=2025-10-01&endDate=2025-10-31
 *
 * Usage:
 * ```typescript
 * const report = await getProductivityReport("2025-10-01", "2025-10-31")
 * ```
 */
export async function getProductivityReport(
  startDate: string,
  endDate: string,
): Promise<{
  totalTasks: number
  completedTasks: number
  totalFocusMinutes: number
  totalHabitsCompleted: number
  averageMood: number
}> {
  return apiRequest(`/reports/productivity?startDate=${startDate}&endDate=${endDate}`)
}

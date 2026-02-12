import { apiRequest } from "./config"

export interface UserSettings {
  theme: string
  notifications: boolean
  soundEnabled: boolean
  language: string
  enabledModules: Record<string, boolean>
}

export interface UserSettingsUpdate {
  theme?: string
  notifications?: boolean
  soundEnabled?: boolean
  language?: string
  enabledModules?: Record<string, boolean>
}

/**
 * Get user settings
 * Endpoint: GET /api/settings
 */
export async function getUserSettings(): Promise<UserSettings> {
  return apiRequest<UserSettings>("/settings")
}

/**
 * Update user settings
 * Endpoint: PUT /api/settings
 */
export async function updateUserSettings(settings: UserSettingsUpdate): Promise<UserSettings> {
  return apiRequest<UserSettings>("/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  })
}

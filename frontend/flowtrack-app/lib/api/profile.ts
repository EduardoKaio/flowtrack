import { apiRequest } from "./config"

export interface Profile {
  id: number
  nome: string
  email: string
  bio?: string
  location?: string
  avatarUrl?: string
  joinDate?: string
  telefone?: string
  endereco?: string
}

export interface ProfileUpdate {
  nome?: string
  bio?: string
  location?: string
  telefone?: string
  endereco?: string
}

export interface PasswordChange {
  currentPassword: string
  newPassword: string
}

/**
 * Get user profile
 * Endpoint: GET /api/profile
 */
export async function getProfile(): Promise<Profile> {
  return apiRequest<Profile>("/profile")
}

/**
 * Update user profile
 * Endpoint: PUT /api/profile
 */
export async function updateProfile(profile: ProfileUpdate): Promise<Profile> {
  return apiRequest<Profile>("/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  })
}

/**
 * Upload avatar image
 * Endpoint: POST /api/profile/avatar
 */
export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData()
  formData.append("file", file)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Erro ao fazer upload" }))
    throw new Error(error.error || "Erro ao fazer upload da imagem")
  }

  return response.json()
}

/**
 * Change password
 * Endpoint: PUT /api/profile/password
 */
export async function changePassword(passwordData: PasswordChange): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/profile/password", {
    method: "PUT",
    body: JSON.stringify(passwordData),
  })
}

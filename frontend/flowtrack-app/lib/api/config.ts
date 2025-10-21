// config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

/**
 * API request helper with error handling
 */
export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    })

    let data: any = null
    try {
      data = await response.json()
    } catch (err) {
      // se não for JSON, ignora
    }

    if (!response.ok) {
      const message = data?.message || `API Error: ${response.status} ${response.statusText}`
      throw new Error(message)
    }

    return data as T
  } catch (error: any) {
    console.error(`[API Request Error] ${endpoint}:`, error)
    throw error
  }
}

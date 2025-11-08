import { apiRequest } from "./api/config"

export type Page<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number // página atual (0-based)
  size: number
  first: boolean
  last: boolean
}

// Função genérica para buscar uma página de qualquer recurso
export async function getPage<T>(
  endpoint: string,
  params?: {
    page?: number
    size?: number
    sort?: string
  }
): Promise<Page<T>> {
  const { page = 0, size = 10, sort = "id,desc" } = params ?? {}
  const url = `${endpoint}?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`
  return apiRequest<Page<T>>(url)
}

// Função genérica para buscar página filtrando por intervalo de datas
export async function getPageByDateRange<T>(
  endpoint: string,
  startDate: string,
  endDate: string,
  params?: { page?: number; size?: number; sort?: string }
): Promise<Page<T>> {
  const { page = 0, size = 10, sort = "id,desc" } = params ?? {}
  const qs = new URLSearchParams({
    startDate,
    endDate,
    page: String(page),
    size: String(size),
    sort,
  })
  return apiRequest<Page<T>>(`${endpoint}/search?${qs.toString()}`)
}

export async function getTasksByQuery<T>(
    endpoint: string,
    query: string,
    params?: { page?: number; size?: number; sort?: string }
): Promise<Page<T>> {
    const { page = 0, size = 10, sort = "id,desc" } = params ?? {}
    const qs = new URLSearchParams({
        query,
        page: String(page),
        size: String(size),
        sort,
    })
    return apiRequest<Page<T>>(`${endpoint}/search?${qs.toString()}`)
}
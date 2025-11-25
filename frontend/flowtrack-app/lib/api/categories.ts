import { apiRequest } from "./config"

export interface Category {
  id: number
  name: string
  color: string
  taskCount: number
}

export interface CategoryCreateRequest extends Omit<Category, "id" | "taskCount"> {}

export async function getCategories(): Promise<Category[]> {
  try {
    const result = await apiRequest<Category[]>(`/categories`, {
    method: "GET",
  })
    // Garantir que sempre retorna um array
    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function createCategory(dto: CategoryCreateRequest): Promise<Category> {
  return apiRequest<Category>(`/categories`, {
    method: "POST",
    body: JSON.stringify(dto),
  })
}

export async function deleteOrHideCategory(categoryId: number): Promise<void> {
  return apiRequest<void>(`/categories/${categoryId}`, {
    method: "DELETE",
  })
}

export async function editCategory(categoryId: number, dto: Partial<Omit<Category, "id" | "taskCount">>): Promise<Category> {
  return apiRequest<Category>(`/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  })
}

import { apiRequest } from "./config"

export interface Category {
  id: number
  name: string
  color: string
  taskCount: number
}

export interface CategoryCreateRequest extends Omit<Category, "id" | "taskCount"> {}

export async function getCategories(userId: number): Promise<Category[]> {
  return apiRequest<Category[]>(`/categories?userId=${userId}`, {
    method: "GET",
  })
}

export async function createCategory(userId: number, dto: CategoryCreateRequest): Promise<Category> {
  return apiRequest<Category>(`/categories?userId=${userId}`, {
    method: "POST",
    body: JSON.stringify(dto),
  })
}

export async function deleteOrHideCategory(userId: number, categoryId: number): Promise<void> {
  return apiRequest<void>(`/categories/${categoryId}?userId=${userId}`, {
    method: "DELETE",
  })
}

export async function editCategory(categoryId: number, dto: Partial<Omit<Category, "id" | "taskCount">>): Promise<Category> {
  return apiRequest<Category>(`/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  })
}

import { apiRequest } from "./config"

/**
 * Category interface matching the backend model
 */
export interface Category {
  id: string
  name: string
  color: string
  taskCount: number
  createdAt?: string
  updatedAt?: string
}

/**
 * Get all categories
 *
 * Endpoint: GET /api/categories
 *
 * Usage:
 * ```typescript
 * const categories = await getAllCategories()
 * setCategories(categories)
 * ```
 */
export async function getAllCategories(): Promise<Category[]> {
  return apiRequest<Category[]>("/categories")
}

/**
 * Get a single category by ID
 *
 * Endpoint: GET /api/categories/{id}
 *
 * Usage:
 * ```typescript
 * const category = await getCategoryById("trabalho")
 * ```
 */
export async function getCategoryById(id: string): Promise<Category> {
  return apiRequest<Category>(`/categories/${id}`)
}

/**
 * Create a new category
 *
 * Endpoint: POST /api/categories
 *
 * Usage:
 * ```typescript
 * const newCategory = await createCategory({
 *   id: "trabalho",
 *   name: "Trabalho",
 *   color: "bg-blue-500",
 *   taskCount: 0
 * })
 * ```
 */
export async function createCategory(category: Omit<Category, "createdAt" | "updatedAt">): Promise<Category> {
  return apiRequest<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(category),
  })
}

/**
 * Update an existing category
 *
 * Endpoint: PUT /api/categories/{id}
 *
 * Usage:
 * ```typescript
 * const updatedCategory = await updateCategory("trabalho", {
 *   name: "Trabalho Atualizado",
 *   color: "bg-green-500"
 * })
 * ```
 */
export async function updateCategory(id: string, category: Partial<Category>): Promise<Category> {
  return apiRequest<Category>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(category),
  })
}

/**
 * Delete a category
 *
 * Endpoint: DELETE /api/categories/{id}
 *
 * Usage:
 * ```typescript
 * await deleteCategory("trabalho")
 * ```
 */
export async function deleteCategory(id: string): Promise<void> {
  return apiRequest<void>(`/categories/${id}`, {
    method: "DELETE",
  })
}

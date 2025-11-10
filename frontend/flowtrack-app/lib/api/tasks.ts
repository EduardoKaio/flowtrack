import { apiRequest } from "./config"
import { getPage, getPageByDateRange, getTasksByQuery } from "../page"

/**
 * Task interface matching the backend model
 */
export interface Task {
  id: number
  titulo: string
  descricao: string
  categoriaId: number
  prioridade: string
  dataConclusao: string
  concluida: boolean
  userId?: number 
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: number,
  name: string,
  color: string
}

export interface ResponseTaskDTO {
  titulo: string
  descricao: string
  categoriaId: number | undefined
  prioridade: number
  dataConclusao: string
  concluida: boolean
}

/**
 * Get all tasks
 *
 * Endpoint: GET /api/tasks
 *
 * Usage:
 * ```typescript
 * const tasks = await getAllTasks()
 * setTasks(tasks)
 * ```
 */
export async function getAllTasks( params?: {
  page?: number
  size?: number
  sort?: string
}) {
  return getPage<Task>("/tasks",  params)
}

/**
 * Get a single task by ID
 *
 * Endpoint: GET /api/tasks/{id}
 *
 * Usage:
 * ```typescript
 * const task = await getTaskById(1)
 * ```
 */
export async function getTaskById(id: number): Promise<Task> {
  return apiRequest<Task>(`/tasks/${id}`)
}

/**
 * Create a new task
 *
 * Endpoint: POST /api/tasks
 *
 * Usage:
 * ```typescript
 * const newTask = await createTask({
 *   title: "Nova Tarefa",
 *   description: "Descrição",
 *   category: "trabalho",
 *   priority: "alta",
 *   dueDate: "2025-10-20",
 *   completed: false
 * })
 * ```
 */
export async function createTask(task: ResponseTaskDTO): Promise<Task> {
  return apiRequest<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  })
}

/**
 * Update an existing task
 *
 * Endpoint: PUT /api/tasks/{id}
 *
 * Usage:
 * ```typescript
 * const updatedTask = await updateTask(1, {
 *   ...existingTask,
 *   completed: true
 * })
 * ```
 */
export async function updateTask(id: number, task: Partial<ResponseTaskDTO>): Promise<Task> {
  return apiRequest<Task>(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  })
}

/**
 * Delete a task
 *
 * Endpoint: DELETE /api/tasks/{id}
 *
 * Usage:
 * ```typescript
 * await deleteTask(1)
 * ```
 */
export async function deleteTask(id: number): Promise<void> {
  return apiRequest<void>(`/tasks/${id}`, {
    method: "DELETE",
  })
}

/**
 * Toggle task completion status
 *
 * Endpoint: PATCH /api/tasks/{id}/toggle
 *
 * Usage:
 * ```typescript
 * const task = await toggleTaskCompletion(1)
 * ```
 */
export async function toggleTaskCompletion(id: number): Promise<Task> {
  return apiRequest<Task>(`/tasks/${id}/toggle`, {
    method: "PATCH",
  })
}

// export async function searchTasks(query: string): Promise<Task[]> {
//   // Usa o mesmo valor para título e descrição para busca simples
//   const params = new URLSearchParams({
//     titulo: query,
//     descricao: query,
//   });
//   const pageable = await apiRequest<{ content: Task[] }>(`/tasks/search?${params.toString()}`);
//   return pageable.content;
// }

export async function searchTasks(
  query: string,
  params?: { page?: number; size?: number; sort?: string }
) {
  return getTasksByQuery<Task>("/tasks", query, params)
}
import { apiRequest } from "./config"

/**
 * Task interface matching the backend model
 */
export interface Task {
  id: number
  title: string
  description: string
  category: string
  priority: "baixa" | "média" | "alta"
  dueDate: string
  completed: boolean
  createdAt?: string
  updatedAt?: string
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
export async function getAllTasks(): Promise<Task[]> {
  return apiRequest<Task[]>("/tasks")
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
export async function createTask(task: Omit<Task, "id">): Promise<Task> {
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
export async function updateTask(id: number, task: Partial<Task>): Promise<Task> {
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

import { apiRequest } from "./config"

/**
 * Interface de lembrete correspondente ao modelo do backend
 */
export interface Reminder {
  id: number
  titulo: string
  descricao: string
  dataHora: string
  ativo: boolean
}

/**
 * DTO para criar/atualizar lembrete
 */
export interface ReminderInputDTO {
  titulo: string
  descricao?: string
  dataHora: string
  ativo?: boolean
}

/**
 * Listar todos os lembretes do usuário
 * Endpoint: GET /api/reminders
 */
export async function getAllReminders(query?: string): Promise<Reminder[]> {
  const endpoint = query ? `/reminders?query=${encodeURIComponent(query)}` : "/reminders"
  return apiRequest<Reminder[]>(endpoint, {
    method: "GET",
  })
}

/**
 * Obter lembrete por ID
 * Endpoint: GET /api/reminders/{id}
 */
export async function getReminderById(id: number): Promise<Reminder> {
  return apiRequest<Reminder>(`/reminders/${id}`, {
    method: "GET",
  })
}

/**
 * Criar novo lembrete
 * Endpoint: POST /api/reminders
 */
export async function createReminder(dto: ReminderInputDTO): Promise<Reminder> {
  return apiRequest<Reminder>("/reminders", {
    method: "POST",
    body: JSON.stringify(dto),
  })
}

/**
 * Atualizar lembrete existente
 * Endpoint: PUT /api/reminders/{id}
 */
export async function updateReminder(id: number, dto: ReminderInputDTO): Promise<Reminder> {
  return apiRequest<Reminder>(`/reminders/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  })
}

/**
 * Deletar lembrete
 * Endpoint: DELETE /api/reminders/{id}
 */
export async function deleteReminder(id: number): Promise<void> {
  return apiRequest<void>(`/reminders/${id}`, {
    method: "DELETE",
  })
}


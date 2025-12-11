// /lib/api/users.ts

import { apiRequest } from "./config"

// --- INTERFACES ---

/**
 * Interface de usuário correspondente ao modelo do backend
 */
export interface User {
  id: number
  nome: string
  email: string
  role: "ADMIN" | "USER"
}

/**
 * DTO para registro de usuário
 */
export interface UserRegisterDTO {
  nome: string
  cpf?: string
  dataNascimento?: string
  telefone?: string
  endereco?: string
  email: string
  senha: string
}

/**
 * DTO para login de usuário
 */
export interface UserLoginDTO {
  email: string
  senha: string
}

/**
 * Resposta de autenticação com token JWT
 */
export interface AuthResponse {
  token: string
  user: User
}

/**
 * Interface que espelha a resposta Page<T> do Spring Boot
 */
export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number // A página atual (0-indexed)
  size: number
}

/**
 * Parâmetros para a função getAllUsers
 */
export interface GetAllUsersParams {
  page: number
  size: number
  query: string
}

// --- FUNÇÕES DE AUTENTICAÇÃO ---

/**
 * Interface de resposta de registro
 */
export interface RegisterResponse {
  message: string
}

/**
 * Registrar novo usuário
 * Retorna apenas uma mensagem de sucesso (sem token)
 */
export async function registerUser(dto: UserRegisterDTO): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(dto),
  })
}

/**
 * Login de usuário
 *
 * Retorna o token JWT e o usuário completo se email e senha estiverem corretos
 */
export async function loginUser(dto: UserLoginDTO): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(dto),
  })
}

// --- FUNÇÕES DE ADMIN ---

/**
 * Pegar todos os usuários (somente admin)
 * AGORA COM PAGINAÇÃO E BUSCA
 */
export async function getAllUsers(
  params: GetAllUsersParams
): Promise<PageResponse<User>> {
  const { page, size, query } = params

  // Constrói os parâmetros da URL
  const queryParams = new URLSearchParams()
  queryParams.append("page", page.toString())
  queryParams.append("size", size.toString())
  queryParams.append("sort", "email,asc") // Mudado de "nome,asc" para "email,asc"

  // Adiciona o parâmetro de busca se ele existir
  if (query && query.trim() !== "") {
    queryParams.append("query", query.trim())
  }

  return apiRequest<PageResponse<User>>(`/users?${queryParams.toString()}`, {
    method: "GET",
  })
}

/**
 * Pegar usuário por ID (somente admin)
 */
export async function getUserById(id: number): Promise<User> {
  return apiRequest<User>(`/users/${id}`)
}

/**
 * Atualizar usuário (somente admin)
 */
export async function updateUser(
  id: number,
  data: Partial<User>
): Promise<User> {
  console.log("Enviando update:", data)
  return apiRequest<User>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * Deletar usuário (somente admin)
 */
export async function deleteUser(id: number): Promise<void> {
  return apiRequest<void>(`/users/${id}`, {
    method: "DELETE",
  })
}
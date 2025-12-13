// config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

/**
 * Get JWT token from localStorage
 */
const TOKEN_KEY = "token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Set JWT token in localStorage
 */
export function setToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, token)
  
  // Salva em cookie com opcoes corretas para o middleware acessar
  // max-age de 7 dias, SameSite=Lax para seguranca, path=/ para estar disponivel em todas as rotas
  const isSecure = window.location.protocol === 'https:'
  const cookieOptions = [
    `token=${token}`,
    'path=/',
    `max-age=${60 * 60 * 24 * 7}`,
    'SameSite=Lax'
  ]
  
  // So adicionar Secure se estiver em HTTPS
  if (isSecure) {
    cookieOptions.push('Secure')
  }
  
  document.cookie = cookieOptions.join('; ')
}

/**
 * Remove JWT token from localStorage
 */
export function removeToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
  // Remove o cookie tambem
  document.cookie = "token=; path=/; max-age=0"
}

/**
 * API request helper with error handling and JWT token
 */
export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getToken()
  
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  }
  
  // Nao adicionar token em rotas de autenticacao
  if (token && !endpoint.startsWith("/auth/")) {
    defaultHeaders["Authorization"] = `Bearer ${token}`
    console.log(`[API] Request to ${endpoint} with token: ${token.substring(0, 20)}...`)
  } else if (!token && !endpoint.startsWith("/auth/")) {
    // So avisar se nao for rota de autenticacao
    console.warn(`[API] No token found for request to ${endpoint}. Redirecting to login...`)
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login"
      throw new Error("No authentication token found")
    }
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
    const contentType = response.headers.get("content-type")
    const isJson = contentType && contentType.includes("application/json")
    
    // Ler o body apenas uma vez - usar response.json() ou response.text() mas nunca ambos
    try {
      // Verificar se ha conteudo antes de tentar ler
      const contentLength = response.headers.get("content-length")
      if (contentLength === "0" || (!contentLength && !isJson)) {
        // Resposta vazia ou sem Content-Length
        data = null
      } else if (isJson) {
        // Se for JSON, usar response.json() diretamente
        data = await response.json()
      } else {
        // Se nao for JSON, ler como texto e tentar parsear
        const text = await response.text()
        if (text && text.trim().length > 0) {
          try {
            data = JSON.parse(text)
          } catch {
            // Se nao for JSON valido, logar o conteudo
            console.warn(`[API] Response is not valid JSON for ${endpoint}. Content-Type: ${contentType}, Length: ${text.length}`)
            if (text.length < 500) {
              console.warn(`[API] Response content: ${text.substring(0, 200)}`)
            }
            data = null
          }
        } else {
          data = null
        }
      }
    } catch (err: any) {
      // Se der erro ao ler o body, verificar o tipo de erro
      if (err.name === 'TypeError' && (err.message.includes('Content-Length') || err.message.includes('body'))) {
        // Erro de Content-Length ou body - resposta pode estar vazia
        console.warn(`[API] Content-Length/body error for ${endpoint} - treating as empty response`)
        data = null
      } else if (err.name === 'SyntaxError') {
        // Erro de sintaxe JSON
        console.error(`[API] JSON syntax error for ${endpoint}:`, err.message)
        data = null
      } else {
        console.error(`[API] Error reading response for ${endpoint}:`, err.name, err.message)
        data = null
      }
    }

    if (!response.ok) {
      // Se for erro 401 ou 403 (nao autorizado/proibido), remove o token e redireciona
      if (response.status === 401 || response.status === 403) {
        console.warn(`[API] Authentication error (${response.status}) for ${endpoint}. Token: ${token ? 'present' : 'missing'}`)
        removeToken()
        localStorage.removeItem("isAuthenticated")
        
        if (typeof window !== "undefined" && !endpoint.startsWith("/auth/")) {
          window.location.href = "/auth/login"
        }
        
        const message = data?.message || `Erro de autenticacao: ${response.status} ${response.statusText}`
        throw new Error(message)
      }
      
      // Para outros erros, lanca excecao com mensagem
      const message = data?.message || data?.error || `API Error: ${response.status} ${response.statusText}`
      console.error(`[API] Error ${response.status} for ${endpoint}:`, message, data)
      throw new Error(message)
    }

    // Se a resposta esta OK mas nao tem dados JSON validos
    if (data === null && response.ok) {
      console.warn(`[API] Empty or non-JSON response for ${endpoint}. Status: ${response.status}, Content-Type: ${contentType}`)
      // Se for uma lista esperada, retorna array vazio
      if (endpoint.includes('categories') || endpoint.includes('tasks') || endpoint.includes('habits')) {
        return [] as T
      }
      // Caso contrario, retorna null
      return null as T
    }

    return data as T
  } catch (error: any) {
    console.error(`[API Request Error] ${endpoint}:`, error)
    throw error
  }
}
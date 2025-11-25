/**
 * Utilitário para trabalhar com datas no timezone local (Brasil)
 */

/**
 * Retorna a data de hoje no formato YYYY-MM-DD no timezone de Brasília (America/Sao_Paulo)
 */
export function getTodayLocalDate(): string {
  const now = new Date()
  // Usar Intl.DateTimeFormat para garantir o timezone correto de Brasília
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
  const result = formatter.format(now)
  return result
}
  
/**
 * Converte uma data para string no formato YYYY-MM-DD no timezone local (Brasil)
 */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

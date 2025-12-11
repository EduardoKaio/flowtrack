import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/welcome']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Se for rota pública, permite acesso
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Verifica se há token no cookie
  const token = request.cookies.get('token')?.value

  // Se não houver token e não for rota pública, redireciona para login
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    // Usa redirect permanente para garantir que o navegador não tente renderizar
    return NextResponse.redirect(loginUrl, 307) // 307 = Temporary Redirect
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

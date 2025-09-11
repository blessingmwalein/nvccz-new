import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get token from cookies
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token'
  const token = request.cookies.get(tokenKey)?.value
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/api/auth/login']
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // If user is not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If user is authenticated and trying to access login page
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

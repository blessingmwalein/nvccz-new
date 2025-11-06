import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token')
  const userProfile = request.cookies.get(process.env.NEXT_PUBLIC_AUTH_PROFILE_KEY || 'userProfile')
  
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/applications/form']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If accessing public route and authenticated, redirect to appropriate dashboard
  if (isPublicRoute && token && userProfile) {
    try {
      const profile = JSON.parse(decodeURIComponent(userProfile.value))
      const roleName = profile.role?.name?.toLowerCase()
      
      const roleRedirects: Record<string, string> = {
        'applicant': '/application-portal',
        'admin': '/admin',
        // 'investment_manager': '/investments/dashboard',
        // 'board_member': '/board/dashboard',
        // 'analyst': '/analytics/dashboard',
        // 'finance': '/finance/dashboard',
        // 'compliance': '/compliance/dashboard'
      }
      
      const redirectPath = roleRedirects[roleName] || '/'
      return NextResponse.redirect(new URL(redirectPath, request.url))
    } catch (error) {
      console.error('Error parsing user profile:', error)
    }
  }

  // If accessing protected route without auth, redirect to login
  if (!isPublicRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access
  if (!isPublicRoute && token && userProfile) {
    try {
      const profile = JSON.parse(decodeURIComponent(userProfile.value))
      const roleName = profile.role?.name?.toLowerCase()

      // Admin has access to all routes
      if (roleName === 'admin') {
        return NextResponse.next()
      }

      // Define route access patterns for other roles
      const roleRouteAccess: Record<string, string[]> = {
        'applicant': ['/application-portal', '/profile', '/settings'],
        'investment_manager': ['/investments', '/applications', '/portfolio', '/due-diligence', '/board-review', '/term-sheets', '/reports', '/profile', '/settings'],
        'board_member': ['/board', '/applications', '/portfolio', '/reports', '/profile', '/settings'],
        'analyst': ['/analytics', '/applications', '/portfolio', '/reports', '/profile', '/settings'],
        'finance': ['/finance', '/investments', '/portfolio', '/reports', '/profile', '/settings'],
        'compliance': ['/compliance', '/applications', '/portfolio', '/reports', '/profile', '/settings']
      }

      const allowedRoutes = roleRouteAccess[roleName] || []
      const publicAuthRoutes = ['/profile', '/settings', '/help', '/notifications']

      // Check if user has access to the route
      const hasAccess = allowedRoutes.some(route => pathname.startsWith(route)) || 
                       publicAuthRoutes.some(route => pathname.startsWith(route))

      if (!hasAccess) {
        // Redirect to their default dashboard if they don't have access
        const roleRedirects: Record<string, string> = {
          'applicant': '/application-portal',
          // 'investment_manager': '/investments/dashboard',
          // 'board_member': '/board/dashboard',
          // 'analyst': '/analytics/dashboard',
          // 'finance': '/finance/dashboard',
          // 'compliance': '/compliance/dashboard'
        }
        
        const redirectPath = roleRedirects[roleName] || '/'
        return NextResponse.redirect(new URL(redirectPath, request.url))
      }
    } catch (error) {
      console.error('Error checking route access:', error)
      // If there's an error parsing profile, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
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

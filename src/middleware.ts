import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Define public paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') || // Allow login API
    pathname === '/login' ||
    pathname === '/' || // Allow Landing Page
    pathname === '/favicon.ico' ||
    pathname.startsWith('/public') // QR Code public page
  ) {
    return NextResponse.next()
  }

  // 2. Access Session
  const cookie = request.cookies.get('session')?.value
  const session = cookie ? await verifySession(cookie) : null

  // 3. Unauthenticated -> Redirect to Login
  if (!session) {
    const loginUrl = new URL('/login', request.url)
    // Optional: Add ?callbackUrl=... 
    return NextResponse.redirect(loginUrl)
  }

  // 4. Role & Location Based Access Control (RBAC)
  // Logic: 
  // - If URL contains /posyandu/[id]
  // - Check if user is KADER and session.posyanduId != [id]
  // - Redirect to correct dashboard or 403
  
  // Parse Posyandu ID from URL (Assumes /dashboard/posyandu/[id])
  // For now, we will just ensure they are logged in.
  
  // Specific Rule from User: "Kader RW 01... redirect jika mencoba mengakses URL yang mengandung ID RW 02"
  // Assuming URL structure /posyandu/[posyanduId]
  const posyanduMatch = pathname.match(/\/posyandu\/([^\/]+)/)
  if (posyanduMatch) {
    const targetPosyanduId = posyanduMatch[1]
    const userRole = session.role as string
    const userPosyanduId = session.posyanduId as string

    // If KADER tries to access different posyandu
    if (userRole === 'KADER' && userPosyanduId !== targetPosyanduId) {
      // Redirect to their own posyandu dashboard or show error
      // Ideally redirect to their OWN dashboard
      return NextResponse.redirect(new URL(`/posyandu/${userPosyanduId}`, request.url))
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
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

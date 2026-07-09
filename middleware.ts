import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

const publicRoutes = ['/', '/login', '/register']
const staticRoutes = ['/_next', '/uploads', '/favicon.ico']

const rateLimit = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT_MAX = 100
const RATE_LIMIT_WINDOW = 60000

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const adminToken = request.cookies.get('admin_token')?.value
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'

  // Rate Limit
  const now = Date.now()
  const record = rateLimit.get(ip)
  if (!record || now > record.reset) {
    rateLimit.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW })
  } else {
    if (record.count >= RATE_LIMIT_MAX) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
    record.count++
  }

  // Skip static
  if (staticRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // API
  if (pathname.startsWith('/api')) {
    if (pathname === '/api/auth/login' || pathname === '/api/auth/register' || pathname === '/api/health') {
      return NextResponse.next()
    }
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    return NextResponse.next()
  }

  // Logout
  if (pathname === '/logout') {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    response.cookies.delete('admin_token')
    return response
  }

  // Public routes
  if (publicRoutes.includes(pathname)) {
    if (token) {
      const isValid = await verifyToken(token)
      if (isValid) {
        return NextResponse.redirect(new URL('/game', request.url))
      }
    }
    return NextResponse.next()
  }

  // Admin
  if (pathname.startsWith('/admin')) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Protected
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const isValid = await verifyToken(token)
  if (!isValid) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/game/:path*',
    '/tap/:path*',
    '/convert/:path*',
    '/deposit/:path*',
    '/withdraw/:path*',
    '/claim/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/logout',
    '/api/:path*',
  ]
}
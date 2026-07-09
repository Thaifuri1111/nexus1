import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'change-this-secret-in-production'
)

export async function generateToken(userId: string): Promise<string> {
  return await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<{ id: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { id: string }
  } catch {
    return null
  }
}

export async function getSession(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return null

  const decoded = await verifyToken(token)
  if (!decoded) return null

  return await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      phone: true,
      username: true,
      balance: true,
      keys: true,
      taps: true,
      maxTaps: true,
      tapCoins: true,
      status: true,
      isVip: true,
      referralCode: true,
      createdAt: true,
    }
  })
}

export async function setAuthCookie(token: string) {
  const { cookies } = await import('next/headers')
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function removeAuthCookie() {
  const { cookies } = await import('next/headers')
  cookies().delete('token')
  cookies().delete('admin_token')
}

export async function getAdminSession(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return null

  const decoded = await verifyToken(token)
  if (!decoded) return null

  return await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      phone: true,
      username: true,
      role: true,
    }
  })
}
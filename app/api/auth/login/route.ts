import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/bcrypt'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const passwordValid = await verifyPassword(password, user.password)
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await generateToken(user.id, user.isAdmin)

    const response = NextResponse.json(
      { success: true, user },
      { status: 200 }
    )

    if (user.isAdmin) {
      response.cookies.set('admin_token', token, { httpOnly: true, maxAge: 604800 })
    } else {
      response.cookies.set('token', token, { httpOnly: true, maxAge: 604800 })
    }

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
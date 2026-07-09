import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/bcrypt'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json()

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        name,
        password: hashedPassword,
        isAdmin: false,
      }
    })

    const token = await generateToken(user.id, false)

    const response = NextResponse.json(
      { success: true, user },
      { status: 201 }
    )
    response.cookies.set('token', token, { httpOnly: true, maxAge: 604800 })
    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
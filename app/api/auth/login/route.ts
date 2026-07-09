import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/bcrypt'
import { generateToken, setAuthCookie } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  phone: z.string().min(10),
  password: z.string().min(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = loginSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { phone: validated.phone },
    })

    if (!user) {
      return NextResponse.json({ error: 'Nomor HP tidak ditemukan' }, { status: 404 })
    }

    const isValid = await comparePassword(validated.password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 })
    }

    const token = await generateToken(user.id)
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        username: user.username,
        balance: user.balance,
        keys: user.keys,
        taps: user.taps,
        maxTaps: user.maxTaps,
        tapCoins: user.tapCoins,
        status: user.status,
        isVip: user.isVip,
        referralCode: user.referralCode,
        role: user.role,
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
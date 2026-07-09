import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/bcrypt'
import { generateToken, setAuthCookie } from '@/lib/auth'
import { generateReferralCode } from '@/lib/utils'
import { validatePhone, formatPhone } from '@/lib/phone'
import { z } from 'zod'

const registerSchema = z.object({
  phone: z.string().min(10),
  password: z.string().min(6),
  referralCode: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = registerSchema.parse(body)

    const formattedPhone = formatPhone(validated.phone)
    const validation = validatePhone(formattedPhone)

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({
      where: { phone: formattedPhone }
    })

    if (existing) {
      return NextResponse.json({ error: 'Nomor HP sudah terdaftar' }, { status: 400 })
    }

    let referredBy: string | undefined
    if (validated.referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: validated.referralCode },
      })
      if (referrer) {
        referredBy = referrer.id
      }
    }

    const hashedPassword = await hashPassword(validated.password)
    const referralCode = generateReferralCode()

    const user = await prisma.user.create({
      data: {
        phone: formattedPhone,
        username: `user_${formattedPhone.slice(-4)}`,
        password: hashedPassword,
        referralCode,
        referredBy,
        balance: referredBy ? 5000 : 0,
      },
    })

    if (referredBy) {
      await prisma.user.update({
        where: { id: referredBy },
        data: {
          balance: { increment: 10000 },
          keys: { increment: 50 },
        },
      })
    }

    const token = await generateToken(user.id)
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      token,
      message: referredBy ? 'Pendaftaran berhasil! Dapat bonus referal!' : 'Pendaftaran berhasil!',
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
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
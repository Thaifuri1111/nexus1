import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { multiplier = 1 } = await request.json()

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.energy < 1) {
      return NextResponse.json({ error: 'Not enough energy' }, { status: 400 })
    }

    const tapAmount = BigInt(multiplier)
    const updated = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        coins: user.coins + tapAmount,
        energy: Math.max(0, user.energy - 1),
        taps: user.taps + 1n,
      }
    })

    await prisma.tapLog.create({
      data: {
        userId: payload.userId,
        amount: tapAmount,
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Tap error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
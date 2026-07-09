import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const CONVERSION_RATE = 0.1

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

    const { fromCoins } = await request.json()
    const amount = BigInt(fromCoins)

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.coins < amount) {
      return NextResponse.json({ error: 'Insufficient coins' }, { status: 400 })
    }

    const toCoins = BigInt(Math.floor(Number(amount) * CONVERSION_RATE))
    if (toCoins === 0n) {
      return NextResponse.json({ error: 'Amount too small' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        coins: user.coins - amount,
      }
    })

    await prisma.convert.create({
      data: {
        userId: payload.userId,
        fromCoins: amount,
        toCoins,
        rate: CONVERSION_RATE,
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Convert error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const MIN_WITHDRAW = 10000n

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

    const { amount, bankName, bankAccNumber } = await request.json()
    const withdrawAmount = BigInt(amount)

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (withdrawAmount < MIN_WITHDRAW) {
      return NextResponse.json({ error: `Minimum withdraw is ${MIN_WITHDRAW}` }, { status: 400 })
    }

    if (user.coins < withdrawAmount) {
      return NextResponse.json({ error: 'Insufficient coins' }, { status: 400 })
    }

    const withdraw = await prisma.withdraw.create({
      data: {
        userId: payload.userId,
        amount: withdrawAmount,
        bankName,
        bankAccNumber,
        status: 'pending',
      }
    })

    await prisma.user.update({
      where: { id: payload.userId },
      data: { coins: user.coins - withdrawAmount }
    })

    return NextResponse.json(withdraw)
  } catch (error) {
    console.error('Withdraw error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
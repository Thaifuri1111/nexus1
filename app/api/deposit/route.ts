import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const MIN_DEPOSIT = 10000n

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

    const { amount, method = 'bank' } = await request.json()
    const depositAmount = BigInt(amount)

    if (depositAmount < MIN_DEPOSIT) {
      return NextResponse.json({ error: `Minimum deposit is ${MIN_DEPOSIT}` }, { status: 400 })
    }

    const deposit = await prisma.deposit.create({
      data: {
        userId: payload.userId,
        amount: depositAmount,
        method,
        status: 'pending',
      }
    })

    return NextResponse.json(deposit)
  } catch (error) {
    console.error('Deposit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
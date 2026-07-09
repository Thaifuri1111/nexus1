import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { canWithdraw } from '@/lib/withdraw'
import { CONFIG } from '@/lib/config'
import { z } from 'zod'

const withdrawSchema = z.object({
  amount: z.number().min(100000),
  method: z.enum(['bank', 'dana', 'qris']),
  address: z.string().min(5),
})

export async function POST(request: NextRequest) {
  const user = await getSession(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validated = withdrawSchema.parse(body)

    const check = await canWithdraw(user.id, validated.amount)
    if (!check.can) {
      return NextResponse.json({ error: check.reason }, { status: 400 })
    }

    const feeRate = user.isVip ? CONFIG.VIP_WITHDRAW_FEE : CONFIG.WITHDRAW_FEE
    const fee = validated.amount * feeRate

    const withdraw = await prisma.$transaction(async (tx) => {
      const w = await tx.withdraw.create({
        data: {
          userId: user.id,
          amount: validated.amount,
          method: validated.method,
          address: validated.address,
          fee,
          status: 'PENDING'
        }
      })

      await tx.user.update({
        where: { id: user.id },
        data: {
          balance: { decrement: validated.amount },
          keys: { decrement: CONFIG.MIN_WITHDRAW_KEYS },
        }
      })

      return w
    })

    return NextResponse.json({
      success: true,
      withdraw: {
        id: withdraw.id,
        amount: withdraw.amount,
        method: withdraw.method,
        fee: withdraw.fee,
        status: withdraw.status,
        createdAt: withdraw.createdAt
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Withdraw error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const user = await getSession(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const withdraws = await prisma.withdraw.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, withdraws })
  } catch (error) {
    console.error('Withdraw fetch error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
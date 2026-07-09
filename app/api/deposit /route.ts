import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { validateDeposit } from '@/lib/deposit'
import { z } from 'zod'

const depositSchema = z.object({
  amount: z.number().min(50000).max(500000),
  method: z.enum(['qris', 'bank', 'dana']),
  proofUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  const user = await getSession(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validated = depositSchema.parse(body)

    const validation = validateDeposit(validated.amount)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const deposit = await prisma.deposit.create({
      data: {
        userId: user.id,
        amount: validated.amount,
        method: validated.method,
        proofUrl: validated.proofUrl,
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      success: true,
      deposit: {
        id: deposit.id,
        amount: deposit.amount,
        method: deposit.method,
        status: deposit.status,
        createdAt: deposit.createdAt
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Deposit error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const user = await getSession(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const deposits = await prisma.deposit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, deposits })
  } catch (error) {
    console.error('Deposit fetch error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
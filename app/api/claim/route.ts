import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { canClaim, processClaim } from '@/lib/status'
import { z } from 'zod'

const claimSchema = z.object({
  amount: z.number().min(1000),
})

export async function POST(request: NextRequest) {
  const user = await getSession(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validated = claimSchema.parse(body)

    const result = await processClaim(user.id, validated.amount)

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: {
        amount: result.amount,
        value: result.value,
        remainingCoins: result.remainingCoins,
        message: result.message,
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Claim error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const user = await getSession(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await canClaim(user.id)
    return NextResponse.json({
      success: true,
      data: {
        canClaim: result.can,
        maxClaim: result.maxClaim || 0,
        reason: result.reason || null,
      }
    })
  } catch (error) {
    console.error('Claim status error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
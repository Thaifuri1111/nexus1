import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { convertCoins, getConvertStatus } from '@/lib/convert'
import { z } from 'zod'

const convertSchema = z.object({
  amount: z.number().min(1).max(10),
})

export async function POST(request: NextRequest) {
  const user = await getSession(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validated = convertSchema.parse(body)

    const result = await convertCoins(user.id, validated.amount)

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: {
        coinsUsed: result.coinsUsed,
        keysEarned: result.keysEarned,
        remainingCoins: result.remainingCoins,
        message: result.message,
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Convert error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const user = await getSession(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const status = await getConvertStatus(user.id)
    if (!status) {
      return NextResponse.json({ error: 'Gagal mengambil status' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: status })
  } catch (error) {
    console.error('Convert status error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
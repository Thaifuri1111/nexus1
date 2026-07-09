import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const admin = await getAdminSession(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        username: true,
        balance: true,
        keys: true,
        taps: true,
        maxTaps: true,
        tapCoins: true,
        status: true,
        isVip: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}
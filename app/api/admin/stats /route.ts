import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { getProfitData } from '@/lib/profit'

export async function GET(request: NextRequest) {
  const admin = await getAdminSession(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [totalUsers, pendingDeposits, pendingWithdraws, profit] = await Promise.all([
      prisma.user.count(),
      prisma.deposit.count({ where: { status: 'PENDING' } }),
      prisma.withdraw.count({ where: { status: 'PENDING' } }),
      getProfitData(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        pendingDeposits,
        pendingWithdraws,
        profit,
      }
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Gagal mengambil statistik' }, { status: 500 })
  }
}
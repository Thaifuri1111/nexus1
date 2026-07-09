import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [totalUsers, totalCoinsResult, pendingDeposits, pendingWithdraws] = await Promise.all([
      prisma.user.count(),
      prisma.user.aggregate({ _sum: { coins: true } }),
      prisma.deposit.count({ where: { status: 'pending' } }),
      prisma.withdraw.count({ where: { status: 'pending' } }),
    ])

    const totalCoins = totalCoinsResult._sum.coins?.toString() || '0'

    return NextResponse.json({
      totalUsers,
      totalCoins,
      pendingDeposits,
      pendingWithdraws,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
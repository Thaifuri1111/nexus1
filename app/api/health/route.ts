import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check admin token in cookie
    const adminToken = request.cookies.get('admin_token')?.value
    if (!adminToken) {
      return NextResponse.json({ status: 'ok' })
    }

    // Simple health check
    const userCount = await prisma.user.count()
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      users: userCount,
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed' },
      { status: 500 }
    )
  }
}
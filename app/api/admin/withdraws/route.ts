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

    const withdraws = await prisma.withdraw.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(withdraws)
  } catch (error) {
    console.error('Admin withdraws error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { status } = await request.json()
    const pathname = new URL(request.url).pathname
    const id = pathname.split('/').pop()

    if (!id) {
      return NextResponse.json({ error: 'Invalid withdraw ID' }, { status: 400 })
    }

    const withdraw = await prisma.withdraw.findUnique({ where: { id } })
    if (!withdraw) {
      return NextResponse.json({ error: 'Withdraw not found' }, { status: 404 })
    }

    const updated = await prisma.withdraw.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Admin withdraw update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
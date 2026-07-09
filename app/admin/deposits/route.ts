
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const admin = await getAdminSession(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'PENDING'

    const deposits = await prisma.deposit.findMany({
      where: status === 'all' ? {} : { status: status as any },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            username: true,
            balance: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, deposits })
  } catch (error) {
    console.error('Admin deposits error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminSession(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'ID dan status wajib diisi' }, { status: 400 })
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 })
    }

    const deposit = await prisma.deposit.update({
      where: { id },
      data: { status: status as any },
      include: { user: true }
    })

    if (status === 'APPROVED') {
      await prisma.user.update({
        where: { id: deposit.userId },
        data: { balance: { increment: deposit.amount } }
      })
    }

    return NextResponse.json({
      success: true,
      message: `Deposit ${status === 'APPROVED' ? 'disetujui' : 'ditolak'} berhasil`,
      deposit
    })
  } catch (error) {
    console.error('Admin deposit update error:', error)
    return NextResponse.json({ error: 'Gagal memproses deposit' }, { status: 500 })
  }
}

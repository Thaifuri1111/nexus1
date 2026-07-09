import { prisma } from './prisma'
import { CONFIG } from './config'

export function getStatusConfig(status: string) {
  return CONFIG.CLAIM_CONFIG[status as keyof typeof CONFIG.CLAIM_CONFIG] || CONFIG.CLAIM_CONFIG.BRONZE
}

export async function calculateStatus(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      taps: true,
      tapCoins: true,
      deposits: {
        where: { status: 'APPROVED' },
        select: { amount: true }
      }
    }
  })

  if (!user) return 'BRONZE'

  const totalDeposit = user.deposits.reduce((sum, d) => sum + d.amount, 0)

  if (totalDeposit >= 500000 || user.tapCoins >= 1000000) return 'DIAMOND'
  if (totalDeposit >= 250000 || user.tapCoins >= 500000) return 'PLATINUM'
  if (totalDeposit >= 100000 || user.tapCoins >= 250000) return 'GOLD'
  if (totalDeposit >= 50000 || user.tapCoins >= 100000) return 'SILVER'

  return 'BRONZE'
}

export async function updateUserStatus(userId: string) {
  const newStatus = await calculateStatus(userId)
  await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus as any }
  })
  return newStatus
}

export async function canClaim(userId: string): Promise<{ can: boolean; reason?: string; maxClaim?: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      status: true,
      tapCoins: true,
      claimHistory: {
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }
    }
  })

  if (!user) return { can: false, reason: 'User tidak ditemukan' }

  const config = getStatusConfig(user.status)
  if (user.tapCoins < 1000) {
    return { can: false, reason: `Minimal 1.000 coin untuk claim. Kamu punya ${user.tapCoins} coin.` }
  }

  if (user.claimHistory.length >= config.limit) {
    return { can: false, reason: `Batas claim hari ini sudah habis (${config.limit}x claim)` }
  }

  const maxClaim = Math.min(config.maxClaim, user.tapCoins)

  return { can: true, maxClaim }
}

export async function processClaim(userId: string, amount: number) {
  const check = await canClaim(userId)
  if (!check.can) {
    return { success: false, message: check.reason }
  }

  const maxClaim = check.maxClaim || 0
  if (amount <= 0 || amount > maxClaim) {
    return { success: false, message: `Jumlah claim maksimal ${maxClaim.toLocaleString()} coin` }
  }

  const value = (amount / 1000) * 100 // 1000 coin = Rp 100

  const updatedUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: {
        tapCoins: { decrement: amount },
        balance: { increment: value }
      }
    })

    await tx.claimHistory.create({
      data: {
        userId,
        amount,
        value,
        status: 'SUCCESS'
      }
    })

    return user
  })

  await updateUserStatus(userId)

  return {
    success: true,
    amount,
    value,
    remainingCoins: updatedUser.tapCoins,
    message: `Berhasil claim ${amount.toLocaleString()} coin = ${formatCurrency(value)}`
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
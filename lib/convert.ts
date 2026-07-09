import { prisma } from './prisma'
import { CONFIG } from './config'

export async function canConvert(userId: string, amount: number): Promise<{ can: boolean; reason?: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      tapCoins: true,
      convertHistory: {
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }
    }
  })

  if (!user) return { can: false, reason: 'User tidak ditemukan' }

  const coinsNeeded = amount * CONFIG.COINS_PER_KEY
  if (user.tapCoins < coinsNeeded) {
    return { can: false, reason: `Coin tidak cukup. Butuh ${coinsNeeded} coin.` }
  }

  const todayConverted = user.convertHistory.reduce((sum, h) => sum + h.keysEarned, 0)
  const remainingKeys = CONFIG.MAX_CONVERT_PER_DAY - todayConverted

  if (remainingKeys <= 0) {
    return { can: false, reason: `Batas convert hari ini sudah habis (${CONFIG.MAX_CONVERT_PER_DAY} kunci/hari)` }
  }

  if (amount > remainingKeys) {
    return { can: false, reason: `Maksimal ${remainingKeys} kunci lagi hari ini` }
  }

  return { can: true }
}

export async function convertCoins(userId: string, amount: number) {
  const check = await canConvert(userId, amount)
  if (!check.can) {
    return { success: false, message: check.reason }
  }

  const coinsUsed = amount * CONFIG.COINS_PER_KEY

  const user = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: userId },
      data: {
        tapCoins: { decrement: coinsUsed },
        keys: { increment: amount }
      }
    })

    await tx.convertHistory.create({
      data: {
        userId,
        coinsUsed,
        keysEarned: amount
      }
    })

    return updated
  })

  return {
    success: true,
    coinsUsed,
    keysEarned: amount,
    remainingCoins: user.tapCoins,
    message: `Berhasil convert ${coinsUsed} coin → ${amount} kunci!`
  }
}

export async function getConvertStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      tapCoins: true,
      keys: true,
      convertHistory: {
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }
    }
  })

  if (!user) return null

  const todayConverted = user.convertHistory.reduce((sum, h) => sum + h.keysEarned, 0)
  const remainingKeys = CONFIG.MAX_CONVERT_PER_DAY - todayConverted

  return {
    tapCoins: user.tapCoins,
    keys: user.keys,
    todayConverted,
    remainingKeys: Math.max(0, remainingKeys),
    maxKeysPerDay: CONFIG.MAX_CONVERT_PER_DAY,
    coinsPerKey: CONFIG.COINS_PER_KEY,
    canConvert: remainingKeys > 0 && user.tapCoins >= CONFIG.COINS_PER_KEY
  }
}
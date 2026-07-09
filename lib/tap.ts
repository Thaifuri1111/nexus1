import { prisma } from './prisma'
import { CONFIG } from './config'

export function rollKeys(): number {
  return Math.floor(Math.random() * (CONFIG.MAX_KEYS_PER_ROLL - CONFIG.MIN_KEYS_PER_ROLL + 1)) + CONFIG.MIN_KEYS_PER_ROLL
}

export async function canTap(userId: string): Promise<{ can: boolean; reason?: string; remaining?: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { taps: true, maxTaps: true }
  })

  if (!user) return { can: false, reason: 'User tidak ditemukan' }
  if (user.taps >= user.maxTaps) {
    return { can: false, reason: `Tap habis! Maks ${user.maxTaps} tap.`, remaining: 0 }
  }

  return { can: true, remaining: user.maxTaps - user.taps }
}

export async function processTap(userId: string) {
  const check = await canTap(userId)
  if (!check.can) {
    return { success: false, message: check.reason }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { taps: true }
  })

  if (!user) return { success: false, message: 'User tidak ditemukan' }

  const newTapCount = user.taps + 1
  const isRollTime = newTapCount % CONFIG.TAP_PER_ROLL === 0

  let keys = 0
  let keyMessage = ''

  if (isRollTime) {
    keys = rollKeys()
    keyMessage = `🎉 Roll kunci! Dapat ${keys} kunci!`
  } else {
    const tapsUntilRoll = CONFIG.TAP_PER_ROLL - (newTapCount % CONFIG.TAP_PER_ROLL)
    keyMessage = `📊 ${tapsUntilRoll} tap lagi untuk roll kunci`
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      taps: { increment: 1 },
      tapCoins: { increment: CONFIG.COINS_PER_TAP },
      keys: { increment: keys },
    }
  })

  await prisma.tapHistory.create({
    data: {
      userId,
      tapCount: 1,
      coinsEarned: CONFIG.COINS_PER_TAP,
      keysEarned: keys
    }
  })

  return {
    success: true,
    coins: CONFIG.COINS_PER_TAP,
    keys,
    totalTaps: updatedUser.taps,
    remaining: updatedUser.maxTaps - updatedUser.taps,
    isRoll: isRollTime,
    keyMessage,
    message: `+${CONFIG.COINS_PER_TAP} coin${keys > 0 ? `, +${keys} kunci` : ''}`
  }
}

export async function getTapStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      taps: true,
      maxTaps: true,
      tapCoins: true,
      keys: true
    }
  })

  if (!user) return null

  const nextRoll = CONFIG.TAP_PER_ROLL - (user.taps % CONFIG.TAP_PER_ROLL)

  return {
    currentTaps: user.taps,
    maxTaps: user.maxTaps,
    remaining: user.maxTaps - user.taps,
    tapCoins: user.tapCoins,
    keys: user.keys,
    progress: (user.taps / user.maxTaps) * 100,
    tapsUntilRoll: nextRoll === CONFIG.TAP_PER_ROLL ? 0 : nextRoll,
    tapPerRoll: CONFIG.TAP_PER_ROLL,
  }
}
import { prisma } from './prisma'

const TAP_BASE_AMOUNT = 1n
const ENERGY_PER_TAP = 1
const ENERGY_RECOVERY_TIME = 5000 // 5 seconds per 1 energy

export async function performTap(userId: string, multiplier: number = 1) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) throw new Error('User not found')
  if (user.energy < ENERGY_PER_TAP) throw new Error('Not enough energy')

  const tapAmount = TAP_BASE_AMOUNT * BigInt(multiplier)
  const newCoins = user.coins + tapAmount
  const newEnergy = user.energy - ENERGY_PER_TAP

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      coins: newCoins,
      energy: newEnergy,
      taps: user.taps + 1n,
    }
  })

  // Log the tap
  await prisma.tapLog.create({
    data: {
      userId,
      amount: tapAmount,
    }
  })

  return updated
}

export async function recoverEnergy(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) throw new Error('User not found')

  if (user.energy >= user.maxEnergy) {
    return user
  }

  // Recover 1 energy per 5 seconds, max is maxEnergy
  const recovered = Math.min(user.energy + 1, user.maxEnergy)

  return prisma.user.update({
    where: { id: userId },
    data: { energy: recovered }
  })
}
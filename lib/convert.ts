import { prisma } from './prisma'

const CONVERSION_RATE = 0.1 // 1 Tap = 0.1 Diamond

export async function convertCoins(userId: string, fromCoins: bigint) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) throw new Error('User not found')
  if (user.coins < fromCoins) throw new Error('Insufficient coins')

  const toCoins = BigInt(Math.floor(Number(fromCoins) * CONVERSION_RATE))
  if (toCoins === 0n) throw new Error('Conversion amount too small')

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      coins: user.coins - fromCoins,
    }
  })

  await prisma.convert.create({
    data: {
      userId,
      fromCoins,
      toCoins,
      rate: CONVERSION_RATE,
    }
  })

  return updated
}
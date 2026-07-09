import { prisma } from './prisma'

const RANK_THRESHOLDS = [
  { rank: 'Beginner', minCoins: 0n },
  { rank: 'Novice', minCoins: 1000n },
  { rank: 'Apprentice', minCoins: 10000n },
  { rank: 'Master', minCoins: 100000n },
  { rank: 'Legend', minCoins: 1000000n },
]

export function calculateRank(coins: bigint): string {
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (coins >= RANK_THRESHOLDS[i].minCoins) {
      return RANK_THRESHOLDS[i].rank
    }
  }
  return 'Beginner'
}

export async function updateRank(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) throw new Error('User not found')

  const newRank = calculateRank(user.coins)
  
  if (newRank !== user.rank) {
    return prisma.user.update({
      where: { id: userId },
      data: { rank: newRank }
    })
  }

  return user
}
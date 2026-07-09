import { prisma } from './prisma'
import { CONFIG } from './config'

export async function getProfitData() {
  const [totalDeposits, totalWithdraws, totalRewards] = await Promise.all([
    prisma.deposit.aggregate({
      where: { status: 'APPROVED' },
      _sum: { amount: true }
    }),
    prisma.withdraw.aggregate({
      where: { status: 'APPROVED' },
      _sum: { amount: true }
    }),
    prisma.claimHistory.aggregate({
      _sum: { value: true }
    })
  ])

  const depositTotal = totalDeposits._sum.amount || 0
  const withdrawTotal = totalWithdraws._sum.amount || 0
  const rewardTotal = totalRewards._sum.value || 0

  const profit = depositTotal - withdrawTotal - rewardTotal

  return {
    profit,
    totalDeposits: depositTotal,
    totalWithdraws: withdrawTotal,
    totalRewards: rewardTotal,
    isProfitable: profit >= 0,
    isTargetReached: profit >= CONFIG.PROFIT_TARGET,
    gapToTarget: CONFIG.PROFIT_TARGET - profit,
    profitPercentage: depositTotal > 0 ? (profit / depositTotal) * 100 : 0,
  }
}
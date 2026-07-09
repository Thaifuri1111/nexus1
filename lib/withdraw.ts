import { prisma } from './prisma'
import { CONFIG } from './config'

export async function requestWithdraw(userId: string, amount: bigint, bankName?: string, bankAccNumber?: string) {
  if (amount < CONFIG.MIN_WITHDRAW) {
    throw new Error(`Minimum withdraw is ${CONFIG.MIN_WITHDRAW}`)
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) throw new Error('User not found')
  if (user.coins < amount) throw new Error('Insufficient coins')

  const withdraw = await prisma.withdraw.create({
    data: {
      userId,
      amount,
      status: 'pending',
      bankName,
      bankAccNumber,
    }
  })

  await prisma.user.update({
    where: { id: userId },
    data: { coins: user.coins - amount }
  })

  return withdraw
}

export async function completeWithdraw(withdrawId: string) {
  const withdraw = await prisma.withdraw.findUnique({
    where: { id: withdrawId }
  })

  if (!withdraw) throw new Error('Withdraw not found')
  if (withdraw.status !== 'pending') throw new Error('Withdraw already processed')

  return prisma.withdraw.update({
    where: { id: withdrawId },
    data: { status: 'completed' }
  })
}
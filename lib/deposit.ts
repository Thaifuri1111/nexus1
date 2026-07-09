import { prisma } from './prisma'
import { CONFIG } from './config'

export async function requestDeposit(userId: string, amount: bigint, method: string = 'bank') {
  if (amount < CONFIG.MIN_DEPOSIT) {
    throw new Error(`Minimum deposit is ${CONFIG.MIN_DEPOSIT}`)
  }

  const deposit = await prisma.deposit.create({
    data: {
      userId,
      amount,
      method,
      status: 'pending',
    }
  })

  return deposit
}

export async function completeDeposit(depositId: string) {
  const deposit = await prisma.deposit.findUnique({
    where: { id: depositId }
  })

  if (!deposit) throw new Error('Deposit not found')
  if (deposit.status !== 'pending') throw new Error('Deposit already processed')

  const user = await prisma.user.findUnique({
    where: { id: deposit.userId }
  })

  if (!user) throw new Error('User not found')

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { coins: user.coins + deposit.amount }
  })

  await prisma.deposit.update({
    where: { id: depositId },
    data: { status: 'completed' }
  })

  return updated
}
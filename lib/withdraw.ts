import { prisma } from './prisma'
import { CONFIG } from './config'

export async function canWithdraw(userId: string, amount: number): Promise<{ can: boolean; reason?: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { balance: true, keys: true, isVip: true }
  })

  if (!user) return { can: false, reason: 'User tidak ditemukan' }

  if (user.balance < amount) {
    return { can: false, reason: `Saldo tidak mencukupi. Saldo: ${formatCurrency(user.balance)}` }
  }

  const minKeys = user.isVip ? 250 : CONFIG.MIN_WITHDRAW_KEYS
  if (user.keys < minKeys) {
    return { can: false, reason: `Kunci tidak mencukupi. Butuh ${minKeys} kunci. (${user.keys}/${minKeys})` }
  }

  if (amount < CONFIG.MIN_WITHDRAW) {
    return { can: false, reason: `Minimal withdraw Rp ${CONFIG.MIN_WITHDRAW.toLocaleString()}` }
  }

  return { can: true }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
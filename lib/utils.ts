export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'text-yellow-400 bg-yellow-400/20',
    APPROVED: 'text-green-400 bg-green-400/20',
    REJECTED: 'text-red-400 bg-red-400/20',
    BRONZE: 'text-amber-600 bg-amber-600/20',
    SILVER: 'text-gray-300 bg-gray-300/20',
    GOLD: 'text-yellow-500 bg-yellow-500/20',
    PLATINUM: 'text-cyan-400 bg-cyan-400/20',
    DIAMOND: 'text-blue-400 bg-blue-400/20',
  }
  return colors[status] || 'text-gray-400 bg-gray-400/20'
}

export function getStatusBadge(status: string): string {
  const labels: Record<string, string> = {
    PENDING: '⏳ Pending',
    APPROVED: '✅ Approved',
    REJECTED: '❌ Rejected',
    BRONZE: '🥉 Bronze',
    SILVER: '🥈 Silver',
    GOLD: '🥇 Gold',
    PLATINUM: '💎 Platinum',
    DIAMOND: '👑 Diamond',
  }
  return labels[status] || status
}
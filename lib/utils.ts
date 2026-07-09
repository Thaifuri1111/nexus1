export function formatCurrency(amount: bigint | number): string {
  const num = typeof amount === 'bigint' ? Number(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatNumber(num: number | bigint): string {
  const n = typeof num === 'bigint' ? Number(num) : num
  return new Intl.NumberFormat('en-US').format(n)
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
import { CONFIG } from './config'

export function validateDeposit(amount: number): { valid: boolean; error?: string } {
  if (amount < CONFIG.MIN_DEPOSIT) {
    return { valid: false, error: `Minimal deposit Rp ${CONFIG.MIN_DEPOSIT.toLocaleString()}` }
  }
  if (amount > CONFIG.MAX_DEPOSIT) {
    return { valid: false, error: `Maksimal deposit Rp ${CONFIG.MAX_DEPOSIT.toLocaleString()}` }
  }
  return { valid: true }
}
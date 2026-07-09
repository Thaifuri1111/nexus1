export interface User {
  id: string
  phone: string
  username: string
  balance: number
  keys: number
  taps: number
  maxTaps: number
  tapCoins: number
  status: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'
  isVip: boolean
  referralCode: string
  createdAt: string
}

export interface Deposit {
  id: string
  userId: string
  amount: number
  method: string
  proofUrl?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export interface Withdraw {
  id: string
  userId: string
  amount: number
  method: string
  address: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  fee: number
  processedBy?: string
  processedAt?: string
  createdAt: string
}

export interface TapHistory {
  id: string
  userId: string
  tapCount: number
  coinsEarned: number
  keysEarned: number
  createdAt: string
}

export interface ClaimHistory {
  id: string
  userId: string
  amount: number
  value: number
  status: string
  createdAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
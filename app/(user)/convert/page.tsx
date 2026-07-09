'use client'

import { useAuth } from '@/hooks/useAuth'
import { ConvertButton } from '@/components/ConvertButton'
import { useState, useEffect } from 'react'
import { formatNumber } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ConvertPage() {
  const { user, loading } = useAuth()
  const [coins, setCoins] = useState(0n)
  const [convertAmount, setConvertAmount] = useState('1000')

  useEffect(() => {
    if (user) {
      setCoins(user.coins)
    }
  }, [user])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user) return null

  const handleConvert = async () => {
    const amount = BigInt(convertAmount)
    if (amount > coins) {
      toast.error('Insufficient coins')
      return
    }
    const res = await fetch('/api/auth/me')
    if (res.ok) {
      const data = await res.json()
      setCoins(BigInt(data.coins))
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-orbitron font-bold mb-8 text-center">CONVERT COINS</h1>

        <div className="bg-card border border-primary/20 rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-primary font-bold mb-2">Your Coins: {formatNumber(coins)}</label>
            <input
              type="number"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white text-lg"
              min="1"
            />
          </div>

          <div className="bg-background/50 border border-secondary/20 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">You will receive:</div>
            <div className="text-3xl font-bold text-secondary">
              {formatNumber(Math.floor(Number(convertAmount) * 0.1))} 💎
            </div>
          </div>

          <ConvertButton coins={BigInt(convertAmount)} onSuccess={handleConvert} />
        </div>
      </div>
    </main>
  )
}
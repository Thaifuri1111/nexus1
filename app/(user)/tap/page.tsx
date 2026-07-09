'use client'

import { useAuth } from '@/hooks/useAuth'
import { TapButton } from '@/components/TapButton'
import { useState, useEffect } from 'react'
import { formatNumber } from '@/lib/utils'

export default function TapPage() {
  const { user, loading } = useAuth()
  const [coins, setCoins] = useState(0n)
  const [energy, setEnergy] = useState(0)

  useEffect(() => {
    if (user) {
      setCoins(user.coins)
      setEnergy(user.energy)
    }
  }, [user])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user) return null

  const handleTap = async () => {
    const res = await fetch('/api/auth/me')
    if (res.ok) {
      const data = await res.json()
      setCoins(BigInt(data.coins))
      setEnergy(data.energy)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-orbitron font-bold mb-4">TAP GAME</h1>
        
        <div className="bg-card border border-primary/20 rounded-lg p-8 mb-8 inline-block">
          <div className="text-6xl font-bold text-primary mb-4">{formatNumber(coins)}</div>
          <div className="text-xl text-gray-400">Total Coins</div>
        </div>

        <div className="mb-8">
          <TapButton onClick={handleTap} disabled={energy === 0} />
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-secondary mb-2">⚡ Energy: {energy}/{user.maxEnergy}</div>
          <div className="w-48 h-4 bg-card border border-primary/20 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${(energy / user.maxEnergy) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
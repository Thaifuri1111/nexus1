'use client'

import { useAuth } from '@/hooks/useAuth'
import { TapButton } from '@/components/TapButton'
import { formatNumber } from '@/lib/utils'
import Link from 'next/link'

export default function GamePage() {
  const { user, loading } = useAuth()

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  if (!user) return null

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-primary/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary">{formatNumber(user.coins)}</div>
            <div className="text-sm text-gray-400 mt-2">Total Coins</div>
          </div>
          <div className="bg-card border border-primary/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-secondary">{user.energy}/{user.energy}</div>
            <div className="text-sm text-gray-400 mt-2">Energy</div>
          </div>
          <div className="bg-card border border-primary/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-success">{user.rank}</div>
            <div className="text-sm text-gray-400 mt-2">Your Rank</div>
          </div>
          <div className="bg-card border border-primary/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-warning">0</div>
            <div className="text-sm text-gray-400 mt-2">Diamonds</div>
          </div>
        </div>

        {/* Menu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/tap"
            className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-6 hover:border-primary/60 transition text-center"
          >
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-lg">Tap Game</h3>
            <p className="text-sm text-gray-400 mt-2">Tap and earn coins</p>
          </Link>
          <Link
            href="/convert"
            className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-6 hover:border-primary/60 transition text-center"
          >
            <div className="text-4xl mb-3">💎</div>
            <h3 className="font-bold text-lg">Convert</h3>
            <p className="text-sm text-gray-400 mt-2">Convert to diamonds</p>
          </Link>
          <Link
            href="/deposit"
            className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-6 hover:border-primary/60 transition text-center"
          >
            <div className="text-4xl mb-3">📥</div>
            <h3 className="font-bold text-lg">Deposit</h3>
            <p className="text-sm text-gray-400 mt-2">Add funds to account</p>
          </Link>
          <Link
            href="/withdraw"
            className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-6 hover:border-primary/60 transition text-center"
          >
            <div className="text-4xl mb-3">📤</div>
            <h3 className="font-bold text-lg">Withdraw</h3>
            <p className="text-sm text-gray-400 mt-2">Cash out your coins</p>
          </Link>
          <Link
            href="/claim"
            className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-6 hover:border-primary/60 transition text-center"
          >
            <div className="text-4xl mb-3">🎁</div>
            <h3 className="font-bold text-lg">Daily Claim</h3>
            <p className="text-sm text-gray-400 mt-2">Claim daily rewards</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
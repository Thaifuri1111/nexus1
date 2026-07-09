'use client'

import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import { formatNumber } from '@/lib/utils'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState({ taps: 0, converts: 0, deposits: 0 })

  useEffect(() => {
    if (user) {
      // Fetch user stats if needed
    }
  }, [user])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user) return null

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-orbitron font-bold mb-8 text-center">MY PROFILE</h1>

        <div className="bg-card border border-primary/20 rounded-lg p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400 text-sm mb-1">Name</div>
              <div className="text-xl font-bold">{user.name}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Email</div>
              <div className="text-xl font-bold">{user.email}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Total Coins</div>
              <div className="text-2xl font-bold text-primary">{formatNumber(user.coins)}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Current Rank</div>
              <div className="text-2xl font-bold text-secondary">{user.rank}</div>
            </div>
          </div>

          <div className="border-t border-primary/20 pt-6">
            <Link href="/logout" className="w-full block text-center px-4 py-2 bg-danger hover:bg-danger/80 font-bold rounded-lg transition-all">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
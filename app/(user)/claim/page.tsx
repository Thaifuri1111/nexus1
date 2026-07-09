'use client'

import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { formatNumber } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ClaimPage() {
  const { user, loading } = useAuth()
  const [claiming, setClaiming] = useState(false)

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user) return null

  const handleClaim = async () => {
    setClaiming(true)
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Claim failed')
      }

      toast.success('Claim successful!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Claim failed')
    } finally {
      setClaiming(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🎁</div>
        <h1 className="text-4xl font-orbitron font-bold mb-4">DAILY CLAIM</h1>
        <p className="text-gray-400 mb-8">Claim your daily bonus coins!</p>

        <button
          onClick={handleClaim}
          disabled={claiming}
          className="px-8 py-3 bg-primary hover:bg-primary/80 disabled:opacity-50 text-black font-bold rounded-lg transition-all"
        >
          {claiming ? 'Claiming...' : 'Claim Now'}
        </button>
      </div>
    </main>
  )
}
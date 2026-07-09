'use client'

import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import { formatNumber } from '@/lib/utils'

interface Stats {
  totalUsers: number
  totalCoins: string
  pendingDeposits: number
  pendingWithdraws: number
}

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user?.isAdmin) return null

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-orbitron font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-primary/20 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Total Users</div>
            <div className="text-3xl font-bold text-primary">{stats?.totalUsers || 0}</div>
          </div>
          <div className="bg-card border border-primary/20 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Total Coins</div>
            <div className="text-3xl font-bold text-secondary">{stats?.totalCoins ? formatNumber(BigInt(stats.totalCoins)) : '0'}</div>
          </div>
          <div className="bg-card border border-primary/20 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Pending Deposits</div>
            <div className="text-3xl font-bold text-warning">{stats?.pendingDeposits || 0}</div>
          </div>
          <div className="bg-card border border-primary/20 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Pending Withdraws</div>
            <div className="text-3xl font-bold text-danger">{stats?.pendingWithdraws || 0}</div>
          </div>
        </div>
      </div>
    </main>
  )
}
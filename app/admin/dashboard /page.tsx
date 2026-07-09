'use client'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

interface Stats {
  totalUsers: number
  pendingDeposits: number
  pendingWithdraws: number
  profit: {
    profit: number
    totalDeposits: number
    totalWithdraws: number
    totalRewards: number
    isProfitable: boolean
    isTargetReached: boolean
    gapToTarget: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      toast.error('Gagal mengambil statistik')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!stats) {
    return <div className="text-center py-8 text-red-500">Gagal memuat data</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">📊 Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-xl">
          <p className="text-sm text-gray-400">Total Users</p>
          <p className="text-2xl font-bold text-primary">{stats.totalUsers}</p>
        </div>
        <div className="bg-card p-4 rounded-xl">
          <p className="text-sm text-gray-400">Pending Deposit</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pendingDeposits}</p>
        </div>
        <div className="bg-card p-4 rounded-xl">
          <p className="text-sm text-gray-400">Pending Withdraw</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pendingWithdraws}</p>
        </div>
        <div className="bg-card p-4 rounded-xl">
          <p className="text-sm text-gray-400">Profit</p>
          <p className={`text-2xl font-bold ${stats.profit.isProfitable ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(stats.profit.profit)}
          </p>
        </div>
      </div>

      <div className="bg-card p-4 rounded-xl">
        <h3 className="font-bold mb-2">📈 Detail Profit</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Deposit</span>
            <span className="text-green-500">{formatCurrency(stats.profit.totalDeposits)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Withdraw</span>
            <span className="text-red-500">{formatCurrency(stats.profit.totalWithdraws)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Reward</span>
            <span className="text-yellow-500">{formatCurrency(stats.profit.totalRewards)}</span>
          </div>
          <div className="border-t border-gray-700 my-2 pt-2 flex justify-between font-bold">
            <span>Profit</span>
            <span className={stats.profit.isProfitable ? 'text-green-500' : 'text-red-500'}>
              {formatCurrency(stats.profit.profit)}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            Target 5JT: {stats.profit.isTargetReached ? '✅ Tercapai!' : `Butuh ${formatCurrency(stats.profit.gapToTarget)} lagi`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/admin/deposits" className="bg-card p-4 rounded-xl text-center hover:bg-card/80 transition">
          <p className="text-xl">💰</p>
          <p className="font-bold">Deposit</p>
          <p className="text-xs text-gray-400">{stats.pendingDeposits} pending</p>
        </Link>
        <Link href="/admin/withdraws" className="bg-card p-4 rounded-xl text-center hover:bg-card/80 transition">
          <p className="text-xl">💳</p>
          <p className="font-bold">Withdraw</p>
          <p className="text-xs text-gray-400">{stats.pendingWithdraws} pending</p>
        </Link>
      </div>
    </div>
  )
}
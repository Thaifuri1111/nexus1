'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

interface ClaimStatus {
  canClaim: boolean
  maxClaim: number
  reason?: string
}

export default function ClaimPage() {
  const { user } = useAuth()
  const [status, setStatus] = useState<ClaimStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [amount, setAmount] = useState(1000)

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/claim')
      const data = await res.json()
      if (data.success) {
        setStatus(data.data)
      }
    } catch (error) {
      toast.error('Gagal mengambil status claim')
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async () => {
    if (submitting || !status || !status.canClaim) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Gagal claim')
      }

      toast.success(data.message || 'Claim berhasil!')
      fetchStatus()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">🎯 Claim Coin</h1>
      <p className="text-gray-400 text-sm">
        Tukar coin menjadi saldo. 1000 coin = Rp 100.
      </p>

      <div className="bg-card p-4 rounded-xl">
        <div className="flex justify-between">
          <span className="text-gray-400">Coin Tersedia</span>
          <span className="font-bold text-yellow-400">{user?.tapCoins || 0}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-gray-400">Status</span>
          <span className="font-bold text-primary">{user?.status || 'BRONZE'}</span>
        </div>
      </div>

      {status && (
        <div className="bg-card p-4 rounded-xl">
          {status.canClaim ? (
            <>
              <p className="text-green-400 text-sm">✅ Bisa claim!</p>
              <p className="text-xs text-gray-400">Maks claim: {status.maxClaim} coin</p>
              <div className="mt-4 flex gap-4">
                <select
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  className="w-32 px-3 py-2 bg-background rounded-lg border border-primary/20 focus:border-primary outline-none"
                >
                  {[1000, 5000, 10000, 25000, 50000].map((n) => (
                    <option key={n} value={n}>{n.toLocaleString()} coin</option>
                  ))}
                </select>
                <button
                  onClick={handleClaim}
                  disabled={submitting}
                  className="flex-1 py-2 bg-primary text-black font-bold rounded-lg hover:opacity-80 transition disabled:opacity-50"
                >
                  {submitting ? '🔄...' : '🎯 Claim'}
                </button>
              </div>
            </>
          ) : (
            <p className="text-red-400 text-sm">❌ {status.reason}</p>
          )}
        </div>
      )}

      <div className="bg-card p-4 rounded-xl">
        <h3 className="font-bold mb-2">📋 Informasi Claim</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• 1000 coin = Rp 100</li>
          <li>• Batas claim sesuai status</li>
          <li>• Bronze: 1x/hari (max 10.000 coin)</li>
          <li>• Silver: 2x/hari (max 50.000 coin)</li>
          <li>• Gold: 3x/hari (max 100.000 coin)</li>
          <li>• Platinum: 5x/hari (max 500.000 coin)</li>
          <li>• Diamond: 10x/hari (max 1.000.000 coin)</li>
        </ul>
      </div>
    </div>
  )
}
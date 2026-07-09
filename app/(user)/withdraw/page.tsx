'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

interface Withdraw {
  id: string
  amount: number
  method: string
  address: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  fee: number
  createdAt: string
}

export default function WithdrawPage() {
  const { user } = useAuth()
  const [withdraws, setWithdraws] = useState<Withdraw[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    amount: '',
    method: 'bank',
    address: ''
  })

  useEffect(() => {
    fetchWithdraws()
  }, [])

  const fetchWithdraws = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/withdraw')
      const data = await res.json()
      if (data.success) {
        setWithdraws(data.withdraws)
      }
    } catch (error) {
      toast.error('Gagal mengambil riwayat withdraw')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(form.amount),
          method: form.method,
          address: form.address
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal submit withdraw')
      }

      toast.success('Withdraw berhasil disubmit! Menunggu verifikasi admin.')
      setForm({ amount: '', method: 'bank', address: '' })
      fetchWithdraws()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-500/20 text-yellow-500',
      APPROVED: 'bg-green-500/20 text-green-500',
      REJECTED: 'bg-red-500/20 text-red-500'
    }
    return colors[status] || 'bg-gray-500/20 text-gray-500'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">💳 Withdraw</h1>
      <p className="text-gray-400 text-sm">
        Minimal withdraw Rp 100.000 + 500 kunci. Fee 15%.
      </p>

      <div className="bg-card p-4 rounded-xl">
        <div className="flex justify-between">
          <span className="text-gray-400">Saldo</span>
          <span className="font-bold">{formatCurrency(user?.balance || 0)}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-gray-400">Kunci</span>
          <span className="font-bold text-green-400">{user?.keys || 0} / 500</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Jumlah Withdraw (Rp)</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="Minimal 100000"
            min="100000"
            className="w-full px-4 py-2 bg-background rounded-lg border border-primary/20 focus:border-primary outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Metode</label>
          <select
            value={form.method}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
            className="w-full px-4 py-2 bg-background rounded-lg border border-primary/20 focus:border-primary outline-none"
          >
            <option value="bank">🏦 Bank Transfer</option>
            <option value="dana">📱 DANA</option>
            <option value="qris">📱 QRIS</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nomor Rekening / Tujuan</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Masukkan nomor rekening / tujuan"
            className="w-full px-4 py-2 bg-background rounded-lg border border-primary/20 focus:border-primary outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:opacity-80 transition disabled:opacity-50"
        >
          {submitting ? 'Memproses...' : '💳 Withdraw'}
        </button>
      </form>

      <div>
        <h2 className="text-xl font-bold mb-4">📋 Riwayat Withdraw</h2>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : withdraws.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Belum ada riwayat withdraw
          </div>
        ) : (
          <div className="space-y-3">
            {withdraws.map((withdraw) => (
              <div key={withdraw.id} className="bg-card p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold">{formatCurrency(withdraw.amount)}</p>
                  <p className="text-xs text-gray-400">
                    Fee: {formatCurrency(withdraw.fee)} 
                    ({withdraw.method.toUpperCase()})
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(withdraw.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(withdraw.status)}`}>
                  {withdraw.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
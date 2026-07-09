'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'

interface Deposit {
  id: string
  amount: number
  method: string
  proofUrl?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export default function DepositPage() {
  const { user } = useAuth()
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [form, setForm] = useState({
    amount: '',
    method: 'qris',
    proofUrl: ''
  })

  useEffect(() => {
    fetchDeposits()
  }, [])

  const fetchDeposits = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/deposit')
      const data = await res.json()
      if (data.success) {
        setDeposits(data.deposits)
      }
    } catch (error) {
      toast.error('Gagal mengambil riwayat deposit')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(form.amount),
          method: form.method,
          proofUrl: form.proofUrl || undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal submit deposit')
      }

      toast.success('Deposit berhasil disubmit! Menunggu verifikasi admin.')
      setForm({ amount: '', method: 'qris', proofUrl: '' })
      setShowQR(false)
      fetchDeposits()
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
      <h1 className="text-2xl font-bold text-primary">💰 Deposit</h1>
      <p className="text-gray-400 text-sm">
        Minimal deposit Rp 50.000 - Maksimal Rp 500.000
      </p>

      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Jumlah Deposit (Rp)</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="Minimal 50000"
            min="50000"
            max="500000"
            className="w-full px-4 py-2 bg-background rounded-lg border border-primary/20 focus:border-primary outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Metode</label>
          <select
            value={form.method}
            onChange={(e) => {
              setForm({ ...form, method: e.target.value })
              if (e.target.value === 'qris') setShowQR(true)
              else setShowQR(false)
            }}
            className="w-full px-4 py-2 bg-background rounded-lg border border-primary/20 focus:border-primary outline-none"
          >
            <option value="qris">📱 QRIS</option>
            <option value="bank">🏦 Bank Transfer</option>
            <option value="dana">📱 DANA</option>
          </select>
        </div>

        {showQR && (
          <div className="bg-background p-4 rounded-lg text-center">
            <p className="text-sm text-gray-400 mb-2">Scan QR Code di bawah:</p>
            <div className="flex justify-center">
              <Image
                src="/images/qr/request_money_qr_page.png"
                alt="QR Code Deposit"
                width={200}
                height={200}
                className="rounded-lg"
                unoptimized
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Transfer sesuai jumlah deposit dan upload bukti
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Link Bukti Transfer</label>
          <input
            type="url"
            value={form.proofUrl}
            onChange={(e) => setForm({ ...form, proofUrl: e.target.value })}
            placeholder="https://imgur.com/xxx.jpg"
            className="w-full px-4 py-2 bg-background rounded-lg border border-primary/20 focus:border-primary outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            Upload bukti ke imgur, lalu paste link nya
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:opacity-80 transition disabled:opacity-50"
        >
          {submitting ? 'Memproses...' : '💰 Deposit'}
        </button>
      </form>

      <div>
        <h2 className="text-xl font-bold mb-4">📋 Riwayat Deposit</h2>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : deposits.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Belum ada riwayat deposit
          </div>
        ) : (
          <div className="space-y-3">
            {deposits.map((deposit) => (
              <div key={deposit.id} className="bg-card p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold">{formatCurrency(deposit.amount)}</p>
                  <p className="text-xs text-gray-400">{deposit.method.toUpperCase()}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(deposit.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(deposit.status)}`}>
                  {deposit.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
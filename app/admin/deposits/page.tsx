'use client'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

interface Deposit {
  id: string
  amount: number
  method: string
  proofUrl: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  user: {
    id: string
    phone: string
    username: string
    balance: number
  }
}

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('PENDING')
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchDeposits()
  }, [filter])

  const fetchDeposits = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/deposits?status=${filter}`)
      const data = await res.json()
      if (data.success) {
        setDeposits(data.deposits)
      }
    } catch (error) {
      toast.error('Gagal mengambil data')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessing(id)
    try {
      const res = await fetch('/api/admin/deposits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses')
      }

      toast.success(data.message)
      fetchDeposits()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setProcessing(null)
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
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">💰 Manajemen Deposit</h1>

      <div className="flex gap-2">
        {['PENDING', 'APPROVED', 'REJECTED', 'all'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === s ? 'bg-primary text-black' : 'bg-card text-gray-400'
            }`}
          >
            {s === 'all' ? 'Semua' : s.toLowerCase()}
          </button>
        ))}
      </div>

      {deposits.length === 0 ? (
        <div className="text-center py-8 text-gray-400">Tidak ada deposit</div>
      ) : (
        <div className="space-y-3">
          {deposits.map((deposit) => (
            <div key={deposit.id} className="bg-card p-4 rounded-xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{formatCurrency(deposit.amount)}</p>
                  <p className="text-sm text-gray-400">
                    {deposit.user.username || deposit.user.phone}
                  </p>
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
                  {deposit.proofUrl && (
                    <a
                      href={deposit.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Lihat Bukti
                    </a>
                  )}
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(deposit.status)}`}>
                    {deposit.status}
                  </span>
                  {deposit.status === 'PENDING' && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleAction(deposit.id, 'APPROVED')}
                        disabled={processing === deposit.id}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg hover:opacity-80 disabled:opacity-50 text-sm"
                      >
                        {processing === deposit.id ? '...' : '✅ Approve'}
                      </button>
                      <button
                        onClick={() => handleAction(deposit.id, 'REJECTED')}
                        disabled={processing === deposit.id}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:opacity-80 disabled:opacity-50 text-sm"
                      >
                        {processing === deposit.id ? '...' : '❌ Reject'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
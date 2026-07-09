'use client'

import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import { StatusBadge } from '@/components/StatusBadge'
import { formatNumber } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Withdraw {
  id: string
  amount: string
  status: 'pending' | 'completed' | 'rejected'
  bankName: string
  bankAccNumber: string
  userId: string
  user: { name: string; email: string }
}

export default function WithdrawsPage() {
  const { user, loading } = useAuth()
  const [withdraws, setWithdraws] = useState<Withdraw[]>([])

  useEffect(() => {
    const fetchWithdraws = async () => {
      try {
        const res = await fetch('/api/admin/withdraws')
        if (res.ok) {
          const data = await res.json()
          setWithdraws(data)
        }
      } catch (error) {
        console.error('Failed to fetch withdraws:', error)
      }
    }

    fetchWithdraws()
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user?.isAdmin) return null

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/withdraws/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      })
      if (res.ok) {
        toast.success('Withdraw approved')
        setWithdraws(withdraws.map(w => w.id === id ? { ...w, status: 'completed' } : w))
      }
    } catch (error) {
      toast.error('Failed to approve withdraw')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-orbitron font-bold mb-8">Withdraw Requests</h1>

        <div className="bg-card border border-primary/20 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20">
                <th className="px-6 py-3 text-left text-primary">User</th>
                <th className="px-6 py-3 text-left text-primary">Amount</th>
                <th className="px-6 py-3 text-left text-primary">Bank</th>
                <th className="px-6 py-3 text-left text-primary">Account</th>
                <th className="px-6 py-3 text-left text-primary">Status</th>
                <th className="px-6 py-3 text-left text-primary">Action</th>
              </tr>
            </thead>
            <tbody>
              {withdraws.map(withdraw => (
                <tr key={withdraw.id} className="border-b border-primary/10 hover:bg-background/50">
                  <td className="px-6 py-4">
                    <div>{withdraw.user.name}</div>
                    <div className="text-sm text-gray-400">{withdraw.user.email}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary">{formatNumber(BigInt(withdraw.amount))}</td>
                  <td className="px-6 py-4">{withdraw.bankName}</td>
                  <td className="px-6 py-4 text-sm">{withdraw.bankAccNumber}</td>
                  <td className="px-6 py-4"><StatusBadge status={withdraw.status} /></td>
                  <td className="px-6 py-4">
                    {withdraw.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(withdraw.id)}
                        className="px-3 py-1 bg-success hover:bg-success/80 rounded text-sm font-bold"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
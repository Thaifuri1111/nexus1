'use client'

import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { formatNumber } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function WithdrawPage() {
  const { user, loading } = useAuth()
  const [amount, setAmount] = useState('10000')
  const [bankName, setBankName] = useState('')
  const [bankAcc, setBankAcc] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: BigInt(amount), bankName, bankAccNumber: bankAcc }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Withdraw failed')
      }

      toast.success('Withdraw request submitted!')
      setAmount('10000')
      setBankName('')
      setBankAcc('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Withdraw failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-orbitron font-bold mb-8 text-center">WITHDRAW COINS</h1>

        <div className="bg-card border border-primary/20 rounded-lg p-8 mb-6">
          <div className="text-center">
            <div className="text-gray-400 mb-2">Available Balance</div>
            <div className="text-4xl font-bold text-primary">{formatNumber(user.coins)}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-primary/20 rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-primary font-bold mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white text-lg"
              min="10000"
              max={user.coins.toString()}
              required
            />
            <div className="text-sm text-gray-400 mt-2">Min: 10,000 | Max: {formatNumber(user.coins)}</div>
          </div>

          <div>
            <label className="block text-primary font-bold mb-2">Bank Name</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white"
              required
            />
          </div>

          <div>
            <label className="block text-primary font-bold mb-2">Account Number</label>
            <input
              type="text"
              value={bankAcc}
              onChange={(e) => setBankAcc(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 bg-primary hover:bg-primary/80 disabled:opacity-50 text-black font-bold rounded-lg transition-all"
          >
            {submitting ? 'Processing...' : 'Submit Withdraw Request'}
          </button>
        </form>
      </div>
    </main>
  )
}
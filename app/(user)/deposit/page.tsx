'use client'

import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { formatNumber } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function DepositPage() {
  const { user, loading } = useAuth()
  const [amount, setAmount] = useState('10000')
  const [method, setMethod] = useState('bank')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: BigInt(amount), method }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Deposit failed')
      }

      toast.success('Deposit request submitted! Admin will review it soon.')
      setAmount('10000')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Deposit failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-orbitron font-bold mb-8 text-center">DEPOSIT FUNDS</h1>

        <form onSubmit={handleSubmit} className="bg-card border border-primary/20 rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-primary font-bold mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white text-lg"
              min="10000"
              required
            />
            <div className="text-sm text-gray-400 mt-2">Minimum: 10,000</div>
          </div>

          <div>
            <label className="block text-primary font-bold mb-2">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white text-lg"
            >
              <option value="bank">Bank Transfer</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="card">Credit Card</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 bg-primary hover:bg-primary/80 disabled:opacity-50 text-black font-bold rounded-lg transition-all"
          >
            {submitting ? 'Processing...' : 'Submit Deposit Request'}
          </button>
        </form>
      </div>
    </main>
  )
}
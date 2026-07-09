'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface ConvertStatus {
  tapCoins: number
  keys: number
  todayConverted: number
  remainingKeys: number
  maxKeysPerDay: number
  coinsPerKey: number
  canConvert: boolean
}

export default function ConvertButton() {
  const [status, setStatus] = useState<ConvertStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [converting, setConverting] = useState(false)
  const [amount, setAmount] = useState(1)

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/convert')
      const data = await res.json()
      if (data.success) {
        setStatus(data.data)
      }
    } catch (error) {
      toast.error('Gagal mengambil status')
    } finally {
      setLoading(false)
    }
  }

  const handleConvert = async () => {
    if (converting || !status || !status.canConvert) return

    setConverting(true)
    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Gagal convert')
      }

      toast.success(data.message)
      fetchStatus()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setConverting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading...</div>
  }

  if (!status) {
    return <div className="text-center py-8 text-red-500">Gagal memuat data</div>
  }

  return (
    <div className="bg-card p-6 rounded-xl space-y-4">
      <h3 className="text-xl font-bold text-primary">🔄 Convert Coin → Kunci</h3>
      <p className="text-sm text-gray-400">
        {status.coinsPerKey} coin = 1 kunci. Maks {status.maxKeysPerDay} kunci/hari.
      </p>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-background p-3 rounded-lg">
          <p className="text-xs text-gray-400">Coin</p>
          <p className="text-xl font-bold text-yellow-400">{status.tapCoins}</p>
        </div>
        <div className="bg-background p-3 rounded-lg">
          <p className="text-xs text-gray-400">Kunci</p>
          <p className="text-xl font-bold text-green-400">{status.keys}</p>
        </div>
      </div>

      <div className="bg-background p-3 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Hari ini:</span>
          <span>{status.todayConverted} / {status.maxKeysPerDay} kunci</span>
        </div>
        <div className="w-full bg-card rounded-full h-2 mt-1">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${(status.todayConverted / status.maxKeysPerDay) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <select
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          className="w-24 px-3 py-2 bg-background rounded-lg border border-primary/20 focus:border-primary outline-none"
          disabled={!status.canConvert || converting}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          disabled={!status.canConvert || converting}
          className={`flex-1 py-2 font-bold rounded-lg transition ${
            status.canConvert && !converting
              ? 'bg-primary text-black hover:opacity-80'
              : 'bg-gray-600/20 text-gray-500 cursor-not-allowed'
          }`}
        >
          {converting ? '🔄...' : '🔄 Convert'}
        </button>
      </div>

      {!status.canConvert && (
        <div className="bg-background p-3 rounded-lg">
          <p className="text-xs text-red-400">
            {status.remainingKeys <= 0 
              ? '⚠️ Batas convert hari ini sudah habis!' 
              : `⚠️ Coin tidak cukup. Butuh ${status.coinsPerKey} coin.`}
          </p>
        </div>
      )}
    </div>
  )
}

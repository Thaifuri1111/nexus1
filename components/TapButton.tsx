'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface TapStatus {
  currentTaps: number
  maxTaps: number
  remaining: number
  tapCoins: number
  keys: number
  progress: number
  tapsUntilRoll: number
  tapPerRoll: number
}

export default function TapButton() {
  const [status, setStatus] = useState<TapStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [tapping, setTapping] = useState(false)
  const [tapCount, setTapCount] = useState(0)
  const [coins, setCoins] = useState(0)
  const [keys, setKeys] = useState(0)
  const [keyMessage, setKeyMessage] = useState('')

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/tap')
      const data = await res.json()
      if (data.success) {
        setStatus(data.data)
      }
    } catch (error) {
      toast.error('Gagal mengambil status tap')
    } finally {
      setLoading(false)
    }
  }

  const handleTap = async () => {
    if (tapping || !status || status.remaining <= 0) return

    setTapping(true)
    try {
      const res = await fetch('/api/tap', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Gagal tap')
      }

      setTapCount(prev => prev + 1)
      setCoins(prev => prev + data.coins)
      setKeys(prev => prev + data.keys)
      
      if (data.keyMessage) {
        setKeyMessage(data.keyMessage)
        toast(data.keyMessage)
      }

      setStatus(prev => prev ? {
        ...prev,
        currentTaps: data.totalTaps,
        remaining: data.remaining,
        tapCoins: prev.tapCoins + data.coins,
        keys: prev.keys + data.keys,
        progress: (data.totalTaps / prev.maxTaps) * 100,
        tapsUntilRoll: data.isRoll ? prev.tapPerRoll : prev.tapsUntilRoll - 1,
      } : null)

    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setTapping(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading...</div>
  }

  if (!status) {
    return <div className="text-center py-8 text-red-500">Gagal memuat data</div>
  }

  const isComplete = status.remaining <= 0

  return (
    <div className="bg-card p-6 rounded-xl space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-primary">🖐️ Free Tap</h3>
          <p className="text-sm text-gray-400">
            {status.currentTaps} / {status.maxTaps} tap
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Kunci</p>
          <p className="text-xl font-bold text-green-400">{status.keys}</p>
        </div>
      </div>

      <div className="w-full bg-background rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-primary'}`}
          style={{ width: `${Math.min(100, status.progress)}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span>Tap {status.currentTaps}</span>
        <span>{isComplete ? '✅ Selesai!' : `${status.remaining} tap lagi`}</span>
      </div>

      {status.tapsUntilRoll > 0 && !isComplete && (
        <div className="text-center text-xs text-primary">
          🔄 {status.tapsUntilRoll} tap lagi untuk roll kunci
        </div>
      )}

      <button
        onClick={handleTap}
        disabled={tapping || isComplete}
        className={`w-full py-4 text-xl font-bold rounded-xl transition ${
          isComplete
            ? 'bg-green-500/20 text-green-500 cursor-not-allowed'
            : tapping
            ? 'bg-primary/50 text-black cursor-not-allowed'
            : 'bg-primary text-black hover:opacity-80 active:scale-95'
        }`}
      >
        {isComplete ? '✅ Tap Selesai!' : tapping ? '🔄 Tapping...' : '👆 TAP'}
      </button>

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="bg-background p-2 rounded-lg">
          <p className="text-gray-400">Tap</p>
          <p className="font-bold text-primary">{tapCount}</p>
        </div>
        <div className="bg-background p-2 rounded-lg">
          <p className="text-gray-400">Coins</p>
          <p className="font-bold text-yellow-400">{coins}</p>
        </div>
        <div className="bg-background p-2 rounded-lg">
          <p className="text-gray-400">Kunci</p>
          <p className="font-bold text-green-400">{keys}</p>
        </div>
      </div>

      {keyMessage && (
        <div className="bg-background p-2 rounded-lg text-center text-sm text-primary">
          {keyMessage}
        </div>
      )}

      <div className="bg-background p-3 rounded-lg">
        <p className="text-xs text-gray-400">
          💡 Setiap {status.tapPerRoll} tap dapat 3-5 kunci. 
          Kumpulkan 500 kunci untuk withdraw!
        </p>
      </div>
    </div>
  )
}

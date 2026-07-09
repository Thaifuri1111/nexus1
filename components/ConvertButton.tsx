'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface ConvertButtonProps {
  coins: bigint
  onSuccess?: () => void
}

export function ConvertButton({ coins, onSuccess }: ConvertButtonProps) {
  const [converting, setConverting] = useState(false)

  const handleConvert = async () => {
    if (converting || coins === 0n) return

    setConverting(true)
    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromCoins: coins.toString() }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Conversion failed')
      }

      toast.success('Conversion successful!')
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Conversion failed')
    } finally {
      setConverting(false)
    }
  }

  return (
    <button
      onClick={handleConvert}
      disabled={converting || coins === 0n}
      className="px-6 py-2 bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-all"
    >
      {converting ? 'Converting...' : 'Convert'}
    </button>
  )
}
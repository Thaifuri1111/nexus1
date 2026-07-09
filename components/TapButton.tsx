'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface TapButtonProps {
  onClick?: () => void
  disabled?: boolean
  multiplier?: number
}

export function TapButton({ onClick, disabled = false, multiplier = 1 }: TapButtonProps) {
  const [tapping, setTapping] = useState(false)

  const handleTap = async () => {
    if (tapping || disabled) return

    setTapping(true)
    try {
      const res = await fetch('/api/tap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ multiplier }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Tap failed')
      }

      onClick?.()
      toast.success('Tap successful!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Tap failed')
    } finally {
      setTapping(false)
    }
  }

  return (
    <button
      onClick={handleTap}
      disabled={tapping || disabled}
      className="relative w-40 h-40 rounded-full bg-gradient-to-br from-primary to-secondary hover:from-primary hover:to-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 animate-glowPulse"
    >
      <div className="absolute inset-0 flex items-center justify-center text-4xl">
        ⚡
      </div>
      <div className="text-sm font-bold text-white mt-32">TAP</div>
    </button>
  )
}
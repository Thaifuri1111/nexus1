'use client'
import TapButton from '@/components/TapButton'

export default function TapPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">🖐️ Free Tap</h1>
      <p className="text-gray-400 text-sm">
        Tap sebanyak 500x untuk mengumpulkan kunci. 
        Setiap 30 tap dapat 3-5 kunci!
      </p>
      <TapButton />
    </div>
  )
}